// @ts-nocheck
import axios from 'axios';

async function testPost() {
  try {
    // First get a valid lansia UUID
    const getRes = await axios.get('http://localhost:8080/api/lansia');
    const lansia = getRes.data[0];
    if (!lansia) {
      console.log("No lansia found");
      return;
    }

    const data = {
      lansiaId: lansia.id,
      tglKunjungan: '2026-09-18',
      bb: '', tb: '', lingkarPerut: '', lingkarLengan: '',
      tdSistole: '', tdDiastole: '',
      gulaDarah: '', kolesterol: '', trigliserida: '', hdl: '', asamUrat: '',
      ekg: '', mataKanan: 'Normal', mataKiri: 'Normal', telingaKanan: 'Normal', telingaKiri: 'Normal',
      skilasKognitifOrientasi: null, skilasKognitifMengulang: null,
      skilasMobilisasiBerdiri: null, skilasNutrisiBbturun: null,
      skilasNutrisiNafsumakan: null, skilasNutrisiLila: null,
      skilasMataMasalah: null, skilasMataTes: null,
      skilasTelingaBisik: null, skilasTelingaTes: null,
      aksMakan: null, aksMandi: null, aksPerawatan: null, aksBerpakaian: null, aksBuangAirKecil: null, aksBuangAirBesar: null, aksPenggunaanToilet: null, aksTransfer: null, aksMobilitas: null, aksNaikTurunTangga: null,
      pumaJk: null, pumaUsia: null, pumaMerokok: null, pumaNapasPendek: null, pumaDahak: null, pumaNapasBunyi: null, pumaSpirometri: null,
      catatan: 'ada keluhan sakit dibagian kaki',
    };
    
    const res = await axios.post('http://localhost:8080/api/pemeriksaan', data);
    console.log("Success:", res.data);
  } catch (err: any) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}
testPost();
