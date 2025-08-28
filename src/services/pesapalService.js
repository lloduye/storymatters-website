// CryptoJS is no longer needed as OAuth signature generation is handled by Netlify functions

class PesaPalService {
  constructor() {
    // PesaPal credentials
    this.consumerKey = 'oi8kiBIenB6FYAVE7UoM4XQVV1NkFEQ2';
    this.consumerSecret = 'K2C+Cp4AFy2XV/ancyeyfbZYbPs=';
    
    // PesaPal endpoints (sandbox for testing, change to production when ready)
    this.baseUrl = 'https://demo.pesapal.com'; // Change to https://www.pesapal.com for production
    this.iframeUrl = 'https://demo.pesapal.com/pesapaliframe3/PesapalIframe3';
  }

  // Note: OAuth signature generation and order ID generation are now handled by the Netlify function
  // to avoid CORS issues when calling PesaPal directly from the browser

  // Create payment request
  async createPaymentRequest(donationData) {
    try {
      // Call our Netlify function instead of PesaPal directly to avoid CORS issues
      const response = await fetch('/.netlify/functions/pesapal-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createPaymentRequest',
          donationData: donationData
        })
      });

      if (!response.ok) {
        throw new Error(`Netlify function error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          orderId: result.orderId,
          trackingId: result.trackingId,
          iframeUrl: result.iframeUrl
        };
      } else {
        throw new Error(result.error || 'Failed to create payment request');
      }

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
      // Call our Netlify function instead of PesaPal directly to avoid CORS issues
      const response = await fetch('/.netlify/functions/pesapal-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'checkPaymentStatus',
          donationData: { trackingId }
        })
      });

      if (!response.ok) {
        throw new Error(`Netlify function error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          status: result.status,
          trackingId: result.trackingId
        };
      } else {
        throw new Error(result.error || 'Failed to check payment status');
      }

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
