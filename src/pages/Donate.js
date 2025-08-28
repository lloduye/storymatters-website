import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCreditCard, 
  faShieldAlt, 
  faCheckCircle, 
  faExclamationTriangle, 
  faHeart,
  faHandshake,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    description: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  const presetAmounts = [25, 50, 100, 250, 500];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) setSelectedAmount(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getCurrentAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (getCurrentAmount() <= 0) {
      setError('Please select or enter a donation amount');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const donationData = {
        amount: getCurrentAmount(),
        firstName: formData.firstName || 'Donor',
        lastName: formData.lastName || 'Donor',
        email: formData.email,
        phone: formData.phone || ''
      };

      // Import the service dynamically to avoid build issues
      const { default: pesapalService } = await import('../services/pesapalService');
      
      const result = await pesapalService.createPaymentRequest(donationData);
      
      if (result.success) {
        setPaymentData(result);
        setPaymentStep('payment');
      } else {
        throw new Error(result.error || 'Failed to create payment request');
      }
    } catch (error) {
      console.error('Donation error:', error);
      
      // Check if it's a Netlify function not found error
      if (error.message.includes('500') || error.message.includes('Failed to fetch')) {
        setError('Payment service is temporarily unavailable. Please try again later or contact us directly at info@storymattersentertainment.org');
      } else {
        setError(error.message || 'Something went wrong. Please try again.');
      }
      
      setPaymentStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedAmount(null);
    setCustomAmount('');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      description: ''
    });
    setPaymentStep('form');
    setPaymentData(null);
    setError('');
  };

  const renderForm = () => (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Difference Today</h1>
        <p className="text-xl text-gray-600">Your donation supports our mission to empower communities through storytelling</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Amount Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Impact</h3>
          
          {/* Preset Amounts */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleAmountSelect(amount)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                  selectedAmount === amount
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25 hover:shadow-md'
                }`}
              >
                <div className="text-xl font-bold">${amount}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {amount === 25 && 'Art Supplies'}
                  {amount === 50 && 'Workshop'}
                  {amount === 100 && 'Equipment'}
                  {amount === 250 && 'Program'}
                  {amount === 500 && 'Major Impact'}
                </div>
              </button>
            ))}
          </div>
          
          {/* Custom Amount */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={handleCustomAmount}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              min="1"
              step="0.01"
            />
          </div>

          {/* Current Amount Display */}
          {getCurrentAmount() > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">Donation Amount:</span>
                <span className="text-2xl font-bold text-blue-600">${getCurrentAmount().toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Personal Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Share why you're donating or any special message..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing || getCurrentAmount() <= 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faHeart} />
                  <span>Donate ${getCurrentAmount().toFixed(2)}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-8 text-gray-600">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faShieldAlt} className="text-green-500" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faCreditCard} className="text-blue-500" />
            <span>Multiple Payment Methods</span>
          </div>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faHandshake} className="text-purple-500" />
            <span>100% Transparent</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <FontAwesomeIcon icon={faCreditCard} className="text-6xl text-blue-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Donation</h2>
        <p className="text-lg text-gray-600 mb-6">
          You're being redirected to PesaPal's secure payment gateway to complete your donation of <span className="font-bold text-blue-600">${paymentData?.orderId ? getCurrentAmount().toFixed(2) : '0.00'}</span>
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Payment Details</h3>
          <p className="text-blue-700">Order ID: {paymentData?.orderId}</p>
          <p className="text-blue-700">Tracking ID: {paymentData?.trackingId}</p>
        </div>

        <div className="space-y-4">
          <a
            href={paymentData?.iframeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-700 transition-colors duration-200"
          >
            Continue to Payment
          </a>
          
          <button
            onClick={resetForm}
            className="block mx-auto text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            ← Back to Donation Form
          </button>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <FontAwesomeIcon icon={faCheckCircle} className="text-6xl text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Donation!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Your generous contribution of <span className="font-bold text-green-600">${getCurrentAmount().toFixed(2)}</span> will make a real difference in our community.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">What Your Donation Supports</h3>
          <ul className="text-green-700 text-left space-y-1">
            <li>• Community storytelling workshops</li>
            <li>• Youth media training programs</li>
            <li>• Art supplies and equipment</li>
            <li>• Community outreach initiatives</li>
          </ul>
        </div>

        <button
          onClick={resetForm}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors duration-200"
        >
          Make Another Donation
        </button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-6xl text-red-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Something Went Wrong</h2>
        <p className="text-lg text-gray-600 mb-6">{error}</p>
        
        <div className="space-y-4">
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
          
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:info@storymattersentertainment.org" className="text-blue-600 hover:underline">
              info@storymattersentertainment.org
            </a>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {paymentStep === 'form' && renderForm()}
      {paymentStep === 'payment' && renderPayment()}
      {paymentStep === 'success' && renderSuccess()}
      {paymentStep === 'error' && renderError()}
    </div>
  );
};

export default Donate;
