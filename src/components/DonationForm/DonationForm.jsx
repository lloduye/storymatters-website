import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './DonationForm.css';

const stripePromise = loadStripe('your_publishable_key'); // Replace with your Stripe publishable key

const DonationForm = () => {
  const [amount, setAmount] = useState('');
  const [donationType, setDonationType] = useState('one-time');
  const [isLoading, setIsLoading] = useState(false);

  const predefinedAmounts = [10, 25, 50, 100];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const stripe = await stripePromise;
      
      // Create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          donationType,
        }),
      });

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="donation-form-container">
      <form onSubmit={handleSubmit} className="donation-form">
        <h2>Support Our Mission</h2>
        
        <div className="donation-type">
          <button
            type="button"
            className={donationType === 'one-time' ? 'active' : ''}
            onClick={() => setDonationType('one-time')}
          >
            One-time
          </button>
          <button
            type="button"
            className={donationType === 'monthly' ? 'active' : ''}
            onClick={() => setDonationType('monthly')}
          >
            Monthly
          </button>
        </div>

        <div className="amount-buttons">
          {predefinedAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              className={amount === preset.toString() ? 'active' : ''}
              onClick={() => setAmount(preset.toString())}
            >
              ${preset}
            </button>
          ))}
        </div>

        <div className="custom-amount">
          <label htmlFor="custom-amount">Custom Amount</label>
          <div className="input-wrapper">
            <span>$</span>
            <input
              type="number"
              id="custom-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="donate-submit-btn"
          disabled={!amount || isLoading}
        >
          {isLoading ? 'Processing...' : `Donate $${amount || '0'}`}
        </button>
      </form>
    </div>
  );
};

export default DonationForm; 