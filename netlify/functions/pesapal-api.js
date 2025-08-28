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

    // Add a test endpoint for debugging
    if (action === 'test') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          message: 'PesaPal API function is working',
          timestamp: new Date().toISOString(),
          environment: process.env.PESAPAL_ENVIRONMENT || 'demo',
          credentialsConfigured: !!(process.env.PESAPAL_CONSUMER_KEY && process.env.PESAPAL_CONSUMER_SECRET)
        })
      };
    }

    // For now, just return a mock response for createPaymentRequest
    if (action === 'createPaymentRequest') {
      const orderId = `STORY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const trackingId = `TRACK_${Date.now()}`;
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          orderId: orderId,
          trackingId: trackingId,
          iframeUrl: `https://demo.pesapal.com/pesapaliframe3/PesapalIframe3?OrderTrackingId=${trackingId}&amp;merchantReference=${orderId}`,
          message: 'Mock payment request created for testing'
        })
      };
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
