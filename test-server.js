const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = 5001; // Use different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY || './google-credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

// Test Google Sheets connection
app.get('/api/test-sheets', async (req, res) => {
  try {
    console.log('Testing Google Sheets connection...');
    console.log('SPREADSHEET_ID:', SPREADSHEET_ID);
    
    // Test reading from Users sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A:M',
    });
    
    const rows = response.data.values;
    console.log('Users sheet test response:', { 
      rowCount: rows ? rows.length : 0, 
      firstRow: rows && rows.length > 0 ? rows[0] : null 
    });
    
    res.json({
      message: 'Google Sheets connection successful',
      spreadsheetId: SPREADSHEET_ID,
      userCount: rows ? rows.length - 1 : 0, // Subtract header row
      firstRow: rows && rows.length > 0 ? rows[0] : null,
      sampleData: rows && rows.length > 1 ? rows[1] : null,
      allRows: rows
    });
    
  } catch (error) {
    console.error('Google Sheets test failed:', error);
    res.status(500).json({ 
      message: 'Google Sheets test failed', 
      error: error.message,
      spreadsheetId: SPREADSHEET_ID
    });
  }
});

// Simple login test
app.post('/api/test-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Test login attempt for username:', username);
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Get all users to find the one trying to log in
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A:M',
    });
    
    const rows = response.data.values;
    console.log('Users sheet response:', { 
      rowCount: rows ? rows.length : 0, 
      firstRow: rows && rows.length > 0 ? rows[0] : null 
    });
    
    if (!rows || rows.length === 0) {
      console.log('No users found in sheet');
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Skip header row if it exists
    const dataRows = rows[0][0] === 'ID' ? rows.slice(1) : rows;
    console.log('Data rows (excluding header):', dataRows.length);
    
    // Find user by username or email
    const user = dataRows.find(row => 
      row[1] === username || row[2] === username // username or email
    );
    
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('User found:', { 
      id: user[0], 
      username: user[1], 
      email: user[2], 
      role: user[5], 
      status: user[6],
      password: user[3] ? 'Present' : 'Missing'
    });
    
    // Check if user is active
    if (user[6] !== 'active') {
      console.log('User account not active:', user[6]);
      return res.status(401).json({ message: 'Account is not active' });
    }
    
    // For testing, just check if password exists (don't verify hash)
    if (!user[3]) {
      console.log('No password found for user:', username);
      return res.status(401).json({ message: 'Invalid credentials - no password' });
    }
    
    console.log('Login test successful for user:', username, 'Role:', user[5]);
    res.json({
      message: 'Login test successful',
      user: {
        id: user[0],
        username: user[1],
        email: user[2],
        fullName: user[4],
        role: user[5],
        status: user[6]
      }
    });
    
  } catch (error) {
    console.error('Error during test login:', error);
    res.status(500).json({ message: 'Login test failed', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Test Server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test-sheets`);
});
