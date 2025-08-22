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
async function addStoryToNeon(storyData) {
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
async function updateStoryInNeon(storyId, storyData) {
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
async function deleteStoryFromNeon(storyId) {
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

// Export all functions
module.exports = {
  getAllStories,
  getStoriesByUser,
  getStoryById,
  addStoryToNeon,
  updateStoryInNeon,
  deleteStoryFromNeon,
  toggleStoryStatus,
  toggleFeaturedStatus,
  incrementViewCount
};
