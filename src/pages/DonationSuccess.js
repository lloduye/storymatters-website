import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useScrollToTop } from '../utils/useScrollToTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHeart, faShare, faEnvelope, faHome } from '@fortawesome/free-solid-svg-icons';

const DonationSuccess = () => {
  useScrollToTop();
  const [searchParams] = useSearchParams();
  const [donationData, setDonationData] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const amount = searchParams.get('amount');
    
    if (orderId) {
      setDonationData({
        orderId,
        amount: amount || 'Unknown'
      });
    }
  }, [searchParams]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I just donated to Story Matters!',
          text: 'Join me in supporting refugee youth through creative arts and media training.',
          url: window.location.origin
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard!');
    }
  };

  const handleEmailShare = () => {
    const subject = 'Join me in supporting Story Matters';
    const body = `Hi there!

I just made a donation to Story Matters, an organization that supports refugee youth through creative arts and media training.

Your donation can make a real difference in the lives of these young people. Consider joining me in supporting this important cause.

Learn more at: ${window.location.origin}

Best regards`;
    
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Success Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faCheckCircle} className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Thank You for Your Donation!
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Your generosity will create lasting impact in the lives of refugee youth. 
            You'll receive a confirmation email with your donation details shortly.
          </p>
        </div>
      </section>

      {/* Donation Details */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Donation Confirmation
            </h2>
            
            {donationData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium text-gray-900">{donationData.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-gray-900">${donationData.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What Happens Next</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>✓ Confirmation email sent</p>
                    <p>✓ Payment processed securely</p>
                    <p>✓ Funds allocated to programs</p>
                    <p>✓ Impact updates coming soon</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading donation details...</p>
              </div>
            )}

            {/* Impact Information */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Your Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mx-auto mb-3">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Direct Support</h4>
                  <p className="text-sm text-gray-600">
                    100% of your donation goes directly to youth programs
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl mx-auto mb-3">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Skills Development</h4>
                  <p className="text-sm text-gray-600">
                    Youth learn creative arts, media production, and life skills
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mx-auto mb-3">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community Building</h4>
                  <p className="text-sm text-gray-600">
                    Stronger, more resilient communities through youth empowerment
                  </p>
                </div>
              </div>
            </div>

            {/* Share and Next Steps */}
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Help Us Spread the Word
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleShare}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faShare} className="mr-2" />
                    Share Your Support
                  </button>
                  
                  <button
                    onClick={handleEmailShare}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Email Friends
                  </button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Continue Your Journey
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/stories"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    Read Our Stories
                  </Link>
                  
                  <Link
                    to="/get-involved"
                    className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    Get Involved
                  </Link>
                  
                  <Link
                    to="/"
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faHome} className="mr-2" />
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay Connected */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Connected
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Follow our journey and see the real impact of your donation through regular updates, 
            success stories, and opportunities to get involved.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Newsletter</h3>
              <p className="text-gray-600 mb-4">
                Get monthly updates on our programs and impact
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200">
                Subscribe
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media</h3>
              <p className="text-gray-600 mb-4">
                Follow us for real-time updates and stories
              </p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors duration-200">
                Follow Us
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Volunteer</h3>
              <p className="text-gray-600 mb-4">
                Join our team and make a hands-on difference
              </p>
              <Link
                to="/get-involved"
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors duration-200 inline-block"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DonationSuccess;
