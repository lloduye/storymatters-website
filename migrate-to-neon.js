const { google } = require('googleapis');
const { Pool } = require('pg');

// Google Sheets API setup (for reading existing data)
const auth = new google.auth.GoogleAuth({
  credentials: require('./google-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '17-0ZMmUKQFqP07Xpbp_IJpARRjLk6aqJjuKxqAf11lA';

// Neon database connection
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_QANzfo0P5YlC@ep-divine-credit-aeo8sru9-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrateStories() {
  try {
    console.log('Starting migration from Google Sheets to Neon...');
    
    // Read stories from Google Sheets
    console.log('Reading stories from Google Sheets...');
    const storiesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Stories!A:Z',
    });
    
    const rows = storiesResponse.data.values;
    if (!rows || rows.length <= 1) {
      console.log('No stories found in Google Sheets');
      return;
    }
    
    const headers = rows[0];
    const stories = rows.slice(1).map((row, index) => {
      const story = {};
      headers.forEach((header, i) => {
        story[header] = row[i] || '';
      });
      return story;
    });
    
    console.log(`Found ${stories.length} stories to migrate`);
    
    // Create stories table if it doesn't exist
    const client = await pool.connect();
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
    
    // Insert stories into Neon
    for (const story of stories) {
      await client.query(`
        INSERT INTO stories (
          title, excerpt, author, location, publish_date, 
          image, category, read_time, content, tags, 
          featured, status, view_count, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      `, [
        story.title || '',
        story.excerpt || '',
        story.author || '',
        story.location || '',
        story.publishDate || null,
        story.image || '',
        story.category || '',
        story.readTime || '5 min',
        story.content || '',
        story.tags || '',
        story.featured === 'true',
        story.status || 'draft',
        parseInt(story.viewCount) || 0,
        new Date(),
        new Date()
      ]);
      console.log(`Migrated story: ${story.title}`);
    }
    
    client.release();
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

async function migrateUsers() {
  try {
    console.log('Starting user migration...');
    
    // Read users from Google Sheets
    const usersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Users!A:Z',
    });
    
    const rows = usersResponse.data.values;
    if (!rows || rows.length <= 1) {
      console.log('No users found in Google Sheets');
      return;
    }
    
    const headers = rows[0];
    const users = rows.slice(1).map((row, index) => {
      const user = {};
      headers.forEach((header, i) => {
        user[header] = row[i] || '';
      });
      return user;
    });
    
    console.log(`Found ${users.length} users to migrate`);
    
    // Create users table if it doesn't exist
    const client = await pool.connect();
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
    
    // Insert users into Neon
    for (const user of users) {
      // Skip users with empty emails
      if (!user.email || user.email.trim() === '') {
        console.log(`⚠️ Skipping user with empty email: ${user.fullName || user.name || 'Unknown'}`);
        continue;
      }
      
      try {
        await client.query(`
          INSERT INTO users (
            username, full_name, email, password_hash, role, status, phone
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (email) DO NOTHING
        `, [
          user.username || user.email?.split('@')[0] || `user_${Date.now()}`,
          user.fullName || user.name || 'Unknown User',
          user.email.trim(),
          user.passwordHash || user.password || 'temp_hash',
          user.role || 'editor',
          user.status || 'active',
          user.phone || null
        ]);
        console.log(`✅ Migrated user: ${user.fullName || user.name || user.email}`);
      } catch (error) {
        console.log(`⚠️ Failed to migrate user ${user.fullName || user.name || user.email}: ${error.message}`);
      }
    }
    
    client.release();
    console.log('User migration completed successfully!');
    
  } catch (error) {
    console.error('User migration failed:', error);
    throw error;
  }
}

// Run migrations
async function runMigrations() {
  try {
    await migrateStories();
    await migrateUsers();
    console.log('All migrations completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
