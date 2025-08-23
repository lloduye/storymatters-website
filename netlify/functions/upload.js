const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

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
      // Check if body exists and is base64 encoded
      if (!body) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'No file data provided' })
        };
      }

      try {
        // Parse the request body
        const requestData = JSON.parse(body);
        const { file, fileName, fileType } = requestData;

        if (!file || !fileName) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Missing file data or filename' })
          };
        }

        // Upload to Cloudinary
        console.log('Uploading to Cloudinary:', { fileName, fileType });
        
        const uploadResult = await cloudinary.uploader.upload(file, {
          folder: 'storymatters',
          public_id: `story_${Date.now()}_${fileName.replace(/\.[^/.]+$/, '')}`,
          overwrite: false,
          resource_type: 'auto'
        });

        console.log('Cloudinary upload successful:', uploadResult);

        // Store file info in database
        try {
          const client = await pool.connect();
          await client.query(`
            INSERT INTO file_uploads (file_name, file_type, file_url, uploaded_at)
            VALUES ($1, $2, $3, $4)
          `, [
            fileName,
            fileType || 'image/jpeg',
            uploadResult.secure_url,
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
            imageUrl: uploadResult.secure_url,
            fileName: fileName,
            publicId: uploadResult.public_id
          })
        };

      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'Failed to upload file',
            details: uploadError.message 
          })
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
