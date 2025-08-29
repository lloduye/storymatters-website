const crypto = require('crypto');

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
    const environment = process.env.PESAPAL_ENVIRONMENT || 'production';
    
    if (!consumerKey || !consumerSecret) {
      throw new Error('PesaPal credentials not configured');
    }

    // Set base URL to ALWAYS use production PesaPal API - no more demo/test redirects
    const baseUrl = 'https://www.pesapal.com';
    
    console.log('Using PesaPal production API:', baseUrl);

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
          baseUrl: baseUrl,
          credentialsConfigured: !!(consumerKey && consumerSecret),
          consumerKey: consumerKey ? `${consumerKey.substring(0, 8)}...` : 'Not set',
          consumerSecret: consumerSecret ? `${consumerSecret.substring(0, 8)}...` : 'Not set'
        })
      };
    }

    // Create PesaPal payment request using direct form submission
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

      // Safely handle name fields - the form sends firstName and lastName separately
      const firstName = donationData.firstName || 'Donor';
      const lastName = donationData.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      // Use PesaPal's production API endpoint as specified
      const paymentUrl = `${baseUrl}/API/PostPesapalDirectOrderV4`;
      
      // Create the payment request data according to PesaPal API documentation
      const paymentRequestData = {
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
      };
      
      // Generate OAuth signature for the request
      const oauthParams = {
        oauth_callback: callbackUrl,
        oauth_consumer_key: consumerKey,
        oauth_nonce: Math.random().toString(36).substr(2, 15),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_version: '1.0'
      };

      // Generate OAuth signature (excluding pesapal_request_data from signature)
      const sortedParams = Object.keys(oauthParams).sort().map(key => `${key}=${encodeURIComponent(oauthParams[key])}`).join('&');
      const signatureBaseString = `POST&${encodeURIComponent(paymentUrl)}&${encodeURIComponent(sortedParams)}`;
      
      const hmac = crypto.createHmac('sha1', consumerSecret + '&');
      hmac.update(signatureBaseString);
      const oauthSignature = hmac.digest('base64');

      // Add signature to params
      oauthParams.oauth_signature = oauthSignature;

      // Create the payment form data for direct submission to PesaPal
      // All OAuth parameters must be included as form fields
      const paymentFormData = {
        ...oauthParams,
        pesapal_request_data: JSON.stringify(paymentRequestData)
      };
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          orderId: orderId,
          trackingId: trackingId,
          paymentUrl: paymentUrl,
          formData: paymentFormData,
          message: 'Payment request created successfully. Use the formData to submit payment directly to PesaPal.'
        })
      };
    }

    // Check payment status
    if (action === 'checkPaymentStatus') {
      const { trackingId } = donationData;
      
      if (!trackingId) {
        throw new Error('Tracking ID is required to check payment status');
      }

      const statusUrl = `${baseUrl}/api/QueryPaymentStatus?pesapal_merchant_reference=${trackingId}`;
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          statusUrl: statusUrl,
          message: 'Payment status check endpoint provided'
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
