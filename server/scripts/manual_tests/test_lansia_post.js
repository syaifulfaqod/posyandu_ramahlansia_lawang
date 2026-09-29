// @ts-nocheck
const http = require('http');

const payload = JSON.stringify({
  nik: "1234567890123456",
  nama: "Lansia Test",
  jk: "P",
  tglLahir: new Date("1950-01-01").toISOString(),
  alamat: "Jalan Test",
  kelurahan: "Kalirejo",
  rw: "03",
  rt: "01",
  usia: 76,
  status: 'Terdaftar'
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/lansia',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': payload.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.write(payload);
req.end();
