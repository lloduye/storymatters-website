import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { emailTemplates } from './emailTemplates';

export const sendEmailNotification = async (templateName, data) => {
  try {
    const template = emailTemplates[templateName];
    if (!template) throw new Error('Email template not found');

    // Validate required fields
    if (!data.email) throw new Error('Email address is required');
    if (!data.name && !data.organizationName) throw new Error('Name or organization name is required');

    const emailData = {
      to: data.email,
      message: {
        subject: template.subject,
        html: template.body(data).replace(/\n/g, '<br>'),
      },
      template: templateName,
      timestamp: new Date(),
      metadata: {
        submissionType: data.type,
        submissionId: data.id
      }
    };

    // Add to mail collection in Firestore
    const docRef = await addDoc(collection(db, 'mail'), emailData);
    console.log('Email notification queued:', templateName, 'DocRef:', docRef.id);
    return docRef;

  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
}; 