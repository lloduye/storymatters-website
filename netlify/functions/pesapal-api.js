const crypto = require('crypto');
const https = require('https');

// Helper function to make HTTPS requests with timeout and better error handling
function makeHttpsRequest(url, options, postData = null) {
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(url);
      
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: options.headers || {},
        timeout: 30000 // 30 second timeout
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('error', (error) => {
        reject(new Error(`HTTPS request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('HTTPS request timed out'));
      });

      if (postData) {
        req.write(postData);
      }
      
      req.end();
    } catch (error) {
      reject(new Error(`Failed to create HTTPS request: ${error.message}`));
    }
  });
}

// Generate OAuth 1.0 signature for PesaPal
function generateOAuthSignature(method, url, params, consumerSecret) {
  const sortedParams = Object.keys(params).sort().map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
  const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
  
  const hmac = crypto.createHmac('sha1', consumerSecret + '&');
  hmac.update(signatureBaseString);
  return hmac.digest('base64');
}

exports.handler = async (event, context) => {
  // Set CORS headers for ALL responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        error: 'Method not allowed',
        message: 'Only POST requests are supported'
      })
    };
  }

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Request body is missing');
    }

    let body;
    try {
      body = JSON.parse(event.body);
    } catch (parseError) {
      throw new Error(`Invalid JSON in request body: ${parseError.message}`);
    }

    if (!body.action || !body.donationData) {
      throw new Error('Missing required fields: action and donationData');
    }

    const { action, donationData } = body;
    
    console.log('Processing request:', { action, donationData: { ...donationData, amount: donationData.amount } });

    // Get PesaPal credentials from environment
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    const environment = process.env.PESAPAL_ENVIRONMENT || 'demo';
    
    if (!consumerKey || !consumerSecret) {
      throw new Error('PesaPal credentials not configured');
    }

    // Set base URL based on environment
    const baseUrl = environment === 'production' 
      ? 'https://www.pesapal.com' 
      : 'https://demo.pesapal.com';

    // Add a test endpoint for debugging
    if (action === 'test') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'PesaPal API function is working',
          timestamp: new Date().toISOString(),
          environment: environment,
          credentialsConfigured: !!(consumerKey && consumerSecret),
          baseUrl: baseUrl
        })
      };
    }

    // Create real PesaPal payment request
    if (action === 'createPaymentRequest') {
      // Validate required fields
      if (!donationData.amount || !donationData.email) {
        throw new Error('Amount and email are required for donation');
      }
      
      if (!donationData.firstName && !donationData.name) {
        throw new Error('First name is required for donation');
      }
      
      const orderId = `STORY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const trackingId = `TRACK_${Date.now()}`;
      
      // Get the origin from the request headers for dynamic IPN URL
      const origin = event.headers.origin || event.headers.referer || 'https://storymatters-website.netlify.app';
      const ipnUrl = `${origin}/.netlify/functions/pesapal-ipn`;
      const callbackUrl = `${origin}/donate/success?order_id=${orderId}&amount=${donationData.amount}`;

      // PesaPal API endpoint
      const pesapalUrl = `${baseUrl}/api/PostPesapalDirectOrderV4`;
      
      // Safely handle name fields - the form sends firstName and lastName separately
      const firstName = donationData.firstName || 'Donor';
      const lastName = donationData.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      // Prepare the request data
      const requestData = {
        oauth_callback: callbackUrl,
        oauth_consumer_key: consumerKey,
        oauth_nonce: Math.random().toString(36).substr(2, 15),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_version: '1.0',
        pesapal_request_data: JSON.stringify({
          id: orderId,
          currency: 'KES',
          amount: donationData.amount,
          description: `Donation to Story Matters Entertainment - ${fullName}`,
          type: 'MERCHANT',
          reference: orderId,
          first_name: firstName,
          last_name: lastName,
          email: donationData.email,
          phone_number: donationData.phone || '',
          ipn_notification_type: 'IPN',
          ipn_id: ipnUrl
        })
      };

      // Generate OAuth signature
      requestData.oauth_signature = generateOAuthSignature('POST', pesapalUrl, requestData, consumerSecret);

      // Convert to form data
      const formData = Object.keys(requestData)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(requestData[key])}`)
        .join('&');

      try {
        console.log('Calling PesaPal API:', pesapalUrl);
        
        const response = await makeHttpsRequest(pesapalUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(formData)
          }
        }, formData);

        console.log('PesaPal API response:', response);

        if (response.statusCode === 200) {
          // Parse PesaPal response
          const pesapalResponse = response.body;
          
          // Extract tracking ID from PesaPal response
          const trackingMatch = pesapalResponse.match(/OrderTrackingId=([^&]+)/);
          const actualTrackingId = trackingMatch ? trackingMatch[1] : trackingId;
          
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
              success: true,
              orderId: orderId,
              trackingId: actualTrackingId,
              iframeUrl: `${baseUrl}/pesapaliframe3/PesapalIframe3?OrderTrackingId=${actualTrackingId}&merchantReference=${orderId}`,
              message: 'Payment request created successfully'
            })
          };
        } else {
          throw new Error(`PesaPal API returned status ${response.statusCode}: ${response.body}`);
        }
      } catch (apiError) {
        console.error('PesaPal API call failed:', apiError);
        throw new Error(`PesaPal API call failed: ${apiError.message}`);
      }
    }

    // Check payment status
    if (action === 'checkPaymentStatus') {
      const { trackingId } = donationData;
      
      if (!trackingId) {
        throw new Error('Tracking ID is required to check payment status');
      }

      const statusUrl = `${baseUrl}/api/QueryPaymentStatus?pesapal_merchant_reference=${trackingId}`;
      
      try {
        const response = await makeHttpsRequest(statusUrl, {
          method: 'GET',
          headers: {
            'oauth_consumer_key': consumerKey
          }
        });

        if (response.statusCode === 200) {
          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
              success: true,
              status: response.body,
              message: 'Payment status retrieved successfully'
            })
          };
        } else {
          throw new Error(`PesaPal status API returned status ${response.statusCode}`);
        }
      } catch (statusError) {
        console.error('Payment status check failed:', statusError);
        throw new Error(`Payment status check failed: ${statusError.message}`);
      }
    }

    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        error: 'Invalid action specified',
        message: `Unknown action: ${action}`
      })
    };

  } catch (error) {
    console.error('PesaPal API error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
