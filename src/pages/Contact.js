import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
             {/* Hero Section */}
       <section className="bg-blue-600 text-white py-6 text-center">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">
             Contact Us
           </h1>
           <p className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed text-white">
             Get in touch with us to learn more about our programs, 
             volunteer opportunities, or partnership possibilities.
           </p>
         </div>
       </section>

       {/* Contact Information & Form */}
       <section className="py-8 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="space-y-4">
               <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Details</h2>
               
               <div className="space-y-3">
                                 <div className="flex items-start gap-3">
                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-base flex-shrink-0">
                     <FontAwesomeIcon icon={faEnvelope} />
                   </div>
                   <div>
                     <h4 className="text-base font-semibold text-gray-900 mb-1">Email</h4>
                     <p className="text-blue-600 font-medium text-sm">
                       <a href="mailto:info@storymattersentertainment.org" className="hover:text-blue-800 transition-colors duration-200">
                         info@storymattersentertainment.org
                       </a>
                     </p>
                     <p className="text-gray-600 text-xs">We typically respond within 24 hours</p>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-base flex-shrink-0">
                     <FontAwesomeIcon icon={faPhone} />
                   </div>
                   <div>
                     <h4 className="text-base font-semibold text-gray-900 mb-1">Phone</h4>
                     <p className="text-blue-600 font-medium text-sm">
                       <a href="tel:+254748586185" className="hover:text-blue-800 transition-colors duration-200">
                         +254 748 586185
                       </a>
                     </p>
                     <p className="text-gray-600 text-xs">Available Monday-Friday, 9 AM - 5 PM EAT</p>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-base flex-shrink-0">
                     <FontAwesomeIcon icon={faMapMarkerAlt} />
                   </div>
                   <div>
                     <h4 className="text-base font-semibold text-gray-900 mb-1">Address</h4>
                     <p className="text-gray-600 text-sm">Kakuma Refugee Camp, Turkana County, Kenya</p>
                     <p className="text-gray-600 text-xs">Main office near the education center</p>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-3">
                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-base flex-shrink-0">
                     <FontAwesomeIcon icon={faClock} />
                   </div>
                   <div>
                     <h4 className="text-base font-semibold text-gray-900 mb-1">Business Hours</h4>
                     <p className="text-gray-600 text-sm">Monday - Friday: 9:00 AM - 5:00 PM EAT</p>
                     <p className="text-gray-600 text-xs">Saturday: 9:00 AM - 1:00 PM EAT</p>
                   </div>
                 </div>
               </div>
               
               <div className="pt-4">
                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Follow Us</h3>
                 <div className="flex gap-3">
                   <a 
                     href="https://facebook.com/storymattersentertainment" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors duration-200"
                   >
                     <FontAwesomeIcon icon={faFacebook} className="text-sm" />
                   </a>
                   <a 
                     href="https://twitter.com/storymattersent" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors duration-200"
                   >
                     <FontAwesomeIcon icon={faTwitter} className="text-sm" />
                   </a>
                   <a 
                     href="https://instagram.com/storymattersentertainment" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors duration-200"
                   >
                     <FontAwesomeIcon icon={faInstagram} className="text-sm" />
                   </a>
                 </div>
               </div>
             </div>
             
             <div className="bg-gray-50 rounded-2xl p-6">
               <h3 className="text-xl font-bold text-gray-900 mb-4">Send Us a Message</h3>
               <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                                     <input
                     type="text"
                     id="name"
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                     placeholder="Enter your full name"
                   />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="What is this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                                     <textarea
                     id="message"
                     name="message"
                     value={formData.message}
                     onChange={handleChange}
                     required
                     rows={3}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-none"
                     placeholder="Tell us more about your inquiry..."
                   />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>




    </div>
  );
};

export default Contact;
