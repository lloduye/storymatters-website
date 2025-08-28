import React, { useState } from 'react';
import { useScrollToTop } from '../utils/useScrollToTop';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHandshake, faUsers, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import DonationModal from '../components/DonationModal';

const Donate = () => {
  useScrollToTop();
  
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount('');
  };

  const handleDonate = (amount) => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    // Open the donation modal with the selected amount
    setSelectedAmount(amount);
    setIsModalOpen(true);
  };

  const handleDonationSuccess = (paymentData) => {
    // Handle successful donation
    console.log('Donation successful:', paymentData);
    // You can add analytics tracking here
  };

  // const openDonationModal = (amount) => {
  //   setSelectedAmount(amount);
  //   setIsModalOpen(true);
  // };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-8 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Make a Donation
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white">
            Your support transforms lives and builds brighter futures for refugee youth
          </p>
        </div>
      </section>

      {/* Why Donate */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Your Donation Matters</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
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
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-6">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Education & Skills</h3>
              <p className="text-gray-600">
                Your support provides access to creative arts, media production, and life skills training.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl mx-auto mb-6">
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

      {/* Donation Options */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Impact</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Select a donation amount or choose your own to make the difference that matters to you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div 
              className={`bg-white rounded-2xl p-8 shadow-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedAmount === '25' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleAmountSelect('25')}
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$25</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Art Supplies</h3>
                <p className="text-gray-600 mb-4">
                  Provides art materials for one student for a month, enabling creative expression and skill development.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Impact:</strong> One student gets creative materials
                </div>
              </div>
            </div>
            
            <div 
              className={`bg-white rounded-2xl p-8 shadow-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedAmount === '50' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleAmountSelect('50')}
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$50</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Workshop Funding</h3>
                <p className="text-gray-600 mb-4">
                  Funds one complete workshop session, providing training and support for 15-20 youth participants.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Impact:</strong> 15-20 youth participate in training
                </div>
              </div>
            </div>
            
            <div 
              className={`bg-white rounded-2xl p-8 shadow-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedAmount === '100' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleAmountSelect('100')}
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$100</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Media Equipment</h3>
                <p className="text-gray-600 mb-4">
                  Provides professional equipment for media training, enabling youth to learn valuable digital skills.
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Impact:</strong> Youth learn professional skills
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Custom Amount</h3>
            <p className="text-gray-600 text-center mb-6">
              Choose any amount that works for you. Every dollar makes a difference in the lives of refugee youth.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input 
                  type="number" 
                  placeholder="Enter amount" 
                  min="1"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  onClick={() => handleDonate(customAmount)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faHeart} className="mr-2" />
                  Donate
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Your Donation Helps */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Your Donation Helps</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              See the tangible impact of your contribution across our various programs and initiatives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Program Support</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm mt-1">
                    <FontAwesomeIcon icon={faLightbulb} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Refugee Teens Talk</h4>
                    <p className="text-gray-600">Health education workshops and peer support networks</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm mt-1">
                    <FontAwesomeIcon icon={faLightbulb} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Kakuma Theatre</h4>
                    <p className="text-gray-600">Drama workshops and performance training</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm mt-1">
                    <FontAwesomeIcon icon={faLightbulb} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Media Production</h4>
                    <p className="text-gray-600">Photography and videography training</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Resource Allocation</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Program Materials</span>
                  <span className="font-semibold text-blue-600">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Equipment & Technology</span>
                  <span className="font-semibold text-blue-600">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Workshop Costs</span>
                  <span className="font-semibold text-blue-600">20%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Administrative</span>
                  <span className="font-semibold text-blue-600">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Secure & Transparent</h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mx-auto mb-4">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regular Updates</h3>
              <p className="text-gray-600">
                Receive detailed reports on how your donation is making an impact in our community.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mx-auto mb-4">
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

      {/* Call to Action */}
      <section className="py-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Make a Difference Today
          </h2>
          <p className="text-lg text-white mb-6 max-w-3xl mx-auto">
            Your donation, no matter the size, creates real change in the lives of refugee youth. 
            Join us in building brighter futures.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => handleDonate(50)}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faHeart} className="mr-2" />
              Donate Now
            </button>
            <Link to="/about" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* PesaPal Donation Modal */}
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedAmount={selectedAmount || customAmount}
        onSuccess={handleDonationSuccess}
      />
    </div>
  );
};

export default Donate;
