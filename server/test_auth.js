const axios = require('axios');

async function testAuth() {
  try {
    const res = await axios.post('http://localhost:8080/api/auth/sign-in/email', {
      email: 'kkn@posyandu.local',
      password: 'tahap1kknterbaik'
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.log('Error:', err.message);
    if (err.response) {
      console.log('Response data:', err.response.data);
    }
  }
}

testAuth();
