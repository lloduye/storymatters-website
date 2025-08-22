const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY || './google-credentials.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const STORIES_RANGE = 'Stories!A:Z';

// Check if required environment variables are set
if (!SPREADSHEET_ID) {
  console.error('❌ GOOGLE_SPREADSHEET_ID environment variable is not set!');
  console.error('Please check your .env file or environment configuration.');
} else {
  console.log('✅ Google Sheets ID configured:', SPREADSHEET_ID);
}

// Password utility functions
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Helper function to get all stories from Google Sheets
async function getAllStories() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: STORIES_RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    const headers = rows[0];
    const stories = rows.slice(1).map((row, index) => {
      const story = {};
      headers.forEach((header, i) => {
        story[header] = row[i] || '';
      });
      story.id = index + 1; // Add ID for frontend
      return story;
    });

    return stories;
  } catch (error) {
    console.error('Error fetching stories from Google Sheets:', error);
    throw error;
  }
}

// Helper function to add a new story to Google Sheets
async function addStoryToSheet(storyData) {
  try {
    console.log('Adding story to sheet with data:', storyData);
    console.log('Individual fields:');
    console.log('- title:', storyData.title);
    console.log('- excerpt:', storyData.excerpt);
    console.log('- author:', storyData.author);
    console.log('- location:', storyData.location);
    console.log('- publishDate:', storyData.publishDate);
    console.log('- image:', storyData.image);
    console.log('- category:', storyData.category);
    console.log('- readTime:', storyData.readTime);
    console.log('- content:', storyData.content);
    console.log('- tags:', storyData.tags);
    console.log('- featured:', storyData.featured);
    console.log('- status:', storyData.status);
    console.log('- viewCount:', storyData.viewCount);
    
    const values = [
      [
        storyData.title || '',
        storyData.excerpt || '',
        storyData.author || '',
        storyData.location || '',
        storyData.publishDate || new Date().toISOString().split('T')[0],
        storyData.image || '',
        storyData.category || '',
        storyData.readTime || '5 min', // Default read time
        storyData.content || '',
        storyData.tags || '',
        storyData.featured ? 'true' : 'false',
        storyData.status || 'draft',
        storyData.viewCount || '0',
        new Date().toISOString(),
        new Date().toISOString()
      ]
    ];
    
    console.log('Values to insert:', values);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: STORIES_RANGE,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values }
    });

    return true;
  } catch (error) {
    console.error('Error adding story to Google Sheets:', error);
    throw error;
  }
}

// Helper function to update a story in Google Sheets
async function updateStoryInSheet(storyId, storyData) {
  try {
    const values = [
      [
        storyData.title,
        storyData.excerpt,
        storyData.author,
        storyData.location,
        storyData.publishDate,
        storyData.image,
        storyData.category,
        storyData.readTime,
        storyData.content,
        storyData.tags || '',
        storyData.featured ? 'true' : 'false',
        storyData.status || 'draft',
        storyData.viewCount || '0',
        storyData.createdAt || new Date().toISOString(),
        new Date().toISOString()
      ]
    ];

    // Calculate the row number (stories start from row 2, so storyId + 1)
    const rowNumber = parseInt(storyId) + 1;
    
    // Validate that rowNumber is a valid number
    if (isNaN(rowNumber) || rowNumber < 2) {
      throw new Error(`Invalid story ID: ${storyId}. Row number calculated: ${rowNumber}`);
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Stories!A${rowNumber}:O${rowNumber}`,
      valueInputOption: 'RAW',
      resource: { values }
    });

    return true;
  } catch (error) {
    console.error('Error updating story in Google Sheets:', error);
    throw error;
  }
}

// Helper function to delete a story from Google Sheets
async function deleteStoryFromSheet(storyId) {
  try {
    // Calculate the row number (stories start from row 2, so storyId + 1)
    const rowNumber = parseInt(storyId) + 1;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming Stories is the first sheet
                dimension: 'ROWS',
                startIndex: rowNumber - 1,
                endIndex: rowNumber
              }
            }
          }
        ]
      }
    });

    return true;
  } catch (error) {
    console.error('Error deleting story from Google Sheets:', error);
    throw error;
  }
}

// Use existing Google Sheets configuration for users
const SPREADSHEET_ID_USERS = process.env.GOOGLE_SPREADSHEET_ID || SPREADSHEET_ID;

// Helper function to add user to Google Sheets
const addUserToSheet = async (userData) => {
  try {
    const values = [
      userData.id,           // Column A - ID
      userData.username,     // Column B - Username
      userData.email,        // Column C - Email
      userData.password,     // Column D - Password
      userData.fullName,     // Column E - Full Name
      userData.role,         // Column F - Role
      userData.status,       // Column G - Status
      userData.createdAt,    // Column H - Created At
      userData.lastLogin,    // Column I - Last Login
      userData.permissions,  // Column J - Permissions
      userData.phone,        // Column K - Phone
      userData.department,   // Column L - Department
      userData.notes         // Column M - Notes
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID_USERS,
      range: 'Users!A:M',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [values] }
    });

    return true;
  } catch (error) {
    console.error('Error adding user to sheet:', error);
    throw error;
  }
};

// Helper function to update user in Google Sheets
const updateUserInSheet = async (userId, userData) => {
  try {
    // First, find the row number for the user
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_USERS,
      range: 'Users!A:A',
    });

    const rows = response.data.values;
    let rowNumber = -1;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === userId) {
        rowNumber = i + 1;
        break;
      }
    }

    if (rowNumber === -1) {
      throw new Error('User not found');
    }

    const values = [
      userData.id,           // Column A - ID
      userData.username,     // Column B - Username
      userData.email,        // Column C - Email
      userData.password,     // Column D - Password
      userData.fullName,     // Column E - Full Name
      userData.role,         // Column F - Role
      userData.status,       // Column G - Status
      userData.createdAt,    // Column H - Created At
      userData.lastLogin,    // Column I - Last Login
      userData.permissions,  // Column J - Permissions
      userData.phone,        // Column K - Phone
      userData.department,   // Column L - Department
      userData.notes         // Column M - Notes
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID_USERS,
      range: `Users!A${rowNumber}:M${rowNumber}`,
      valueInputOption: 'RAW',
      resource: { values: [values] }
    });

    return true;
  } catch (error) {
    console.error('Error updating user in sheet:', error);
    throw error;
  }
};

// Helper function to delete user from Google Sheets
const deleteUserFromSheet = async (userId) => {
  try {
    // First, find the row number for the user
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_USERS,
      range: 'Users!A:A',
    });

    const rows = response.data.values;
    let rowNumber = -1;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === userId) {
        rowNumber = i + 1;
        break;
      }
    }

    if (rowNumber === -1) {
      throw new Error('User not found');
    }

    // Get the sheet ID for the Users sheet
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID_USERS,
    });
    
    const usersSheet = spreadsheet.data.sheets.find(sheet => 
      sheet.properties.title === 'Users'
    );
    
    if (!usersSheet) {
      throw new Error('Users sheet not found');
    }

    const sheetId = usersSheet.properties.sheetId;

    // Delete the row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID_USERS,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: 'ROWS',
                startIndex: rowNumber - 1,
                endIndex: rowNumber
              }
            }
          }
        ]
      }
    });

    return true;
  } catch (error) {
    console.error('Error deleting user from sheet:', error);
    throw error;
  }
};

// API Routes

// Get all stories
app.get('/api/stories', async (req, res) => {
  try {
    const stories = await getAllStories();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Get stories by user
app.get('/api/stories/user/:username', async (req, res) => {
  try {
    const stories = await getAllStories();
    const userStories = stories.filter(story => story.author === req.params.username);
    res.json(userStories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user stories' });
  }
});

// Get a single story by ID
app.get('/api/stories/:id', async (req, res) => {
  try {
    const stories = await getAllStories();
    const story = stories.find(s => s.id === parseInt(req.params.id));
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// Simple authentication middleware (for demo purposes)
const authenticateAdmin = (req, res, next) => {
  const { authorization } = req.headers;
  
  if (!authorization) {
    return res.status(401).json({ error: 'No authorization header provided' });
  }
  
  // Extract token from "Bearer token" format
  const token = authorization.replace('Bearer ', '');
  
  // Simple token check - accept both admin and editor tokens
  // In production, use proper JWT authentication with user roles
  if (token === (process.env.ADMIN_TOKEN || 'admin123') || token.startsWith('token_')) {
    next();
  } else {
    console.log('Authentication failed for token:', token);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Protected routes
app.post('/api/stories', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const storyData = req.body;
    
    // Handle image upload if present
    if (req.file) {
      storyData.image = req.file.filename;
    } else {
      storyData.image = '';
    }
    
    console.log('Creating story with data:', storyData);
    console.log('Story data keys:', Object.keys(storyData));
    console.log('Story data values:', Object.values(storyData));
    
    // Validate required fields
    if (!storyData.title || !storyData.content || !storyData.author) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['title', 'content', 'author'],
        received: Object.keys(storyData)
      });
    }
    
    await addStoryToSheet(storyData);
    res.status(201).json({ message: 'Story created successfully' });
  } catch (error) {
    console.error('Error creating story:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to create story', details: error.message });
  }
});

app.put('/api/stories/:id', authenticateAdmin, async (req, res) => {
  try {
    const storyData = req.body;
    console.log('Updating story with ID:', req.params.id, 'Type:', typeof req.params.id);
    await updateStoryInSheet(req.params.id, storyData);
    res.json({ message: 'Story updated successfully' });
  } catch (error) {
    console.error('Error in PUT /api/stories/:id:', error);
    res.status(500).json({ error: 'Failed to update story', details: error.message });
  }
});

app.delete('/api/stories/:id', authenticateAdmin, async (req, res) => {
  try {
    await deleteStoryFromSheet(req.params.id);
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

app.post('/api/upload', authenticateAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ 
      success: true, 
      imageUrl,
      filename: req.file.filename 
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Story Status Management
app.patch('/api/stories/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const storyId = req.params.id;
    
    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be "draft" or "published"' });
    }
    
    // Get current story data
    const stories = await getAllStories();
    const story = stories.find(s => s.id == storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    // Update only the status and updatedAt fields
    const updateData = {
      ...story,
      status,
      updatedAt: new Date().toISOString()
    };
    
    await updateStoryInSheet(storyId, updateData);
    res.json({ message: 'Story status updated successfully', status });
  } catch (error) {
    console.error('Error updating story status:', error);
    res.status(500).json({ error: 'Failed to update story status' });
  }
});

// Story Featured Toggle
app.patch('/api/stories/:id/featured', authenticateAdmin, async (req, res) => {
  try {
    const { featured } = req.body;
    const storyId = req.params.id;
    
    if (typeof featured !== 'boolean') {
      return res.status(400).json({ error: 'Featured must be a boolean value' });
    }
    
    // Get current story data
    const stories = await getAllStories();
    const story = stories.find(s => s.id == storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    // Update only the featured and updatedAt fields
    const updateData = {
      ...story,
      featured,
      updatedAt: new Date().toISOString()
    };
    
    await updateStoryInSheet(storyId, updateData);
    res.json({ message: 'Story featured status updated successfully', featured });
  } catch (error) {
    console.error('Error updating story featured status:', error);
    res.status(500).json({ error: 'Failed to update story featured status' });
  }
});

// Get Drafts for a specific user
app.get('/api/stories/user/:username/drafts', async (req, res) => {
  try {
    const stories = await getAllStories();
    const userDrafts = stories.filter(story => 
      story.author === req.params.username && story.status === 'draft'
    );
    res.json(userDrafts);
  } catch (error) {
    console.error('Error fetching user drafts:', error);
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
});

// Increment View Count
app.patch('/api/stories/:id/view', async (req, res) => {
  try {
    const storyId = req.params.id;
    
    // Get current story data
    const stories = await getAllStories();
    const story = stories.find(s => s.id == storyId);
    
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    // Increment view count
    const currentViews = parseInt(story.viewCount || 0);
    const updateData = {
      ...story,
      viewCount: (currentViews + 1).toString(),
      updatedAt: new Date().toISOString()
    };
    
    await updateStoryInSheet(storyId, updateData);
    res.json({ message: 'View count updated successfully', viewCount: currentViews + 1 });
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({ error: 'Failed to update view count' });
  }
});

// User Management Routes
app.get('/api/users', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_USERS,
      range: 'Users!A:M',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    // Skip header row if it exists
    const dataRows = rows[0][0] === 'ID' ? rows.slice(1) : rows;
    
    const users = dataRows.map(row => ({
      id: row[0] || '',
      username: row[1] || '',
      email: row[2] || '',
      fullName: row[4] || '',
      role: row[5] || '',
      status: row[6] || '',
      createdAt: row[7] || '',
      lastLogin: row[8] || '',
      permissions: row[9] || '',
      phone: row[10] || '',
      department: row[11] || '',
      notes: row[12] || ''
    }));

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_USERS,
      range: 'Users!A:M',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Skip header row if it exists
    const dataRows = rows[0][0] === 'ID' ? rows.slice(1) : rows;
    
    const user = dataRows.find(row => row[0] === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      id: user[0] || '',
      username: user[1] || '',
      email: user[2] || '',
      fullName: user[4] || '',
      role: user[5] || '',
      status: user[6] || '',
      createdAt: user[7] || '',
      lastLogin: user[8] || '',
      permissions: user[9] || '',
      phone: user[10] || '',
      department: user[11] || '',
      notes: user[12] || ''
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    
    // Generate unique ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Hash the password
    const hashedPassword = await hashPassword(userData.password || 'password123');
    
    const newUser = {
      id: userId,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      fullName: userData.fullName,
      role: userData.role || 'editor',
      status: userData.status || 'active',
      createdAt: new Date().toISOString(),
      lastLogin: '',
      permissions: userData.permissions || '',
      phone: userData.phone || '',
      department: userData.department || '',
      notes: userData.notes || ''
    };

    await addUserToSheet(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;
    
    // If password is provided, hash it
    let password = userData.password;
    if (password && password !== '') {
      password = await hashPassword(password);
    }
    
    const updatedUser = {
      id: userId,
      username: userData.username,
      email: userData.email,
      password: password || '', // Keep existing password if not changed
      fullName: userData.fullName,
      role: userData.role,
      status: userData.status,
      createdAt: userData.createdAt,
      lastLogin: userData.lastLogin,
      permissions: userData.permissions,
      phone: userData.phone,
      department: userData.department,
      notes: userData.notes
    };

    await updateUserInSheet(userId, updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await deleteUserFromSheet(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

app.patch('/api/users/:id/status', async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    
    // Get current user data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_USERS,
      range: 'Users!A:M',
    });

    const rows = response.data.values;
    const dataRows = rows[0][0] === 'ID' ? rows.slice(1) : rows;
    
    const user = dataRows.find(row => row[0] === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = {
      id: user[0],
      username: user[1],
      email: user[2],
      password: user[3],
      fullName: user[4],
      role: user[5],
      status: status,
      createdAt: user[7],
      lastLogin: user[8],
      permissions: user[9],
      phone: user[10],
      department: user[11],
      notes: user[12]
    };

    await updateUserInSheet(userId, userData);
    res.json(userData);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Failed to update user status' });
  }
});

// Test route for debugging
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route is working' });
});

// Test Google Sheets connection
app.get('/api/test-sheets', async (req, res) => {
  try {
    console.log('Testing Google Sheets connection...');
    console.log('SPREADSHEET_ID_USERS:', SPREADSHEET_ID_USERS);
    
    // Test reading from Users sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_USERS,
      range: 'Users!A:M',
    });
    
    const rows = response.data.values;
    console.log('Users sheet test response:', { 
      rowCount: rows ? rows.length : 0, 
      firstRow: rows && rows.length > 0 ? rows[0] : null 
    });
    
    res.json({
      message: 'Google Sheets connection successful',
      spreadsheetId: SPREADSHEET_ID_USERS,
      userCount: rows ? rows.length - 1 : 0, // Subtract header row
      firstRow: rows && rows.length > 0 ? rows[0] : null,
      sampleData: rows && rows.length > 1 ? rows[1] : null
    });
    
  } catch (error) {
    console.error('Google Sheets test failed:', error);
    res.status(500).json({ 
      message: 'Google Sheets test failed', 
      error: error.message,
      spreadsheetId: SPREADSHEET_ID_USERS
    });
  }
});

// User Login Route
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('Login attempt for username:', username);
    console.log('SPREADSHEET_ID_USERS:', SPREADSHEET_ID_USERS);
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    
    // Get all users to find the one trying to log in
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_USERS,
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
      status: user[6] 
    });
    
    // Check if user is active
    if (user[6] !== 'active') {
      console.log('User account not active:', user[6]);
      return res.status(401).json({ message: 'Account is not active' });
    }
    
    // Verify password
    const hashedPassword = user[3]; // Password is now in column D
    console.log('Verifying password...');
    const isValidPassword = await verifyPassword(password, hashedPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    console.log('Password verified successfully');
    
    // Update last login
    const userData = {
      id: user[0],
      username: user[1],
      email: user[2],
      password: user[3],
      fullName: user[4],
      role: user[5],
      status: user[6],
      createdAt: user[7],
      lastLogin: new Date().toISOString(),
      permissions: user[9],
      phone: user[10],
      department: user[11],
      notes: user[12]
    };
    
    console.log('Updating last login in sheet...');
    await updateUserInSheet(user[0], userData);
    
    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = userData;
    
    console.log('Login successful for user:', username, 'Role:', userData.role);
    
    // Generate a token for the user
    const token = `token_${Date.now()}_${userData.id}`;
    console.log('Generated token for user:', token);
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token: token
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CMS API is running' });
});

app.listen(PORT, () => {
  console.log(`CMS Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
