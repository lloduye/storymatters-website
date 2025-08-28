const crypto = require('crypto');
const https = require('https');

// Helper function to make HTTPS requests
function makeHttpsRequest(url, options, postData = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
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
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    console.log('Received request:', {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body
    });
    
    const body = JSON.parse(event.body);
    const { action, donationData } = body;
    
    console.log('Parsed request data:', { action, donationData });

    // PesaPal credentials from environment variables
    const consumerKey = process.env.PESAPAL_CONSUMER_KEY || 'oi8kiBIenB6FYAVE7UoM4XQVV1NkFEQ2';
    const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET || 'K2C+Cp4AFy2XV/ancyeyfbZYbPs=';
    
    // PesaPal endpoints (use production or demo based on environment)
    const isProduction = process.env.PESAPAL_ENVIRONMENT === 'production';
    const baseUrl = isProduction ? 'https://www.pesapal.com' : 'https://demo.pesapal.com';
    
    console.log('Environment configuration:', {
      consumerKey: consumerKey ? 'SET' : 'NOT SET',
      consumerSecret: consumerSecret ? 'SET' : 'NOT SET',
      environment: process.env.PESAPAL_ENVIRONMENT || 'NOT SET',
      isProduction,
      baseUrl
    });

    if (action === 'createPaymentRequest') {
      // Generate OAuth signature for PesaPal API
      const generateOAuthSignature = (method, url, params) => {
        const sortedParams = Object.keys(params)
          .sort()
          .map(key => `${key}=${encodeURIComponent(params[key])}`)
          .join('&');

        const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
        
        return crypto.createHmac('sha1', consumerSecret).update(signatureBaseString).digest('base64');
      };

      // Generate unique order ID
      const orderId = `STORY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Get the origin from the request headers
      const origin = event.headers.origin || event.headers.Origin || 'https://storymatters-website.netlify.app';
      const ipnUrl = `${origin}/.netlify/functions/pesapal-ipn`;

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

      // Make the request to PesaPal using https module
      const response = await makeHttpsRequest(`${baseUrl}/api/PostPesapalOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `OAuth ${authHeader}`,
          'Content-Length': Buffer.byteLength(postData)
        }
      }, postData);

      if (response.statusCode !== 200) {
        throw new Error(`PesaPal API error: ${response.statusCode}`);
      }

      const result = response.body;
      
      // PesaPal returns the order tracking ID
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          orderId: orderId,
          trackingId: result,
          iframeUrl: `${baseUrl}/pesapaliframe3/PesapalIframe3?OrderTrackingId=${result}&amp;merchantReference=${orderId}`
        })
      };

    } else if (action === 'checkPaymentStatus') {
      // Handle payment status check
      const { trackingId } = donationData;
      
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
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          status: 'Payment status retrieved',
          trackingId: trackingId,
          rawResponse: result
        })
      };

    } else {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Invalid action specified' })
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
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
