const { Pool } = require('pg');

// Neon database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_QANzfo0P5YlC@ep-divine-credit-aeo8sru9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function cleanDuplicates() {
  try {
    console.log('🧹 Cleaning up duplicate data...');
    
    const client = await pool.connect();
    
    // Clear all data
    console.log('🗑️ Clearing all existing data...');
    await client.query('DELETE FROM stories');
    await client.query('DELETE FROM users');
    console.log('✅ Data cleared');
    
    // Add test users
    console.log('👥 Adding test users...');
    const testUsers = [
      {
        username: 'admin',
        full_name: 'Admin User',
        email: 'admin@storymatters.com',
        password_hash: 'admin123',
        role: 'admin'
      },
      {
        username: 'editor',
        full_name: 'Editor Test',
        email: 'editor@storymatters.com',
        password_hash: 'editor123',
        role: 'editor'
      }
    ];
    
    for (const user of testUsers) {
      await client.query(`
        INSERT INTO users (username, full_name, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
      `, [user.username, user.full_name, user.email, user.password_hash, user.role]);
      console.log(`✅ Added user: ${user.full_name}`);
    }
    
    // Add sample stories
    console.log('📚 Adding sample stories...');
    const sampleStories = [
      {
        title: 'The Power of Community: How Neighbors Came Together',
        excerpt: 'A heartwarming story about community collaboration.',
        author: 'Editor Test',
        location: 'Local Community',
        category: 'Community',
        content: 'This is a sample story content...',
        status: 'published',
        featured: true
      },
      {
        title: 'Digital Transformation: Small Business Success Stories',
        excerpt: 'Local businesses adapting to the digital age.',
        author: 'Editor Test',
        location: 'Various Locations',
        category: 'Business',
        content: 'This is a sample story content...',
        status: 'published',
        featured: false
      }
    ];
    
    for (const story of sampleStories) {
      await client.query(`
        INSERT INTO stories (title, excerpt, author, location, category, content, status, featured)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [story.title, story.excerpt, story.author, story.location, story.category, story.content, story.status, story.featured]);
      console.log(`✅ Added story: ${story.title}`);
    }
    
    client.release();
    console.log('\n🎉 Database cleanup completed!');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
  } finally {
    await pool.end();
  }
}

cleanDuplicates();
