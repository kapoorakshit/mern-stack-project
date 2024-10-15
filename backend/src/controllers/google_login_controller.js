const express = require('express');
const axios = require('axios');
const router = express.Router();

const CLIENT_ID = '468307614044-fkadkiecnbobe03n2u7i4gvv7opknk24.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
router.get('/auth/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  res.redirect(url);
});
router.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;

  try {
    
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    });
    const { access_token, id_token } = data;
    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    console.log('Login successful:', profile);
    return res.status(200).json({
        message: 'Login successful',
        profile, // Include profile data here if needed
      });
  } catch (error) {

    if (error.response) {
      console.error('Error:', error.response.data.error);
    } else {
      console.error('Error:', error.message); // Log the error message
    }
    res.status(500).json({ error: 'Login failed, please try again.' }); 
  }
});
router.get('/', (req, res) => {

  res.redirect('/');
});
module.exports = router;
