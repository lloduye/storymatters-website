import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faHeart, faSpinner, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import pesapalService from '../services/pesapalService';

const DonationModal = ({ isOpen, onClose, selectedAmount, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    amount: selectedAmount || '',
    message: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('form'); // form, payment, success, error
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount');
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
        amount: parseFloat(formData.amount),
        description: formData.message || 'General donation to Story Matters',
        firstName: formData.firstName || 'Anonymous',
        lastName: formData.lastName || 'Donor',
        email: formData.email,
        phone: formData.phone
      };

      const result = await pesapalService.createPaymentRequest(donationData);

      if (result.success) {
        setPaymentData(result);
        setPaymentStep('payment');
      } else {
        setError(result.error || 'Failed to create payment request');
        setPaymentStep('error');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setPaymentStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentStep('success');
    if (onSuccess) {
      onSuccess(paymentData);
    }
  };

  // const handlePaymentError = () => {
  //   setPaymentStep('error');
  //   setError('Payment was not completed. Please try again.');
  // };

  const resetModal = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      amount: selectedAmount || '',
      message: ''
    });
    setPaymentStep('form');
    setPaymentData(null);
    setError('');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {paymentStep === 'form' && 'Complete Your Donation'}
            {paymentStep === 'payment' && 'Payment Processing'}
            {paymentStep === 'success' && 'Thank You!'}
            {paymentStep === 'error' && 'Payment Error'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentStep === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Last Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (USD) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="25.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Share why you're donating..."
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faHeart} className="mr-2" />
                    Continue to Payment
                  </>
                )}
              </button>
            </form>
          )}

          {paymentStep === 'payment' && paymentData && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mx-auto">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Redirecting to PesaPal
              </h3>
              <p className="text-gray-600">
                You will be redirected to PesaPal to complete your payment securely.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Order ID: {paymentData.orderId}</p>
                <p className="text-sm text-gray-600">Amount: ${paymentData.amount}</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Submit payment directly to PesaPal instead of using iframe
                    if (paymentData.paymentUrl && paymentData.formData) {
                      // Create a form and submit it to PesaPal
                      const form = document.createElement('form');
                      form.method = 'POST';
                      form.action = paymentData.paymentUrl;
                      form.target = '_blank';
                      
                      // Add all form data
                      Object.entries(paymentData.formData).forEach(([key, value]) => {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = value;
                        form.appendChild(input);
                      });
                      
                      // Submit the form
                      document.body.appendChild(form);
                      form.submit();
                      document.body.removeChild(form);
                    } else {
                      // Fallback: open payment URL in new window
                      window.open(
                        paymentData.paymentUrl,
                        'pesapal_payment',
                        'width=800,height=600,scrollbars=yes,resizable=yes'
                      );
                    }
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Continue to Payment
                </button>
                
                <button
                  onClick={handlePaymentSuccess}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-700 transition-colors duration-200"
                >
                  I've Completed Payment
                </button>
              </div>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mx-auto">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Thank You for Your Donation!
              </h3>
              <p className="text-gray-600">
                Your contribution will make a real difference in the lives of refugee youth. 
                You'll receive a confirmation email shortly.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Order ID:</strong> {paymentData?.orderId}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Amount:</strong> ${formData.amount}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          )}

          {paymentStep === 'error' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl mx-auto">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Payment Error
              </h3>
              <p className="text-gray-600">
                {error || 'Something went wrong with your payment. Please try again.'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentStep('form')}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
