const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = event.body;
    const formData = new URLSearchParams(body);
    
    // Extract PesaPal IPN data
    const orderTrackingId = formData.get('pesapal_merchant_reference');
    const orderNotificationType = formData.get('pesapal_notification_type');
    const orderMerchantReference = formData.get('pesapal_merchant_reference');
    
    console.log('PesaPal IPN received:', {
      orderTrackingId,
      orderNotificationType,
      orderMerchantReference
    });

    // Here you would typically:
    // 1. Verify the IPN signature (if PesaPal provides one)
    // 2. Update your database with the payment status
    // 3. Send confirmation emails
    // 4. Update order status
    
    // For now, we'll just log the data
    // In production, you should implement proper verification and database updates
    
    // Example response for PesaPal
    const response = `<?xml version="1.0" encoding="utf-8"?>
<pesapal_response xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.pesapal.com">
  <pesapal_response_code>OK</pesapal_response_code>
  <pesapal_response_description>IPN received successfully</pesapal_response_description>
</pesapal_response>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml'
      },
      body: response
    };

  } catch (error) {
    console.error('PesaPal IPN error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
