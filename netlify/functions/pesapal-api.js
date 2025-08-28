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

    // Validate PesaPal credentials
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
    
    if (!consumerKey || !consumerSecret) {
      throw new Error('PesaPal credentials not configured in environment variables');
    }

    // Determine environment and base URL
    const environment = process.env.PESAPAL_ENVIRONMENT || 'demo';
    const isProduction = environment === 'production';
    const baseUrl = isProduction ? 'https://www.pesapal.com' : 'https://demo.pesapal.com';
    
    console.log('Environment configuration:', {
      environment,
      isProduction,
      baseUrl,
      credentialsConfigured: !!(consumerKey && consumerSecret)
    });

    // Add a test endpoint for debugging
    if (action === 'test') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'PesaPal API function is working',
          environment,
          baseUrl,
          timestamp: new Date().toISOString()
        })
      };
    }

    if (action === 'createPaymentRequest') {
      try {
        // Validate donation data
        if (!donationData.amount || donationData.amount <= 0) {
          throw new Error('Invalid donation amount');
        }

        // Generate OAuth signature for PesaPal API
        const generateOAuthSignature = (method, url, params) => {
          try {
            const sortedParams = Object.keys(params)
              .sort()
              .map(key => `${key}=${encodeURIComponent(params[key])}`)
              .join('&');

            const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
            
            return crypto.createHmac('sha1', consumerSecret).update(signatureBaseString).digest('base64');
          } catch (signatureError) {
            throw new Error(`OAuth signature generation failed: ${signatureError.message}`);
          }
        };

        // Generate unique order ID
        const orderId = `STORY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Get the origin from the request headers
        const origin = event.headers.origin || event.headers.Origin || 'https://storymatters-website.netlify.app';
        const ipnUrl = `${origin}/.netlify/functions/pesapal-ipn`;
        
        console.log('Generated order details:', { orderId, origin, ipnUrl });

        const paymentData = {
          oauth_consumer_key: consumerKey,
          oauth_nonce: Math.random().toString(36).substr(2, 15),
          oauth_signature_method: 'HMAC-SHA1',
          oauth_timestamp: Math.floor(Date.now() / 1000),
          oauth_version: '1.0',
          pesapal_request_data: JSON.stringify({
            id: orderId,
            currency: 'USD',
            amount: donationData.amount,
            description: `Donation to Story Matters: ${donationData.description}`,
            type: 'MERCHANT',
            reference: orderId,
            first_name: donationData.firstName || 'Anonymous',
            last_name: donationData.lastName || 'Donor',
            email: donationData.email,
            phone_number: donationData.phone || '',
            callback_url: `${origin}/donate/success?order_id=${orderId}`,
            ipn_url: ipnUrl
          })
        };

        // Generate OAuth signature
        const signature = generateOAuthSignature('POST', `${baseUrl}/api/PostPesapalOrder`, paymentData);
        paymentData.oauth_signature = signature;

        // Create authorization header
        const authHeader = Object.keys(paymentData)
          .filter(key => key.startsWith('oauth_'))
          .map(key => `${key}="${encodeURIComponent(paymentData[key])}"`)
          .join(',');

        // Prepare POST data
        const postData = new URLSearchParams(paymentData).toString();

        console.log('Making request to PesaPal:', {
          url: `${baseUrl}/api/PostPesapalOrder`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `OAuth ${authHeader}`,
            'Content-Length': Buffer.byteLength(postData)
          }
        });

        // Make the request to PesaPal using https module
        const response = await makeHttpsRequest(`${baseUrl}/api/PostPesapalOrder`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `OAuth ${authHeader}`,
            'Content-Length': Buffer.byteLength(postData)
          }
        }, postData);

        console.log('PesaPal response received:', {
          statusCode: response.statusCode,
          bodyLength: response.body ? response.body.length : 0
        });

        if (response.statusCode !== 200) {
          throw new Error(`PesaPal API returned status ${response.statusCode}: ${response.body || 'No response body'}`);
        }

        const result = response.body;
        
        if (!result) {
          throw new Error('PesaPal API returned empty response');
        }
        
        console.log('Payment request successful:', { orderId, trackingId: result });
        
        // PesaPal returns the order tracking ID
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            orderId: orderId,
            trackingId: result,
            iframeUrl: `${baseUrl}/pesapaliframe3/PesapalIframe3?OrderTrackingId=${result}&amp;merchantReference=${orderId}`
          })
        };
      } catch (paymentError) {
        console.error('Payment request failed:', paymentError);
        throw new Error(`Payment request failed: ${paymentError.message}`);
      }

    } else if (action === 'checkPaymentStatus') {
      try {
        // Handle payment status check
        const { trackingId } = donationData;
        
        if (!trackingId) {
          throw new Error('Tracking ID is required for payment status check');
        }
        
        const params = {
          oauth_consumer_key: consumerKey,
          oauth_nonce: Math.random().toString(36).substr(2, 15),
          oauth_signature_method: 'HMAC-SHA1',
          oauth_timestamp: Math.floor(Date.now() / 1000),
          oauth_version: '1.0',
          pesapal_merchant_reference: trackingId
        };

        const generateOAuthSignature = (method, url, params) => {
          const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

          const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
          
          return crypto.createHmac('sha1', consumerSecret).update(signatureBaseString).digest('base64');
        };

        const signature = generateOAuthSignature('GET', `${baseUrl}/api/QueryPaymentStatus`, params);
        params.oauth_signature = signature;

        const authHeader = Object.keys(params)
          .filter(key => key.startsWith('oauth_'))
          .map(key => `${key}="${encodeURIComponent(params[key])}"`)
          .join(',');

        const response = await makeHttpsRequest(`${baseUrl}/api/QueryPaymentStatus?pesapal_merchant_reference=${trackingId}`, {
          method: 'GET',
          headers: {
            'Authorization': `OAuth ${authHeader}`
          }
        });

        if (response.statusCode !== 200) {
          throw new Error(`PesaPal API error: ${response.statusCode}`);
        }

        const result = response.body;
        
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            success: true,
            status: 'Payment status retrieved',
            trackingId: trackingId,
            rawResponse: result
          })
        };
      } catch (statusError) {
        console.error('Payment status check failed:', statusError);
        throw new Error(`Payment status check failed: ${statusError.message}`);
      }

    } else {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          success: false,
          error: 'Invalid action specified',
          message: `Unknown action: ${action}`
        })
      };
    }

  } catch (error) {
    console.error('PesaPal API error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
