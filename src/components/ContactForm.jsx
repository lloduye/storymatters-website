import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { EMAIL_CONFIG } from '../utils/emailConfig';

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    await addDoc(collection(db, 'messages'), {
      ...formData,
      recipientEmail: EMAIL_CONFIG.contactEmail,
      timestamp: serverTimestamp()
    });

    setSuccess(true);
    setFormData(initialState);
  } catch (error) {
    setError('Failed to send message. Please try again.');
    console.error('Error:', error);
  } finally {
    setSubmitting(false);
  }
}; 