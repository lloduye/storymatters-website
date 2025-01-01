import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './Partner.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';

const Partner = () => {
  const [formData, setFormData] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    organizationType: '',
    partnershipType: [],
    description: '',
    goals: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('idle');

  const partnershipTypes = [
    {
      id: 'funding',
      name: 'Funding Partnership',
      description: 'Support our programs through financial contributions'
    },
    {
      id: 'resources',
      name: 'Resource Sharing',
      description: 'Share resources, facilities, or materials'
    },
    {
      id: 'technical',
      name: 'Technical Partnership',
      description: 'Provide technical expertise or training'
    },
    {
      id: 'program',
      name: 'Program Collaboration',
      description: 'Collaborate on specific programs or initiatives'
    }
  ];

  const organizationTypes = [
    'Non-Profit Organization',
    'Corporate Entity',
    'Educational Institution',
    'Government Agency',
    'Foundation',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePartnershipTypeChange = (typeId) => {
    setFormData(prev => {
      const types = prev.partnershipType.includes(typeId)
        ? prev.partnershipType.filter(id => id !== typeId)
        : [...prev.partnershipType, typeId];
      return { ...prev, partnershipType: types };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const submissionData = {
        type: 'partnership',
        status: 'pending',
        submittedAt: serverTimestamp(),
        organizationName: formData.organizationName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        website: formData.website ? formData.website : 'Not provided',
        organizationType: formData.organizationType,
        partnershipTypes: formData.partnershipType.map(typeId => 
          partnershipTypes.find(t => t.id === typeId)?.name
        ).filter(Boolean),
        description: formData.description,
        goals: formData.goals,
        message: formData.message || 'No additional message'
      };

      await addDoc(collection(db, 'submissions'), submissionData);

      setFormData({
        organizationName: '',
        contactName: '',
        email: '',
        phone: '',
        website: '',
        organizationType: '',
        partnershipType: [],
        description: '',
        goals: '',
        message: ''
      });
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const getSubmitButtonText = () => {
    switch (submitStatus) {
      case 'loading': return 'Submitting...';
      case 'success': return 'Proposal Submitted!';
      case 'error': return 'Error - Try Again';
      default: return 'Submit Proposal';
    }
  };

  return (
    <div className="partner-page">
      <div className="banner-container">
        <div className="page-banner">
          <img 
            src={`${import.meta.env.BASE_URL}images/banners/partner-banner.jpg`}
            alt="Partner With Us"
            className="banner-image"
          />
          <h1>Partner With Us</h1>
        </div>
      </div>

      <ScrollAnimation>
        <div className="partner-content">
          <p className="intro-text">
            Join us in making a lasting impact. We welcome partnerships with organizations 
            that share our vision of empowering refugee communities through arts and education.
          </p>

          <form onSubmit={handleSubmit} className="partner-form">
            <div className="form-section">
              <h2>Organization Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="organizationName">Organization Name *</label>
                  <input
                    type="text"
                    id="organizationName"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="organizationType">Organization Type *</label>
                  <select
                    id="organizationType"
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select organization type</option>
                    {organizationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="website">Website (Optional)</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Contact Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="contactName">Contact Person *</label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Partnership Details</h2>
              <p>Select the types of partnership you're interested in:</p>
              <div className="partnership-grid">
                {partnershipTypes.map(type => (
                  <div key={type.id} className="partnership-option">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.partnershipType.includes(type.id)}
                        onChange={() => handlePartnershipTypeChange(type.id)}
                      />
                      <div className="partnership-info">
                        <h3>{type.name}</h3>
                        <p>{type.description}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label htmlFor="description">Organization Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your organization"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="goals">Partnership Goals *</label>
                <textarea
                  id="goals"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  placeholder="What do you hope to achieve through this partnership?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Additional Information</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any other details you'd like to share"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`submit-button ${submitStatus}`}
              disabled={submitStatus === 'loading'}
            >
              {getSubmitButtonText()}
            </button>

            {submitStatus === 'success' && (
              <div className="form-message success">
                Thank you for your partnership proposal! We'll review and contact you soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="form-message error">
                There was an error submitting your proposal. Please try again.
              </div>
            )}
          </form>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default Partner; 