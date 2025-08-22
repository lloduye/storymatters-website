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

// Helper function to verify password
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Helper function to update user's last login
async function updateUserLastLogin(userId) {
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

    // Update only the lastLogin field (column I)
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Users!I${rowNumber}`,
      valueInputOption: 'RAW',
      resource: { values: [[new Date().toISOString()]] }
    });

    return true;
  } catch (error) {
    console.error('Error updating user last login:', error);
    throw error;
  }
}

// Main function handler
exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
    
    console.log('Auth function called:', { httpMethod, path });

    // POST /api/users/login - User login
    if (httpMethod === 'POST' && path === '/api/users/login') {
      const { username, password } = JSON.parse(body);
      
      if (!username || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Username and password are required' })
        };
      }

      try {
        // Get all users
        const users = await getAllUsers();
        console.log('Users sheet response:', {
          rowCount: users.length + 1,
          firstRow: Object.keys(users[0] || {}),
          dataRows: users.length
        });

        // Find user by username
        const user = users.find(u => u.Username === username);
        
        if (!user) {
          console.log('User not found for username:', username);
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid credentials' })
          };
        }

        console.log('User found:', {
          id: user.ID,
          username: user.Username,
          email: user.Email,
          role: user.Role,
          status: user.Status
        });

        // Check if user is active
        if (user.Status !== 'active') {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Account is not active' })
          };
        }

        // Verify password
        console.log('Verifying password...');
        const isValidPassword = await verifyPassword(password, user.Password);
        
        if (!isValidPassword) {
          console.log('Password verification failed');
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid credentials' })
          };
        }

        console.log('Password verified successfully');

        // Update last login
        console.log('Updating last login in sheet...');
        await updateUserLastLogin(user.ID);

        // Generate token
        const token = `token_${Date.now()}_${user.ID}`;
        
        // Remove password from user data
        const { Password, ...userWithoutPassword } = user;

        console.log('Login successful for user:', user.Username, 'Role:', user.Role);
        console.log('Generated token for user:', token);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            message: 'Login successful',
            user: userWithoutPassword,
            token: token
          })
        };

      } catch (error) {
        console.error('Login error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Login failed', details: error.message })
        };
      }
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
