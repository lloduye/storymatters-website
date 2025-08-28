import React, { useState } from 'react';
import { useScrollToTop } from '../utils/useScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHandshake, faUsers, faLightbulb, faCreditCard, faShieldAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Donate = () => {
  useScrollToTop();
  
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
  const [paymentStep, setPaymentStep] = useState('form'); // form, payment, success, error
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  const presetAmounts = [25, 50, 100, 250, 500];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getCurrentAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount && !isNaN(customAmount)) return parseFloat(customAmount);
    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const amount = getCurrentAmount();
    if (amount <= 0) {
      setError('Please select or enter a valid donation amount');
      return;
    }

    if (!formData.email) {
      setError('Email is required');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const donationData = {
        amount: amount,
        description: formData.description || 'Donation to Story Matters',
        firstName: formData.firstName || 'Anonymous',
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
    <div className="space-y-8">
      {/* Amount Selection */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Your Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
              <div className="text-2xl font-bold">${amount}</div>
              <div className="text-sm text-gray-600 mt-1">
                {amount === 25 && 'Art Supplies'}
                {amount === 50 && 'Workshop'}
                {amount === 100 && 'Equipment'}
                {amount === 250 && 'Program'}
                {amount === 500 && 'Major Impact'}
              </div>
            </button>
          ))}
        </div>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
          <input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={handleCustomAmount}
            className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            min="1"
            step="0.01"
          />
        </div>
      </div>

      {/* Personal Information Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us why you're donating or leave a message..."
          />
        </div>

        {/* Donation Summary */}
        {getCurrentAmount() > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700">Donation Amount:</span>
              <span className="text-3xl font-bold text-blue-600">${getCurrentAmount().toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Your donation will be processed securely through PesaPal
            </p>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Payment processing is currently being configured. 
                If you encounter any issues, please contact us directly.
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || getCurrentAmount() <= 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Complete Donation - $${getCurrentAmount().toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );

  const renderPayment = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
        <FontAwesomeIcon icon={faCreditCard} className="w-10 h-10 text-blue-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900">Complete Your Donation</h3>
      <p className="text-gray-600 text-lg">
        You're being redirected to PesaPal to complete your secure payment of{' '}
        <span className="font-semibold text-blue-600">${getCurrentAmount().toFixed(2)}</span>
      </p>
      
      <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
        <div className="text-left space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Order ID:</span> {paymentData?.orderId}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Tracking ID:</span> {paymentData?.trackingId}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <a
          href={paymentData?.iframeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
        >
          Continue to Payment
        </a>
        
        <button
          onClick={resetForm}
          className="block w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Back to Form
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <FontAwesomeIcon icon={faCheckCircle} className="w-10 h-10 text-green-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900">Thank You!</h3>
      <p className="text-gray-600 text-lg">
        Your donation of <span className="font-semibold text-blue-600">${getCurrentAmount().toFixed(2)}</span> has been received.
      </p>
      
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto">
        <p className="text-green-700">
          You will receive a confirmation email shortly. Thank you for supporting our mission!
        </p>
      </div>
      
      <button
        onClick={resetForm}
        className="bg-blue-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
      >
        Make Another Donation
      </button>
    </div>
  );

  const renderError = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <FontAwesomeIcon icon={faShieldAlt} className="w-10 h-10 text-red-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900">Something Went Wrong</h3>
      <p className="text-red-600 text-lg">{error}</p>
      
      <button
        onClick={resetForm}
        className="bg-blue-600 text-white py-4 px-8 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Make a Donation
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-white">
            Your support transforms lives and builds brighter futures for refugee youth
          </p>
        </div>
      </section>

      {/* Main Donation Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Support Our Mission</h2>
              <p className="text-gray-600 text-lg">
                Choose an amount and complete your donation in one simple step. Every contribution makes a difference.
              </p>
            </div>
            
            {paymentStep === 'form' && renderForm()}
            {paymentStep === 'payment' && renderPayment()}
            {paymentStep === 'success' && renderSuccess()}
            {paymentStep === 'error' && renderError()}
          </div>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Your Donation Matters</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every dollar you contribute directly supports our programs and creates lasting impact in the lives of refugee youth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-6">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Direct Impact</h3>
              <p className="text-gray-600">
                100% of your donation goes directly to programs, equipment, and opportunities for youth.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mx-auto mb-6">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Education & Skills</h3>
              <p className="text-gray-600">
                Your support provides access to creative arts, media production, and life skills training.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-3xl mx-auto mb-6">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Building</h3>
              <p className="text-gray-600">
                Help create stronger, more resilient communities through youth empowerment and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Secure & Transparent</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your donation is secure, and we provide complete transparency about how your funds are used.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mx-auto mb-4">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payments</h3>
              <p className="text-gray-600">
                All donations are processed through secure, encrypted payment systems to protect your information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mx-auto mb-4">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regular Updates</h3>
              <p className="text-gray-600">
                Receive detailed reports on how your donation is making an impact in our community.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl mx-auto mb-4">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Accountability</h3>
              <p className="text-gray-600">
                We maintain strict financial controls and provide transparent reporting on all expenditures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4 text-lg">
            Have questions about donating? Contact us at{' '}
            <a href="mailto:info@storymattersentertainment.org" className="text-blue-600 hover:text-blue-800 font-semibold">
              info@storymattersentertainment.org
            </a>
          </p>
          <p className="text-gray-500">
            Your donation is tax-deductible. You will receive a receipt via email.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Donate;
