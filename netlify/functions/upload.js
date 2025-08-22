const { Pool } = require('pg');

// Neon database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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
    
    console.log('Upload function called:', { httpMethod, path });

    // POST /api/upload - Handle file upload
    if (httpMethod === 'POST' && path === '/api/upload') {
      // For now, we'll simulate file upload since Netlify Functions have limitations
      // In production, you'd want to use a service like Cloudinary, AWS S3, or similar
      
      const uploadData = JSON.parse(body);
      
      if (!uploadData.fileName || !uploadData.fileType) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Missing required fields', 
            required: ['fileName', 'fileType'],
            received: Object.keys(uploadData)
          })
        };
      }
      
      // Generate a mock file URL (in production, this would be the actual uploaded file URL)
      const fileUrl = `https://example.com/uploads/${Date.now()}_${uploadData.fileName}`;
      
      // Store file info in database if needed
      const client = await pool.connect();
      await client.query(`
        INSERT INTO file_uploads (file_name, file_type, file_url, uploaded_at)
        VALUES ($1, $2, $3, $4)
      `, [
        uploadData.fileName,
        uploadData.fileType,
        fileUrl,
        new Date()
      ]);
      client.release();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'File uploaded successfully',
          fileUrl,
          fileName: uploadData.fileName
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
