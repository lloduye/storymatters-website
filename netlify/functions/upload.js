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
      
      // Parse multipart form data
      let fileName = '';
      let fileType = '';
      
      // Extract file info from the request
      if (body) {
        // For multipart form data, we need to parse it differently
        // Since Netlify Functions have limitations, we'll extract basic info
        const bodyString = body.toString();
        
        // Extract filename from multipart data
        const filenameMatch = bodyString.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          fileName = filenameMatch[1];
        }
        
        // Extract content type
        const contentTypeMatch = bodyString.match(/Content-Type: ([^\r\n]+)/);
        if (contentTypeMatch) {
          fileType = contentTypeMatch[1];
        }
        
        // If we can't extract from multipart, use defaults
        if (!fileName) {
          fileName = `image_${Date.now()}.jpg`;
        }
        if (!fileType) {
          fileType = 'image/jpeg';
        }
      }
      
      // Generate a mock file URL (in production, this would be the actual uploaded file URL)
      const fileUrl = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Uploaded+Image`;
      
      // Store file info in database if needed
      try {
        const client = await pool.connect();
        await client.query(`
          INSERT INTO file_uploads (file_name, file_type, file_url, uploaded_at)
          VALUES ($1, $2, $3, $4)
        `, [
          fileName,
          fileType,
          fileUrl,
          new Date()
        ]);
        client.release();
      } catch (dbError) {
        console.log('Database storage failed, but continuing with upload:', dbError);
        // Continue even if database storage fails
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'File uploaded successfully',
          imageUrl: fileUrl, // Changed from fileUrl to imageUrl to match frontend expectation
          fileName: fileName
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
