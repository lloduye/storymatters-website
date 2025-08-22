const { google } = require('googleapis');

// Google Sheets API setup
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const STORIES_RANGE = 'Stories!A:Z';

// Helper function to get all stories from Google Sheets
async function getAllStories() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: STORIES_RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    const headers = rows[0];
    const stories = rows.slice(1).map((row, index) => {
      const story = {};
      headers.forEach((header, i) => {
        story[header] = row[i] || '';
      });
      story.id = index + 1; // Add ID for frontend
      return story;
    });

    return stories;
  } catch (error) {
    console.error('Error fetching stories from Google Sheets:', error);
    throw error;
  }
}

// Helper function to add a new story to Google Sheets
async function addStoryToSheet(storyData) {
  try {
    console.log('Adding story to sheet with data:', storyData);
    
    const values = [
      [
        storyData.title || '',
        storyData.excerpt || '',
        storyData.author || '',
        storyData.location || '',
        storyData.publishDate || new Date().toISOString().split('T')[0],
        storyData.image || '',
        storyData.category || '',
        storyData.readTime || '5 min', // Default read time
        storyData.content || '',
        storyData.tags || '',
        storyData.featured ? 'true' : 'false',
        storyData.status || 'draft',
        storyData.viewCount || '0',
        new Date().toISOString(),
        new Date().toISOString()
      ]
    ];
    
    console.log('Values to insert:', values);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: STORIES_RANGE,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values }
    });

    return true;
  } catch (error) {
    console.error('Error adding story to Google Sheets:', error);
    throw error;
  }
}

// Helper function to update a story in Google Sheets
async function updateStoryInSheet(storyId, storyData) {
  try {
    const values = [
      [
        storyData.title || '',
        storyData.excerpt || '',
        storyData.author || '',
        storyData.location || '',
        storyData.publishDate || new Date().toISOString().split('T')[0],
        storyData.image || '',
        storyData.category || '',
        storyData.readTime || '5 min', // Default read time
        storyData.content || '',
        storyData.tags || '',
        storyData.featured ? 'true' : 'false',
        storyData.status || 'draft',
        storyData.viewCount || '0',
        storyData.createdAt || new Date().toISOString(),
        new Date().toISOString()
      ]
    ];

    // Calculate the row number (stories start from row 2, so storyId + 1)
    const rowNumber = parseInt(storyId) + 1;
    
    // Validate that rowNumber is a valid number
    if (isNaN(rowNumber) || rowNumber < 2) {
      throw new Error(`Invalid story ID: ${storyId}. Row number calculated: ${rowNumber}`);
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `Stories!A${rowNumber}:O${rowNumber}`,
      valueInputOption: 'RAW',
      resource: { values }
    });

    return true;
  } catch (error) {
    console.error('Error updating story in Google Sheets:', error);
    throw error;
  }
}

// Helper function to delete a story from Google Sheets
async function deleteStoryFromSheet(storyId) {
  try {
    // Calculate the row number (stories start from row 2, so storyId + 1)
    const rowNumber = parseInt(storyId) + 1;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming Stories is the first sheet
                dimension: 'ROWS',
                startIndex: rowNumber - 1,
                endIndex: rowNumber
              }
            }
          }
        ]
      }
    });

    return true;
  } catch (error) {
    console.error('Error deleting story from Google Sheets:', error);
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

    // GET /api/stories/:id - Get specific story
    if (httpMethod === 'GET' && path.match(/^\/api\/stories\/\d+$/)) {
      const storyId = path.split('/').pop();
      const stories = await getAllStories();
      const story = stories.find(s => s.id == storyId);
      
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
      
      // Get current story data
      const stories = await getAllStories();
      const story = stories.find(s => s.id == storyId);
      
      if (!story) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Story not found' })
        };
      }
      
      // Update only the status and updatedAt fields
      const updateData = {
        ...story,
        status,
        updatedAt: new Date().toISOString()
      };
      
      await updateStoryInSheet(storyId, updateData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Story status updated successfully', status })
      };
    }

    // PATCH /api/stories/:id/featured - Toggle featured status
    if (httpMethod === 'PATCH' && path.match(/^\/api\/stories\/\d+\/featured$/)) {
      const storyId = path.split('/')[3];
      const { featured } = JSON.parse(body);
      
      // Get current story data
      const stories = await getAllStories();
      const story = stories.find(s => s.id == storyId);
      
      if (!story) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Story not found' })
        };
      }
      
      // Update only the featured and updatedAt fields
      const updateData = {
        ...story,
        featured: featured ? 'true' : 'false',
        updatedAt: new Date().toISOString()
      };
      
      await updateStoryInSheet(storyId, updateData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Story featured status updated successfully', featured })
      };
    }

    // PATCH /api/stories/:id/view - Increment view count
    if (httpMethod === 'PATCH' && path.match(/^\/api\/stories\/\d+\/view$/)) {
      const storyId = path.split('/')[3];
      
      // Get current story data
      const stories = await getAllStories();
      const story = stories.find(s => s.id == storyId);
      
      if (!story) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Story not found' })
        };
      }
      
      // Increment view count
      const currentViews = parseInt(story.viewCount) || 0;
      const newViews = currentViews + 1;
      
      // Update only the viewCount and updatedAt fields
      const updateData = {
        ...story,
        viewCount: newViews.toString(),
        updatedAt: new Date().toISOString()
      };
      
      await updateStoryInSheet(storyId, updateData);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'View count updated successfully', viewCount: newViews })
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
