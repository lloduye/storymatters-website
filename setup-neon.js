const { Pool } = require('pg');

// Neon database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_QANzfo0P5YlC@ep-divine-credit-aeo8sru9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  try {
    console.log('🔌 Testing Neon database connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to Neon database successfully!');
    
    // Create stories table
    console.log('📝 Creating stories table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        author VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        publish_date DATE,
        image TEXT,
        category VARCHAR(100),
        read_time VARCHAR(50) DEFAULT '5 min',
        content TEXT,
        tags TEXT,
        featured BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'draft',
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Stories table created/verified!');
    
    // Create users table
    console.log('👥 Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'editor',
        status VARCHAR(50) DEFAULT 'active',
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified!');
    
    // Create indexes
    console.log('📊 Creating database indexes...');
    await client.query('CREATE INDEX IF NOT EXISTS idx_stories_author ON stories(author)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_stories_featured ON stories(featured)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)');
    console.log('✅ Database indexes created!');
    
    // Test insert
    console.log('🧪 Testing database operations...');
    const testResult = await client.query('SELECT COUNT(*) FROM stories');
    console.log(`📊 Current stories count: ${testResult.rows[0].count}`);
    
    client.release();
    console.log('\n🎉 Neon database setup completed successfully!');
    console.log('🚀 You can now run the migration script: node migrate-to-neon.js');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
