const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Neon database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper function to get all users from Neon
async function getAllUsers() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users ORDER BY created_at DESC');
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Error fetching users from Neon:', error);
    throw error;
  }
}

// Helper function to add a new user to Neon
async function addUserToNeon(userData) {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const client = await pool.connect();
    const result = await client.query(`
      INSERT INTO users (username, full_name, email, password_hash, role, status, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      userData.username || '',
      userData.fullName || '',
      userData.email || '',
      hashedPassword,
      userData.role || 'editor',
      userData.status || 'active',
      userData.phone || null
    ]);
    
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Error adding user to Neon:', error);
    throw error;
  }
}

// Helper function to update a user in Neon
async function updateUserInNeon(userId, userData) {
  try {
    const client = await pool.connect();
    
    let query = 'UPDATE users SET ';
    const values = [];
    let paramCount = 1;
    
    if (userData.username) {
      query += `username = $${paramCount++}, `;
      values.push(userData.username);
    }
    if (userData.fullName) {
      query += `full_name = $${paramCount++}, `;
      values.push(userData.fullName);
    }
    if (userData.email) {
      query += `email = $${paramCount++}, `;
      values.push(userData.email);
    }
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      query += `password_hash = $${paramCount++}, `;
      values.push(hashedPassword);
    }
    if (userData.role) {
      query += `role = $${paramCount++}, `;
      values.push(userData.role);
    }
    if (userData.status) {
      query += `status = $${paramCount++}, `;
      values.push(userData.status);
    }
    if (userData.phone !== undefined) {
      query += `phone = $${paramCount++}, `;
      values.push(userData.phone);
    }
    
    // Remove trailing comma and space
    query = query.slice(0, -2);
    query += `, updated_at = $${paramCount++} WHERE id = $${paramCount++}`;
    values.push(new Date(), userId);
    
    const result = await client.query(query, values);
    client.release();
    
    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user in Neon:', error);
    throw error;
  }
}

// Helper function to delete a user from Neon
async function deleteUserFromNeon(userId) {
  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM users WHERE id = $1', [userId]);
    client.release();
    
    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting user from Neon:', error);
    throw error;
  }
}

// Helper function to verify user token
async function verifyUserToken(token) {
  try {
    if (!token) return null;
    
    // Extract user ID from token (format: token_123_1234567890)
    const tokenParts = token.split('_');
    if (tokenParts.length !== 3) return null;
    
    const userId = tokenParts[1];
    
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE id = $1 AND status = $2', [userId, 'active']);
    client.release();
    
    if (result.rows.length === 0) return null;
    
    return result.rows[0];
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

// Helper function to get user by ID
async function getUserById(userId) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user by ID from Neon:', error);
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

    // GET /api/users/me - Get current user by token
    if (httpMethod === 'GET' && path === '/api/users/me') {
      // Check authorization header
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Authorization token required' })
        };
      }
      
      const token = authHeader.split(' ')[1];
      const user = await verifyUserToken(token);
      
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid or expired token' })
        };
      }
      
      // Remove password from user object
      const { password_hash, ...userWithoutPassword } = user;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(userWithoutPassword)
      };
    }

    // GET /api/users - Get all users
    if (httpMethod === 'GET' && path === '/api/users') {
      const users = await getAllUsers();
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(usersWithoutPasswords)
      };
    }

    // GET /api/users/:id - Get specific user
    if (httpMethod === 'GET' && path.match(/^\/api\/users\/\d+$/)) {
      const userId = path.split('/').pop();
      const user = await getUserById(userId);
      
      if (!user) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'User not found' })
        };
      }
      
      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(userWithoutPassword)
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
      
      const newUser = await addUserToNeon(userData);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: 'User created successfully', user: newUser })
      };
    }

    // PUT /api/users/:id - Update user
    if (httpMethod === 'PUT' && path.match(/^\/api\/users\/\d+$/)) {
      const userId = path.split('/').pop();
      const userData = JSON.parse(body);
      
      const updatedUser = await updateUserInNeon(userId, userData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'User updated successfully', user: updatedUser })
      };
    }

    // DELETE /api/users/:id - Delete user
    if (httpMethod === 'DELETE' && path.match(/^\/api\/users\/\d+$/)) {
      const userId = path.split('/').pop();
      
      await deleteUserFromNeon(userId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'User deleted successfully' })
      };
    }

    // PATCH /api/users/:id/status - Update user status
    if (httpMethod === 'PATCH' && path.match(/^\/api\/users\/\d+\/status$/)) {
      const userId = path.split('/')[3];
      const { status } = JSON.parse(body);
      
      if (!['active', 'inactive'].includes(status)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid status. Must be "active" or "inactive"' })
        };
      }
      
      const updatedUser = await updateUserInNeon(userId, { status });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'User status updated successfully', status, user: updatedUser })
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
