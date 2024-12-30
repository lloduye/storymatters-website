// Update the form submission handler
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = {
    email,
    name: name || null,
    preferences: preferences || [],
  };

  const result = await handleFormSubmission(formData, 'newsletter');
  
  if (result.success) {
    setSubmitted(true);
    resetForm();
  } else {
    setError('Failed to subscribe. Please try again.');
  }
  
  setLoading(false);
}; 