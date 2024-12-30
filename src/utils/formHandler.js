import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const handleFormSubmission = async (formData, formType) => {
  try {
    // Add to submissions collection (for mailbox)
    await addDoc(collection(db, 'submissions'), {
      ...formData,
      type: formType,
      timestamp: serverTimestamp(),
      read: false,
      status: 'new'
    });

    // Also add to specific collection based on form type
    const specificCollection = getCollectionByType(formType);
    if (specificCollection) {
      await addDoc(collection(db, specificCollection), {
        ...formData,
        timestamp: serverTimestamp()
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Form submission error:', error);
    return { success: false, error: error.message };
  }
};

const getCollectionByType = (type) => {
  switch (type) {
    case 'contact':
      return 'contactMessages';
    case 'volunteer':
      return 'volunteerApplications';
    case 'newsletter':
      return 'newsletterSubscribers';
    case 'donation':
      return 'donations';
    default:
      return null;
  }
}; 