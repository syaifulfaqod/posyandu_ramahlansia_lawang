// @ts-nocheck
const http = require('http');

const data = JSON.stringify({
  nama: "Testing2",
  username: "testing2",
  password: "password123",
  role: "Kader"
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.write(data);
req.end();
