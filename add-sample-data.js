const { google } = require('googleapis');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY || './google-credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

async function addSampleData() {
  try {
    console.log('Adding sample data...');

    // Add sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const sampleUsers = [
      ['user_001', 'editor1', 'editor1@storymatters.com', hashedPassword, 'John Editor', 'editor', 'active', new Date().toISOString(), '', 'read,write', '+1234567890', 'Content', 'Senior Editor'],
      ['user_002', 'editor2', 'editor2@storymatters.com', hashedPassword, 'Jane Writer', 'editor', 'active', new Date().toISOString(), '', 'read,write', '+1234567891', 'Content', 'Junior Editor'],
      ['user_003', 'admin', 'admin@storymatters.com', hashedPassword, 'Admin User', 'admin', 'active', new Date().toISOString(), '', 'all', '+1234567892', 'IT', 'System Administrator']
    ];

    console.log('Adding sample users...');
    for (const user of sampleUsers) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Users!A:M',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: { values: [user] }
      });
    }

    // Add sample stories
    const sampleStories = [
      ['Community Impact Story', 'A story about community development', 'John Editor', 'Nairobi, Kenya', '2024-01-15', 'sample1.jpg', 'Community Development', '5 min read', '<p>This is a sample story about community impact...</p>', 'Community, Development', 'true', 'published', '150', new Date().toISOString(), new Date().toISOString()],
      ['Youth Empowerment', 'Empowering young people through education', 'Jane Writer', 'Mombasa, Kenya', '2024-01-16', 'sample2.jpg', 'Education', '3 min read', '<p>This story focuses on youth empowerment...</p>', 'Education, Youth', 'false', 'draft', '0', new Date().toISOString(), new Date().toISOString()],
      ['Environmental Conservation', 'Protecting our environment for future generations', 'John Editor', 'Kisumu, Kenya', '2024-01-17', 'sample3.jpg', 'Environment', '4 min read', '<p>Environmental conservation efforts in our community...</p>', 'Environment, Conservation', 'true', 'published', '89', new Date().toISOString(), new Date().toISOString()],
      ['Women in Leadership', 'Celebrating women leaders in our community', 'Jane Writer', 'Nakuru, Kenya', '2024-01-18', 'sample4.jpg', 'Leadership', '6 min read', '<p>Highlighting the achievements of women leaders...</p>', 'Leadership, Women', 'false', 'draft', '0', new Date().toISOString(), new Date().toISOString()]
    ];

         console.log('Adding sample stories...');
     for (const story of sampleStories) {
       await sheets.spreadsheets.values.append({
         spreadsheetId: SPREADSHEET_ID,
         range: 'Stories!A:O',
         valueInputOption: 'RAW',
         insertDataOption: 'INSERT_ROWS',
         resource: { values: [story] }
       });
     }

    console.log('Sample data added successfully!');
    console.log('\nTest credentials:');
    console.log('Editor 1: editor1 / password123');
    console.log('Editor 2: editor2 / password123');
    console.log('Admin: admin / password123');
    
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

addSampleData(); 