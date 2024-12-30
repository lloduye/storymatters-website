// Update the form submission handler
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = {
    name,
    email,
    phone,
    interests,
    availability,
    experience,
    message: additionalInfo
  };

  const result = await handleFormSubmission(formData, 'volunteer');
  
  if (result.success) {
    setSubmitted(true);
    resetForm();
  } else {
    setError('Failed to submit application. Please try again.');
  }
  
  setLoading(false);
}; 