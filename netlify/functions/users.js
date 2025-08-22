const { google } = require('googleapis');
const bcrypt = require('bcryptjs');

// Google Sheets API setup for users
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const USERS_RANGE = 'Users!A:M';

// Helper function to get all users from Google Sheets
async function getAllUsers() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: USERS_RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    const headers = rows[0];
    const users = rows.slice(1).map((row, index) => {
      const user = {};
      headers.forEach((header, i) => {
        user[header] = row[i] || '';
      });
      return user;
    });

    return users;
  } catch (error) {
    console.error('Error fetching users from Google Sheets:', error);
    throw error;
  }
}

// Helper function to add a new user to Google Sheets
async function addUserToSheet(userData) {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const values = [
      [
        `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`, // ID
        userData.username || '',
        userData.email || '',
        hashedPassword,
        userData.fullName || '',
        userData.role || 'editor',
        userData.status || 'active',
        new Date().toISOString(), // Created At
        '', // Last Login
        userData.permissions || '',
        userData.phone || '',
        userData.department || '',
        userData.notes || ''
      ]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: USERS_RANGE,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values }
    });

    return true;
  } catch (error) {
    console.error('Error adding user to Google Sheets:', error);
    throw error;
  }
}

// Helper function to update a user in Google Sheets
async function updateUserInSheet(userId, userData) {
  try {
    // Find the user row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: USERS_RANGE,
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

    // Prepare update data
    const updateData = [
      userData.username || '',
      userData.email || '',
      userData.password ? await bcrypt.hash(userData.password, 10) : rows[rowNumber - 1][3], // Keep existing password if not provided
      userData.fullName || '',
      userData.role || 'editor',
      userData.status || 'active',
      rows[rowNumber - 1][6], // Keep existing Created At
      rows[rowNumber - 1][7], // Keep existing Last Login
      userData.permissions || '',
      userData.phone || '',
      userData.department || '',
      userData.notes || ''
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Users!B${rowNumber}:M${rowNumber}`,
      valueInputOption: 'RAW',
      resource: { values: [updateData] }
    });

    return true;
  } catch (error) {
    console.error('Error updating user in Google Sheets:', error);
    throw error;
  }
}

// Helper function to delete a user from Google Sheets
async function deleteUserFromSheet(userId) {
  try {
    // Find the user row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: USERS_RANGE,
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

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 1, // Assuming Users is the second sheet
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
    console.error('Error deleting user from Google Sheets:', error);
    throw error;
  }
}

// Main function handler
exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { httpMethod, path, body } = event;
    
    console.log('Users function called:', { httpMethod, path });

    // GET /api/users - Get all users
    if (httpMethod === 'GET' && path === '/api/users') {
      const users = await getAllUsers();
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { Password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(usersWithoutPasswords)
      };
    }

    // POST /api/users - Create new user
    if (httpMethod === 'POST' && path === '/api/users') {
      const userData = JSON.parse(body);
      
      // Validate required fields
      if (!userData.username || !userData.password || !userData.email || !userData.fullName) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Missing required fields', 
            required: ['username', 'password', 'email', 'fullName'],
            received: Object.keys(userData)
          })
        };
      }
      
      await addUserToSheet(userData);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: 'User created successfully' })
      };
    }

    // PUT /api/users/:id - Update user
    if (httpMethod === 'PUT' && path.match(/^\/api\/users\/[^\/]+$/)) {
      const userId = path.split('/').pop();
      const userData = JSON.parse(body);
      
      await updateUserInSheet(userId, userData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'User updated successfully' })
      };
    }

    // DELETE /api/users/:id - Delete user
    if (httpMethod === 'DELETE' && path.match(/^\/api\/users\/[^\/]+$/)) {
      const userId = path.split('/').pop();
      
      await deleteUserFromSheet(userId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'User deleted successfully' })
      };
    }

    // PATCH /api/users/:id/status - Update user status
    if (httpMethod === 'PATCH' && path.match(/^\/api\/users\/[^\/]+\/status$/)) {
      const userId = path.split('/')[3];
      const { status } = JSON.parse(body);
      
      if (!['active', 'inactive'].includes(status)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid status. Must be "active" or "inactive"' })
        };
      }
      
      await updateUserInSheet(userId, { status });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'User status updated successfully', status })
      };
    }

    // If no matching route, return 404
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Route not found' })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      })
    };
  }
};
