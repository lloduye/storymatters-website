const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const ZOHO_CONFIG = {
  clientId: '1000.29J0DTP63DRAAZGF7THPNTS4R348OD',
  clientSecret: 'a19c6447f97c5e87b0771fe9914e95b6a9d8917f1e',
  refreshToken: '1000.361c7298d2d63425b3281ab20bafa636.ed8c8896b22e76944868a345fab4d1e4',
  authUrl: 'https://accounts.zoho.com',
  apiUrl: 'https://mail.zoho.com/api/accounts'
};

let accessToken = null;
let accountId = null;

async function getAccessToken() {
  try {
    console.log('Getting access token...');
    const response = await axios.post(`${ZOHO_CONFIG.authUrl}/oauth/v2/token`, null, {
      params: {
        refresh_token: ZOHO_CONFIG.refreshToken,
        client_id: ZOHO_CONFIG.clientId,
        client_secret: ZOHO_CONFIG.clientSecret,
        grant_type: 'refresh_token'
      }
    });

    console.log('Access token response:', response.data);
    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
}

async function getAccountId() {
  if (accountId) return accountId;
  
  try {
    console.log('Getting account ID...');
    const token = await getAccessToken();
    const response = await axios.get(`${ZOHO_CONFIG.apiUrl}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Account ID response:', response.data);
    accountId = response.data.data[0].accountId;
    return accountId;
  } catch (error) {
    console.error('Error getting account ID:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
}

app.get('/api/mail/messages', async (req, res) => {
  try {
    console.log('Fetching messages...');
    const token = await getAccessToken();
    const id = await getAccountId();
    
    console.log('Making request to Zoho API...');
    const response = await axios.get(`${ZOHO_CONFIG.apiUrl}/${id}/messages/view`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Messages fetched successfully');
    res.json(response.data);
  } catch (error) {
    console.error('Error in /api/mail/messages:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data
    });
  }
});

app.post('/api/mail/messages/:messageId/read', async (req, res) => {
  try {
    const token = await getAccessToken();
    const id = await getAccountId();
    const response = await axios.post(
      `${ZOHO_CONFIG.apiUrl}/${id}/messages/${req.params.messageId}/read`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/mail/messages/:messageId', async (req, res) => {
  try {
    const token = await getAccessToken();
    const id = await getAccountId();
    const response = await axios.delete(
      `${ZOHO_CONFIG.apiUrl}/${id}/messages/${req.params.messageId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', {
    nodeEnv: process.env.NODE_ENV,
    zohoConfig: {
      ...ZOHO_CONFIG,
      clientSecret: '***hidden***'
    }
  });
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${PORT + 1}`);
    server.close();
    app.listen(PORT + 1);
  } else {
    console.error('Server error:', err);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
}); 