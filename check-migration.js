const { Pool } = require('pg');

// Neon database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_QANzfo0P5YlC@ep-divine-credit-aeo8sru9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkMigration() {
  try {
    console.log('🔍 Checking migrated data in Neon...');
    
    const client = await pool.connect();
    
    // Check stories
    console.log('\n📚 Stories in Neon:');
    const storiesResult = await client.query('SELECT id, title, author, status, created_at FROM stories ORDER BY id');
    console.log(`Total stories: ${storiesResult.rows.length}`);
    storiesResult.rows.forEach(story => {
      console.log(`  ${story.id}. ${story.title} (by ${story.author}) - ${story.status}`);
    });
    
    // Check users
    console.log('\n👥 Users in Neon:');
    const usersResult = await client.query('SELECT id, username, full_name, email, role FROM users ORDER BY id');
    console.log(`Total users: ${usersResult.rows.length}`);
    usersResult.rows.forEach(user => {
      console.log(`  ${user.id}. ${user.full_name} (${user.email}) - ${user.role}`);
    });
    
    client.release();
    console.log('\n✅ Migration verification completed!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  } finally {
    await pool.end();
  }
}

checkMigration();
