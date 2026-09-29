// @ts-nocheck
import axios from 'axios';

async function testPostLansia() {
  try {
    const data = {
      nik: '9999999999999999', // Random NIK
      nama: 'Test Lansia',
      jk: 'P',
      tglLahir: new Date('1950-01-01').toISOString(),
      alamat: 'Test Alamat',
      kelurahan: 'Lawang',
      rw: '01',
      rt: '01',
      usia: 76,
      status: 'Terdaftar',
    };
    
    const res = await axios.post('http://localhost:8080/api/lansia', data);
    console.log("Success:", res.data);
  } catch (err: any) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}
testPostLansia();
