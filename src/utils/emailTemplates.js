export const emailTemplates = {
  volunteerApproved: {
    subject: 'Your Volunteer Application Has Been Approved',
    body: (data) => `
      Dear ${data.name},
      
      We are delighted to inform you that your volunteer application has been approved! 
      Thank you for your interest in joining our mission to support refugee communities.
      
      Selected Programs:
      ${data.programs.join('\n')}
      
      Next Steps:
      1. We will contact you within the next 48 hours to schedule an orientation
      2. You'll receive information about upcoming volunteer opportunities
      3. We'll provide you with necessary resources and training materials
      
      If you have any questions in the meantime, please don't hesitate to reach out.
      
      Best regards,
      Story Matters Team
    `
  },
  partnershipApproved: {
    subject: 'Partnership Application Approved',
    body: (data) => `
      Dear ${data.organizationName} Team,
      
      We are pleased to inform you that your partnership application has been approved!
      We're excited about the potential collaboration between our organizations.
      
      Partnership Type(s):
      ${data.partnershipTypes.join('\n')}
      
      Next Steps:
      1. Our partnership coordinator will contact you within 2 business days
      2. We'll schedule an initial meeting to discuss collaboration details
      3. We'll work together to develop an action plan
      
      Thank you for your interest in partnering with Story Matters.
      
      Best regards,
      Story Matters Team
    `
  }
}; 