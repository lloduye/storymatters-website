import { EMAIL_CONFIG } from '../utils/emailConfig';

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  try {
    await addDoc(collection(db, 'newsletter_subscribers'), {
      email: email,
      timestamp: serverTimestamp()
    });

    // Send confirmation email
    await addDoc(collection(db, 'mail'), {
      to: email,
      from: EMAIL_CONFIG.noReplyEmail,
      template: {
        name: 'newsletter-confirmation',
        data: {
          email: email
        }
      }
    });

    setSuccess(true);
    setEmail('');
  } catch (error) {
    setError('Failed to subscribe. Please try again.');
    console.error('Error:', error);
  } finally {
    setSubmitting(false);
  }
}; 