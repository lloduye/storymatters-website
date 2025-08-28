const { Pool } = require('pg');

// Neon database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkAndFixFeaturedStories() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    // Check current featured stories
    console.log('\n=== Current Featured Stories ===');
    const featuredResult = await client.query('SELECT id, title, featured FROM stories WHERE featured = true');
    console.log(`Found ${featuredResult.rows.length} featured stories:`);
    featuredResult.rows.forEach(story => {
      console.log(`- ID: ${story.id}, Title: ${story.title}, Featured: ${story.featured} (${typeof story.featured})`);
    });
    
    // Check stories with string 'true' value
    console.log('\n=== Stories with String "true" Featured Value ===');
    const stringTrueResult = await client.query("SELECT id, title, featured FROM stories WHERE featured = 'true'");
    console.log(`Found ${stringTrueResult.rows.length} stories with featured = 'true':`);
    stringTrueResult.rows.forEach(story => {
      console.log(`- ID: ${story.id}, Title: ${story.title}, Featured: ${story.featured} (${typeof story.featured})`);
    });
    
    // Check all stories to see the current state
    console.log('\n=== All Stories Featured Status ===');
    const allStoriesResult = await client.query('SELECT id, title, featured FROM stories ORDER BY id');
    console.log(`Total stories: ${allStoriesResult.rows.length}`);
    allStoriesResult.rows.forEach(story => {
      console.log(`- ID: ${story.id}, Title: ${story.title}, Featured: ${story.featured} (${typeof story.featured})`);
    });
    
    // Fix stories with string 'true' value to boolean true
    if (stringTrueResult.rows.length > 0) {
      console.log('\n=== Fixing String Featured Values ===');
      for (const story of stringTrueResult.rows) {
        console.log(`Fixing story ID ${story.id}: "${story.title}"`);
        await client.query('UPDATE stories SET featured = true WHERE id = $1', [story.id]);
      }
      console.log('Fixed all string featured values to boolean true');
    }
    
    // Set only a few stories as featured (for testing)
    console.log('\n=== Setting Featured Stories ===');
    
    // First, set all stories to not featured
    await client.query('UPDATE stories SET featured = false');
    console.log('Set all stories to not featured');
    
    // Then, set only the first 2 stories as featured
    const setFeaturedResult = await client.query('UPDATE stories SET featured = true WHERE id IN (SELECT id FROM stories ORDER BY id LIMIT 2) RETURNING id, title');
    console.log(`Set ${setFeaturedResult.rows.length} stories as featured:`);
    setFeaturedResult.rows.forEach(story => {
      console.log(`- ID: ${story.id}, Title: ${story.title}`);
    });
    
    // Verify the changes
    console.log('\n=== Final Featured Stories ===');
    const finalFeaturedResult = await client.query('SELECT id, title, featured FROM stories WHERE featured = true');
    console.log(`Final featured stories: ${finalFeaturedResult.rows.length}`);
    finalFeaturedResult.rows.forEach(story => {
      console.log(`- ID: ${story.id}, Title: ${story.title}, Featured: ${story.featured} (${typeof story.featured})`);
    });
    
    client.release();
    console.log('\n=== Database check and fix completed ===');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

// Run the function
checkAndFixFeaturedStories();
