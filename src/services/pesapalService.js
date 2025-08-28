import CryptoJS from 'crypto-js';

class PesaPalService {
  constructor() {
    // PesaPal credentials
    this.consumerKey = 'oi8kiBIenB6FYAVE7UoM4XQVV1NkFEQ2';
    this.consumerSecret = 'K2C+Cp4AFy2XV/ancyeyfbZYbPs=';
    
    // PesaPal endpoints (sandbox for testing, change to production when ready)
    this.baseUrl = 'https://demo.pesapal.com'; // Change to https://www.pesapal.com for production
    this.iframeUrl = 'https://demo.pesapal.com/pesapaliframe3/PesapalIframe3';
  }

  // Generate OAuth signature for PesaPal API
  generateOAuthSignature(method, url, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    const signatureBaseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    
    return CryptoJS.HmacSHA1(signatureBaseString, this.consumerSecret).toString(CryptoJS.enc.Base64);
  }

  // Create IPN (Instant Payment Notification) URL
  createIPNUrl() {
    // This should be your server endpoint that PesaPal will call with payment updates
    return `${window.location.origin}/api/pesapal/ipn`;
  }

  // Generate unique order ID
  generateOrderId() {
    return `STORY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create payment request
  async createPaymentRequest(donationData) {
    try {
      const orderId = this.generateOrderId();
      const ipnUrl = this.createIPNUrl();
      
      const paymentData = {
        oauth_consumer_key: this.consumerKey,
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
          callback_url: `${window.location.origin}/donate/success?order_id=${orderId}`,
          ipn_url: ipnUrl
        })
      };

      // Generate OAuth signature
      const signature = this.generateOAuthSignature('POST', `${this.baseUrl}/api/PostPesapalOrder`, paymentData);
      paymentData.oauth_signature = signature;

      // Create authorization header
      const authHeader = Object.keys(paymentData)
        .filter(key => key.startsWith('oauth_'))
        .map(key => `${key}="${encodeURIComponent(paymentData[key])}"`)
        .join(',');

      const response = await fetch(`${this.baseUrl}/api/PostPesapalOrder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `OAuth ${authHeader}`
        },
        body: new URLSearchParams(paymentData)
      });

      if (!response.ok) {
        throw new Error(`PesaPal API error: ${response.status}`);
      }

      const result = await response.text();
      
      // PesaPal returns the order tracking ID
      return {
        success: true,
        orderId: orderId,
        trackingId: result,
        iframeUrl: `${this.iframeUrl}?OrderTrackingId=${result}&amp;merchantReference=${orderId}`
      };

    } catch (error) {
      console.error('PesaPal payment creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Check payment status
  async checkPaymentStatus(trackingId) {
    try {
      const params = {
        oauth_consumer_key: this.consumerKey,
        oauth_nonce: Math.random().toString(36).substr(2, 15),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000),
        oauth_version: '1.0',
        pesapal_merchant_reference: trackingId
      };

      const signature = this.generateOAuthSignature('GET', `${this.baseUrl}/api/QueryPaymentStatus`, params);
      params.oauth_signature = signature;

      const authHeader = Object.keys(params)
        .filter(key => key.startsWith('oauth_'))
        .map(key => `${key}="${encodeURIComponent(params[key])}"`)
        .join(',');

      const response = await fetch(`${this.baseUrl}/api/QueryPaymentStatus?pesapal_merchant_reference=${trackingId}`, {
        headers: {
          'Authorization': `OAuth ${authHeader}`
        }
      });

      if (!response.ok) {
        throw new Error(`PesaPal API error: ${response.status}`);
      }

      const result = await response.text();
      
      // Parse the XML response to get payment status
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(result, 'text/xml');
      const paymentStatus = xmlDoc.querySelector('PaymentStatus')?.textContent;
      const paymentMethod = xmlDoc.querySelector('PaymentMethod')?.textContent;

      return {
        success: true,
        status: paymentStatus,
        method: paymentMethod,
        trackingId: trackingId
      };

    } catch (error) {
      console.error('PesaPal status check error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get iframe URL for payment
  getPaymentIframeUrl(trackingId, orderId) {
    return `${this.iframeUrl}?OrderTrackingId=${trackingId}&amp;merchantReference=${orderId}`;
  }
}

const pesapalService = new PesaPalService();
export default pesapalService;
