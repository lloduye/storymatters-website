// Update the form submission handler
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = {
    name,
    email,
    amount,
    message: message || null,
    paymentMethod,
    isRecurring,
    frequency: isRecurring ? frequency : null
  };

  const result = await handleFormSubmission(formData, 'donation');
  
  if (result.success) {
    setSubmitted(true);
    resetForm();
  } else {
    setError('Failed to process donation. Please try again.');
  }
  
  setLoading(false);
}; 