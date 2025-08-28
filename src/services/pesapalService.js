// CryptoJS is no longer needed as OAuth signature generation is handled by Netlify functions

class PesaPalService {
  constructor() {
    this.baseUrl = '/.netlify/functions/pesapal-api';
  }

  async createPaymentRequest(donationData) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createPaymentRequest',
          donationData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('PesaPal payment creation error:', error);
      throw error;
    }
  }

  async checkPaymentStatus(trackingId) {
    try {
      const response = await fetch(this.baseUrl, {
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
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('PesaPal payment status check error:', error);
      throw error;
    }
  }

  getPaymentIframeUrl(trackingId, orderId) {
    // This will now be provided by the PesaPal API response
    return null;
  }
}

// Export a singleton instance
const pesapalService = new PesaPalService();
export default pesapalService;
