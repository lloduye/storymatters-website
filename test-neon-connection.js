const { Pool } = require('pg');

// Test the same connection setup that Netlify Functions will use
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_QANzfo0P5YlC@ep-divine-credit-aeo8sru9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('🧪 Testing Neon connection for Netlify Functions...');
    
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    // Test stories query
    console.log('\n📚 Testing stories query...');
    const storiesResult = await client.query('SELECT COUNT(*) FROM stories');
    console.log(`Stories count: ${storiesResult.rows[0].count}`);
    
    // Test users query
    console.log('\n👥 Testing users query...');
    const usersResult = await client.query('SELECT COUNT(*) FROM users');
    console.log(`Users count: ${usersResult.rows[0].count}`);
    
    // Test specific story query
    console.log('\n🔍 Testing specific story query...');
    const storyResult = await client.query('SELECT title, author FROM stories LIMIT 1');
    if (storyResult.rows.length > 0) {
      console.log(`Sample story: ${storyResult.rows[0].title} by ${storyResult.rows[0].author}`);
    }
    
    client.release();
    console.log('\n🎉 All tests passed! Your Netlify Functions should work with Neon.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
