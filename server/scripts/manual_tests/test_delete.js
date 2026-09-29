// @ts-nocheck
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/users/Of8MvkyGf8cGAjJJCptPnidEDiZre0Aw', // ipul's ID from check_db
  method: 'DELETE',
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.end();
