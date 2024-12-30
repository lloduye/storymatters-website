// Update the form submission handler
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = {
    name,
    email,
    message,
    phone: phone || null,
    subject: subject || 'General Inquiry'
  };

  const result = await handleFormSubmission(formData, 'contact');
  
  if (result.success) {
    setSubmitted(true);
    resetForm();
  } else {
    setError('Failed to submit form. Please try again.');
  }
  
  setLoading(false);
}; 