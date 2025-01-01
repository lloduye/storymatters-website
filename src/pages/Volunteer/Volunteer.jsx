import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import './Volunteer.css';
import ScrollAnimation from '../../components/ScrollAnimation/ScrollAnimation';

const Volunteer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    programs: [],
    availability: '',
    experience: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle, loading, success, error

  const programOptions = [
    {
      id: 'refugee-teens',
      name: 'Refugee Teens Talk Program',
      description: 'Support workshops and activities for teenage mothers'
    },
    {
      id: 'theatre',
      name: 'Kakuma Theatre',
      description: 'Help with drama, performances, and media production'
    },
    {
      id: 'art-craft',
      name: 'Art and Craft Initiatives',
      description: 'Assist in art workshops and creative activities'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProgramChange = (programId) => {
    setFormData(prev => {
      const programs = prev.programs.includes(programId)
        ? prev.programs.filter(id => id !== programId)
        : [...prev.programs, programId];
      return { ...prev, programs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      // Create submission object
      const submissionData = {
        type: 'volunteer',
        status: 'pending',
        submittedAt: serverTimestamp(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        location: formData.location || 'Not provided',
        programs: formData.programs,
        availability: formData.availability || 'Not specified',
        experience: formData.experience || 'Not provided',
        message: formData.message || 'No additional message',
        metadata: {
          selectedPrograms: formData.programs.map(programId => 
            programOptions.find(p => p.id === programId)?.name
          ).filter(Boolean)
        }
      };

      // Add to Firestore
      await addDoc(collection(db, 'submissions'), submissionData);

      // Reset form and show success
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        programs: [],
        availability: '',
        experience: '',
        message: ''
      });
      setSubmitStatus('success');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  const getSubmitButtonText = () => {
    switch (submitStatus) {
      case 'loading':
        return 'Submitting...';
      case 'success':
        return 'Application Submitted!';
      case 'error':
        return 'Error - Try Again';
      default:
        return 'Submit Application';
    }
  };

  return (
    <div className="volunteer-page">
      <div className="banner-container">
        <div className="page-banner">
          <img 
            src={`${import.meta.env.BASE_URL}images/banners/volunteer-banner.jpeg`}
            alt="Volunteer With Us"
            className="banner-image"
          />
          <h1>Volunteer With Us</h1>
        </div>
      </div>

      <ScrollAnimation>
        <div className="volunteer-content">
          <p className="intro-text">
            Join our team of dedicated volunteers and help make a difference in the lives of 
            young refugees. Select the programs you're interested in and tell us about yourself.
          </p>

          <form onSubmit={handleSubmit} className="volunteer-form">
            <div className="form-section">
              <h2>Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
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

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Program Selection</h2>
              <p>Choose the programs you'd like to volunteer for:</p>
              <div className="programs-grid">
                {programOptions.map(program => (
                  <div key={program.id} className="program-option">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.programs.includes(program.id)}
                        onChange={() => handleProgramChange(program.id)}
                      />
                      <div className="program-info">
                        <h3>{program.name}</h3>
                        <p>{program.description}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h2>Additional Information</h2>
              <div className="form-group">
                <label htmlFor="availability">Availability</label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="">Select your availability</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="both">Both Weekdays and Weekends</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="experience">Relevant Experience</label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Tell us about any relevant experience or skills you have"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Additional Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any additional information you'd like to share"
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
                Thank you for your application! We'll be in touch soon.
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="form-message error">
                There was an error submitting your application. Please try again.
              </div>
            )}
          </form>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default Volunteer; 