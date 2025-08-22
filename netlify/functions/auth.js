const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Neon database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper function to authenticate user
async function authenticateUser(username, password) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1 AND status = $2',
      [username, 'active']
    );
    client.release();
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return null;
    }
    
    // Remove password from user object
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

// Helper function to get user by username
async function getUserByUsername(username) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    client.release();
    
    if (result.rows.length === 0) {
      return null;
    }
    
    // Remove password from user object
    const { password_hash, ...userWithoutPassword } = result.rows[0];
    return userWithoutPassword;
  } catch (error) {
    console.error('Error getting user by username:', error);
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

    // POST /api/auth/login - User login
    if (httpMethod === 'POST' && path === '/api/auth/login') {
      const { username, password } = JSON.parse(body);
      
      // Validate required fields
      if (!username || !password) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Missing required fields', 
            required: ['username', 'password'],
            received: Object.keys({ username, password })
          })
        };
      }
      
      const user = await authenticateUser(username, password);
      
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }
      
      // Generate a simple token (in production, use JWT)
      const token = `token_${user.id}_${Date.now()}`;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Login successful',
          user,
          token
        })
      };
    }

    // POST /api/auth/register - User registration
    if (httpMethod === 'POST' && path === '/api/auth/register') {
      const userData = JSON.parse(body);
      
      // Validate required fields
      if (!userData.username || !userData.password || !userData.fullName) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Missing required fields', 
            required: ['username', 'password', 'fullName'],
            received: Object.keys(userData)
          })
        };
      }
      
      // Check if user already exists
      const existingUser = await getUserByUsername(userData.username);
      if (existingUser) {
        return {
          statusCode: 409,
          headers,
          body: JSON.stringify({ error: 'User with this username already exists' })
        };
      }
      
      // Hash password and create user
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const client = await pool.connect();
      const result = await client.query(`
        INSERT INTO users (username, full_name, email, password_hash, role, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `, [
        userData.username || userData.email.split('@')[0],
        userData.fullName,
        userData.email,
        hashedPassword,
        userData.role || 'editor',
        'active'
      ]);
      client.release();
      
      const newUser = result.rows[0];
      const { password_hash, ...userWithoutPassword } = newUser;
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          message: 'User registered successfully',
          user: userWithoutPassword
        })
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
