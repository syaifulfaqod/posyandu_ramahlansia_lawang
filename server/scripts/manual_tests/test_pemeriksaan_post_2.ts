// @ts-nocheck
import axios from 'axios';

async function testPost() {
  try {
    const getRes = await axios.get('http://localhost:8080/api/lansia');
    const lansia = getRes.data[0];
    if (!lansia) {
      console.log("No lansia found");
      return;
    }

    const data = {
      lansiaId: lansia.id,
      tglKunjungan: '2026-09-19',
      bb: '60.5', tb: '165.2', lingkarPerut: '80.5', lingkarLengan: '25.0',
      tdSistole: '120', tdDiastole: '80',
      gulaDarah: '', kolesterol: '', trigliserida: '', hdl: '', asamUrat: '',
      ekg: '', mataKanan: 'Normal', mataKiri: 'Normal', telingaKanan: 'Normal', telingaKiri: 'Normal',
      catatan: 'Testing lingkar perut dan lengan',
    };
    
    const res = await axios.post('http://localhost:8080/api/pemeriksaan', data);
    console.log("Success:", res.data);
  } catch (err: any) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}
testPost();
