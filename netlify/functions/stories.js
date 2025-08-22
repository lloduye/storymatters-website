const { Pool } = require('pg');

// Neon database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper function to get all stories from Neon
async function getAllStories() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM stories ORDER BY created_at DESC');
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Error fetching stories from Neon:', error);
    throw error;
  }
}

// Helper function to get stories by user
async function getStoriesByUser(author) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT * FROM stories WHERE author = $1 ORDER BY created_at DESC',
      [author]
    );
    client.release();
    return result.rows;
  } catch (error) {
    console.error('Error fetching user stories from Neon:', error);
    throw error;
  }
}

// Helper function to get a single story by ID
async function getStoryById(id) {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM stories WHERE id = $1', [id]);
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Error fetching story by ID from Neon:', error);
    throw error;
  }
}

// Helper function to add a new story to Neon
async function addStoryToSheet(storyData) {
  try {
    console.log('Adding story to Neon with data:', storyData);
    
    const client = await pool.connect();
    const result = await client.query(`
      INSERT INTO stories (
        title, excerpt, author, location, publish_date, 
        image, category, read_time, content, tags, 
        featured, status, view_count, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      storyData.title || '',
      storyData.excerpt || '',
      storyData.author || '',
      storyData.location || '',
      storyData.publishDate || new Date().toISOString().split('T')[0],
      storyData.image || '',
      storyData.category || '',
      storyData.readTime || '5 min',
      storyData.content || '',
      storyData.tags || '',
      storyData.featured ? true : false,
      storyData.status || 'draft',
      storyData.viewCount || 0,
      new Date(),
      new Date()
    ]);
    
    client.release();
    console.log('Story added successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error adding story to Neon:', error);
    throw error;
  }
}

// Helper function to update a story in Neon
async function updateStoryInSheet(storyId, storyData) {
  try {
    console.log('Updating story in Neon:', storyId, storyData);
    
    const client = await pool.connect();
    const result = await client.query(`
      UPDATE stories SET
        title = $1, excerpt = $2, author = $3, location = $4, 
        publish_date = $5, image = $6, category = $7, read_time = $8, 
        content = $9, tags = $10, featured = $11, status = $12, 
        view_count = $13, updated_at = $14
      WHERE id = $15
      RETURNING *
    `, [
      storyData.title || '',
      storyData.excerpt || '',
      storyData.author || '',
      storyData.location || '',
      storyData.publishDate || new Date().toISOString().split('T')[0],
      storyData.image || '',
      storyData.category || '',
      storyData.readTime || '5 min',
      storyData.content || '',
      storyData.tags || '',
      storyData.featured ? true : false,
      storyData.status || 'draft',
      storyData.viewCount || 0,
      new Date(),
      storyId
    ]);
    
    client.release();
    console.log('Story updated successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating story in Neon:', error);
    throw error;
  }
}

// Helper function to delete a story from Neon
async function deleteStoryFromSheet(storyId) {
  try {
    const client = await pool.connect();
    await client.query('DELETE FROM stories WHERE id = $1', [storyId]);
    client.release();
    return true;
  } catch (error) {
    console.error('Error deleting story from Neon:', error);
    throw error;
  }
}

// Helper function to toggle story status
async function toggleStoryStatus(storyId, newStatus) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE stories SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [newStatus, new Date(), storyId]
    );
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Error toggling story status in Neon:', error);
    throw error;
  }
}

// Helper function to toggle featured status
async function toggleFeaturedStatus(storyId, featured) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      'UPDATE stories SET featured = $1, updated_at = $2 WHERE id = $3 RETURNING *',
      [featured, new Date(), storyId]
    );
    client.release();
    return result.rows[0];
  } catch (error) {
    console.error('Error toggling featured status in Neon:', error);
    throw error;
  }
}

// Helper function to increment view count
async function incrementViewCount(storyId) {
  try {
    const client = await pool.connect();
    await client.query(
      'UPDATE stories SET view_count = view_count + 1 WHERE id = $1',
      [storyId]
    );
    client.release();
    return true;
  } catch (error) {
    console.error('Error incrementing view count in Neon:', error);
    throw error;
  }
}

// Main function handler
exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
    const { httpMethod, path, body, queryStringParameters } = event;
    
    console.log('Function called:', { httpMethod, path, body: body ? JSON.parse(body) : null });

    // GET /api/stories - Get all stories
    if (httpMethod === 'GET' && path === '/api/stories') {
      const stories = await getAllStories();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(stories)
      };
    }

    // GET /api/stories/user/:author - Get stories by user
    if (httpMethod === 'GET' && path.match(/^\/api\/stories\/user\/.+$/)) {
      const author = decodeURIComponent(path.split('/user/')[1]);
      const stories = await getStoriesByUser(author);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(stories)
      };
    }

    // GET /api/stories/:id - Get specific story
    if (httpMethod === 'GET' && path.match(/^\/api\/stories\/\d+$/)) {
      const storyId = path.split('/').pop();
      const story = await getStoryById(storyId);
      
      if (!story) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Story not found' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(story)
      };
    }

    // POST /api/stories - Create new story
    if (httpMethod === 'POST' && path === '/api/stories') {
      const storyData = JSON.parse(body);
      
      // Validate required fields
      if (!storyData.title || !storyData.content || !storyData.author) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Missing required fields', 
            required: ['title', 'content', 'author'],
            received: Object.keys(storyData)
          })
        };
      }
      
      await addStoryToSheet(storyData);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ message: 'Story created successfully' })
      };
    }

    // PUT /api/stories/:id - Update story
    if (httpMethod === 'PUT' && path.match(/^\/api\/stories\/\d+$/)) {
      const storyId = path.split('/').pop();
      const storyData = JSON.parse(body);
      
      await updateStoryInSheet(storyId, storyData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Story updated successfully' })
      };
    }

    // DELETE /api/stories/:id - Delete story
    if (httpMethod === 'DELETE' && path.match(/^\/api\/stories\/\d+$/)) {
      const storyId = path.split('/').pop();
      
      await deleteStoryFromSheet(storyId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Story deleted successfully' })
      };
    }

    // PATCH /api/stories/:id/status - Update story status
    if (httpMethod === 'PATCH' && path.match(/^\/api\/stories\/\d+\/status$/)) {
      const storyId = path.split('/')[3];
      const { status } = JSON.parse(body);
      
      if (!['draft', 'published'].includes(status)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid status. Must be "draft" or "published"' })
        };
      }
      
      const updatedStory = await toggleStoryStatus(storyId, status);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Story status updated successfully', status, story: updatedStory })
      };
    }

    // PATCH /api/stories/:id/featured - Toggle featured status
    if (httpMethod === 'PATCH' && path.match(/^\/api\/stories\/\d+\/featured$/)) {
      const storyId = path.split('/')[3];
      const { featured } = JSON.parse(body);
      
      const updatedStory = await toggleFeaturedStatus(storyId, featured);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Story featured status updated successfully', featured, story: updatedStory })
      };
    }

    // PATCH /api/stories/:id/view - Increment view count
    if (httpMethod === 'PATCH' && path.match(/^\/api\/stories\/\d+\/view$/)) {
      const storyId = path.split('/')[3];
      
      await incrementViewCount(storyId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'View count updated successfully' })
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
