import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export const exportKartuBantuExcel = async (filteredData: any[], todayFormatted: string) => {
  try {
    const zip = new JSZip();

    for (const patient of filteredData) {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('Kartu Bantu');

      // --- Helper Functions ---
      const formatDate = (dateStr: string) => {
        if (!dateStr || dateStr === 'Belum pernah') return dateStr;
        try {
          const d = new Date(dateStr);
          if (isNaN(d.getTime())) return dateStr;
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
          return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        } catch {
          return dateStr;
        }
      };

      // --- 1. Header / Identitas ---
      ws.mergeCells('A1:J1');
      ws.getCell('A1').value = 'KARTU BANTU PEMERIKSAAN LANSIA';
      ws.getCell('A1').font = { bold: true, size: 14 };
      ws.getCell('A1').alignment = { horizontal: 'center' };

      ws.getCell('A3').value = 'Posyandu / Kelurahan';
      ws.getCell('C3').value = `: ${patient.kelurahan || '-'}`;
      ws.getCell('A4').value = 'Nama Lengkap';
      ws.getCell('C4').value = `: ${patient.nama || '-'}`;
      ws.getCell('A5').value = 'Nomor Induk Kependudukan (NIK)';
      ws.getCell('C5').value = `: ${patient.nik || '-'}`;
      ws.getCell('A6').value = 'Jenis Kelamin';
      ws.getCell('C6').value = `: ${patient.jk || '-'}`;
      ws.getCell('A7').value = 'Usia / Tanggal Lahir';
      ws.getCell('C7').value = `: ${patient.usia || '-'} th / ${formatDate(patient.tglLahir) || '-'}`;
      ws.getCell('A8').value = 'Alamat / RT RW';
      ws.getCell('C8').value = `: ${patient.alamat || '-'} / RT ${patient.rt || '-'} RW ${patient.rw || '-'}`;

      // Styling identity
      for (let r = 3; r <= 8; r++) {
        ws.getCell(`A${r}`).font = { bold: true };
        ws.mergeCells(`A${r}:B${r}`);
        ws.mergeCells(`C${r}:J${r}`);
      }

      // --- 2. Tabel Riwayat ---
      ws.getCell('A10').value = 'RIWAYAT PEMERIKSAAN FISIK, LAB & CATATAN';
      ws.getCell('A10').font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
      ws.getCell('A10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF10B981' } };
      ws.mergeCells('A10:K10');

      const headerRow = ws.addRow([
        'No', 'Tanggal', 'BB (kg)', 'TB (cm)', 'IMT',
        'Tensi', 'Gula Darah', 'Kolesterol', 'Trigliserida', 'Asam Urat', 'Catatan'
      ]);

      headerRow.font = { bold: true };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      const riwayatList = patient.riwayat && patient.riwayat.length > 0 ? patient.riwayat : [];
      if (riwayatList.length === 0 && patient.lastVisit && patient.lastVisit !== 'Belum pernah') {
        riwayatList.push({
          tglKunjungan: formatDate(patient.lastVisit), bb: patient.bb, tb: patient.tb,
          tdSistole: patient.tdSistole, tdDiastole: patient.tdDiastole, status: patient.status,
          gulaDarah: patient.gulaDarah, kolesterol: patient.kolesterol, asamUrat: patient.asamUrat,
          catatan: patient.catatan
        });
      }

      const getIMTStatus = (imt: number) => {
        if (imt < 18.5) return "Sangat Kurus/Kurus";
        if (imt >= 18.5 && imt <= 24.9) return "Normal";
        if (imt >= 25.0 && imt <= 29.9) return "Gemuk";
        return "Obesitas";
      };

      if (riwayatList.length === 0) {
        const emptyRow = ws.addRow(['', 'Belum ada riwayat pemeriksaan', '', '', '', '', '', '', '', '', '']);
        ws.mergeCells(`B${emptyRow.number}:K${emptyRow.number}`);
      } else {
        riwayatList.forEach((r: any, idx: number) => {
          const bbNum = parseFloat(r.bb);
          const tbNum = parseFloat(r.tb) / 100;
          let imt = '-';
          if (!isNaN(bbNum) && !isNaN(tbNum) && tbNum > 0) {
            const imtVal = (bbNum / (tbNum * tbNum));
            imt = `${imtVal.toFixed(1)} (${getIMTStatus(imtVal)})`;
          }
          const tensi = r.tdSistole && r.tdDiastole ? `${r.tdSistole}/${r.tdDiastole}` : '-';

          const row = ws.addRow([
            idx + 1, formatDate(r.tglKunjungan) || '-', r.bb || '-', r.tb || '-', imt,
            tensi, r.gulaDarah || '-', r.kolesterol || '-', r.trigliserida || '-', r.asamUrat || '-', r.catatan || '-'
          ]);

          row.alignment = { horizontal: 'center' };
          row.eachCell((cell) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          });
        });
      }

      ws.addRow([]); // spacing

      // --- Helper Function ---
      const addSection = (title: string, data: { q: string; a: string }[]) => {
        const titleRow = ws.addRow([title]);
        titleRow.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
        titleRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3B82F6' } };
        ws.mergeCells(`A${titleRow.number}:K${titleRow.number}`);
        
        data.forEach(item => {
          const row = ws.addRow([item.q, '', '', '', '', '', '', '', item.a]);
          ws.mergeCells(`A${row.number}:H${row.number}`);
          ws.mergeCells(`I${row.number}:K${row.number}`);
          row.getCell(1).alignment = { wrapText: true, vertical: 'top' };
          row.getCell(9).alignment = { wrapText: true, vertical: 'top', horizontal: 'center' };
          row.getCell(9).font = { bold: true };
          row.eachCell((cell) => {
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          });
        });
        ws.addRow([]);
      };

      const parseBool = (val: any) => {
        if (val === 1 || val === '1' || val === true || val === 'true') return true;
        if (val === 0 || val === '0' || val === false || val === 'false') return false;
        return null;
      };

      const yaTidak = (val: any) => {
        const b = parseBool(val);
        return b === true ? 'YA' : b === false ? 'TIDAK' : 'Belum diisi';
      };
      
      const getAksText = (key: string, val: any) => {
        if (val === undefined || val === null) return 'Belum diisi';
        
        switch (key) {
          case 'aksBAB':
          case 'aksBAK':
            if (val === 0) return 'Tidak terkendali (0 poin)';
            if (val === 1) return 'Kadang tidak terkendali (1 poin)';
            if (val === 2) return 'Terkendali (2 poin)';
            break;
          case 'aksGrooming':
          case 'aksMandi':
            if (val === 0) return 'Membutuhkan bantuan (0 poin)';
            if (val === 1) return 'Mandiri (1 poin)';
            break;
          case 'aksToilet':
          case 'aksBerpakaian':
            if (val === 0) return 'Tergantung (0 poin)';
            if (val === 1) return 'Sebagian dibantu (1 poin)';
            if (val === 2) return 'Mandiri (2 poin)';
            break;
          case 'aksMakan':
          case 'aksTangga':
            if (val === 0) return 'Tidak mampu (0 poin)';
            if (val === 1) return 'Membutuhkan bantuan (1 poin)';
            if (val === 2) return 'Mandiri (2 poin)';
            break;
          case 'aksTransfer':
            if (val === 0) return 'Tidak mampu (0 poin)';
            if (val === 1) return 'Membutuhkan banyak bantuan (1 poin)';
            if (val === 2) return 'Bantuan minimal (2 poin)';
            if (val === 3) return 'Mandiri (3 poin)';
            break;
          case 'aksMobilitas':
            if (val === 0) return 'Tidak mampu (0 poin)';
            if (val === 1) return 'Menggunakan kursi roda (1 poin)';
            if (val === 2) return 'Dengan bantuan (2 poin)';
            if (val === 3) return 'Mandiri (3 poin)';
            break;
        }
        return `${val} poin`;
      };

      const getPumaGenderText = (jk: string) => {
        if (jk === 'L') return 'Laki-laki (1 poin)';
        if (jk === 'P') return 'Perempuan (0 poin)';
        return '-';
      };

      const getPumaUsiaText = (usia: number) => {
        if (!usia) return '-';
        if (usia < 40) return `${usia} tahun (0 poin)`;
        if (usia >= 40 && usia <= 49) return `${usia} tahun (0 poin)`;
        if (usia >= 50 && usia <= 59) return `${usia} tahun (1 poin)`;
        if (usia >= 60) return `${usia} tahun (2 poin)`;
        return `${usia} tahun`;
      };

      const getPumaMerokokText = (val: any) => {
        if (val === 0) return 'Tidak (0 poin)';
        if (val === 1) return '< 20 bks/thn (0 poin)';
        if (val === 2) return '20 - 30 bks/thn (1 poin)';
        if (val === 3) return '> 30 bks/thn (2 poin)';
        return 'Belum diisi';
      };

      const getPumaYaTidakText = (val: any) => {
        if (val === 0) return 'Tidak (0 poin)';
        if (val === 1) return 'Ya (1 poin)';
        return 'Belum diisi';
      };

      const getLatestData = (checkFields: string[]) => {
        for (const r of riwayatList) {
          if (checkFields.some(field => r[field] !== undefined && r[field] !== null)) {
            return r;
          }
        }
        return patient;
      };

      const ls = getLatestData(['skilasKognitifOrientasi', 'skilasKognitifMengulang']);
      const lp = getLatestData(['pumaMerokok', 'pumaNapasPendek']);
      const la = getLatestData(['aksBAB', 'aksBAK']);
      const lt = getLatestData(['tbcBatuk', 'tbcDemam']);
      const lk = getLatestData(['kontrasepsi']);

      const lf = getLatestData(['lingkarPerut', 'lingkarLengan', 'mataKanan', 'mataKiri', 'telingaKanan', 'telingaKiri', 'ekg']);

      // --- FISIK KADER ---
      addSection(`HASIL PEMERIKSAAN FISIK LAINNYA (Tgl Periksa: ${formatDate(lf.tglKunjungan || patient.lastVisit) || '-'})`, [
        { q: 'Lingkar Perut', a: lf.lingkarPerut ? `${lf.lingkarPerut} cm` : '-' },
        { q: 'Lingkar Lengan Atas (LiLA)', a: lf.lingkarLengan ? `${lf.lingkarLengan} cm` : '-' },
        { q: 'Hasil Penglihatan (Mata Kanan / Kiri)', a: `${lf.mataKanan || 'Belum diisi'} / ${lf.mataKiri || 'Belum diisi'}` },
        { q: 'Hasil Pendengaran (Telinga Kanan / Kiri)', a: `${lf.telingaKanan || 'Belum diisi'} / ${lf.telingaKiri || 'Belum diisi'}` },
        { q: 'Pemeriksaan EKG', a: lf.ekg || '-' }
      ]);

      // --- SKILAS ---
      addSection(`HASIL SKRINING SKILAS: ${ls.skilas || '-'} (Tgl Periksa: ${formatDate(ls.tglKunjungan || patient.lastVisit) || '-'})`, [
        { q: '1. Kognitif: Apakah lansia dapat mengetahui waktu dan tempat saat ini?', a: yaTidak(ls.skilasKognitifOrientasi) },
        { q: '2. Kognitif: Apakah lansia dapat mengulang tiga kata yang disebutkan?', a: yaTidak(ls.skilasKognitifMengulang) },
        { q: '3. Mobilisasi: Apakah lansia dapat berdiri dari kursi tanpa bantuan?', a: yaTidak(ls.skilasMobilisasiBerdiri) },
        { q: '4. Nutrisi: Apakah BB lansia berkurang > 3 kg atau pakaian lebih longgar?', a: yaTidak(ls.skilasNutrisiBbturun) },
        { q: '5. Nutrisi: Apakah lansia mengalami hilangnya nafsu makan?', a: yaTidak(ls.skilasNutrisiNafsumakan) },
        { q: '6. Nutrisi: Apakah lingkar lengan atas (LiLA) < 21 cm?', a: yaTidak(ls.skilasNutrisiLila) },
        { q: '7. Mata: Apakah lansia mengalami masalah mata (sulit melihat, dll)?', a: yaTidak(ls.skilasMataMasalah) },
        { q: '8. Mata: Apakah hasil tes melihat (jari) menunjukkan gangguan?', a: yaTidak(ls.skilasMataTes) },
        { q: '9. Telinga: Apakah mengalami gangguan pendengaran (tes bisik)?', a: yaTidak(ls.skilasTelingaBisik) },
        { q: '10. Telinga: Apakah tes bisik tidak dapat dilakukan pada lansia?', a: yaTidak(ls.skilasTelingaTes) },
        { q: '11. Depresi: Apakah lansia merasa sedih, tertekan, putus asa?', a: yaTidak(ls.skilasDepresiSedih) },
        { q: '12. Depresi: Apakah lansia merasa sedikit/tidak berminat kegiatan?', a: yaTidak(ls.skilasDepresiMinat) },
        { q: '13. Imunisasi: Apakah sudah mendapatkan imunisasi COVID-19?', a: yaTidak(ls.skilasCovid) }
      ]);

      // --- PUMA ---
      addSection(`HASIL KUESIONER PUMA (Skor: ${lp.puma ?? '-'}) (Tgl Periksa: ${formatDate(lp.tglKunjungan || patient.lastVisit) || '-'})`, [
        { q: '1. Jenis Kelamin Lansia', a: getPumaGenderText(patient.jk) },
        { q: '2. Usia Lansia', a: getPumaUsiaText(patient.usia) },
        { q: '3. Merokok: Apakah lansia merokok / pernah merokok?', a: getPumaMerokokText(lp.pumaMerokok) },
        { q: '4. Napas: Pernah napas pendek saat berjalan cepat/menanjak?', a: getPumaYaTidakText(lp.pumaNapasPendek) },
        { q: '5. Dahak: Mempunyai dahak saat tidak flu?', a: getPumaYaTidakText(lp.pumaDahak) },
        { q: '6. Batuk: Biasanya batuk saat tidak flu?', a: getPumaYaTidakText(lp.pumaBatuk) },
        { q: '7. Spirometri: Pernah diminta cek spirometri oleh dokter?', a: getPumaYaTidakText(lp.pumaSpirometri) }
      ]);

      // --- AKS ---
      addSection(`KEMANDIRIAN LANSIA (AKS) (Skor: ${la.aks ?? '-'}) (Tgl Periksa: ${formatDate(la.tglKunjungan || patient.lastVisit) || '-'})`, [
        { q: '1. Mengendalikan Rangsang BAB', a: getAksText('aksBAB', la.aksBAB) },
        { q: '2. Mengendalikan Rangsang BAK', a: getAksText('aksBAK', la.aksBAK) },
        { q: '3. Membersihkan Diri (Cuci muka, sisir, sikat gigi)', a: getAksText('aksGrooming', la.aksGrooming) },
        { q: '4. Penggunaan WC (Masuk, keluar, siram, buka celana)', a: getAksText('aksToilet', la.aksToilet) },
        { q: '5. Makan dan Minum', a: getAksText('aksMakan', la.aksMakan) },
        { q: '6. Berpindah Tempat (Tidur ke duduk)', a: getAksText('aksTransfer', la.aksTransfer) },
        { q: '7. Mobilitas (Berjalan)', a: getAksText('aksMobilitas', la.aksMobilitas) },
        { q: '8. Berpakaian (Memakai baju, sepatu, dll)', a: getAksText('aksBerpakaian', la.aksBerpakaian) },
        { q: '9. Naik Turun Tangga', a: getAksText('aksTangga', la.aksTangga) },
        { q: '10. Mandi', a: getAksText('aksMandi', la.aksMandi) }
      ]);

      // --- TBC & Kontrasepsi ---
      addSection(`SKRINING TBC (Tgl Periksa: ${formatDate(lt.tglKunjungan || patient.lastVisit) || '-'})`, [
        { q: '1. Batuk terus-menerus?', a: yaTidak(lt.tbcBatuk) },
        { q: '2. Demam > 2 minggu?', a: yaTidak(lt.tbcDemam) },
        { q: '3. Berat badan turun / tidak naik tanpa penyebab?', a: yaTidak(lt.tbcBbTurun) },
        { q: '4. Pernah kontak erat dengan pasien TBC?', a: yaTidak(lt.tbcKontak) }
      ]);

      addSection(`KONTRASEPSI (Tgl Periksa: ${formatDate(lk.tglKunjungan || patient.lastVisit) || '-'})`, [
        { q: 'Menggunakan Alat Kontrasepsi?', a: yaTidak(lk.kontrasepsi) },
        { q: 'Jenis Kontrasepsi', a: lk.kontrasepsi ? lk.kontrasepsiJenis : '-' }
      ]);

      // --- Kolom Width ---
      ws.getColumn(1).width = 5;   // A
      ws.getColumn(2).width = 15;  // B
      ws.getColumn(3).width = 10;  // C
      ws.getColumn(4).width = 10;  // D
      ws.getColumn(5).width = 12;  // E
      ws.getColumn(6).width = 12;  // F
      ws.getColumn(7).width = 12;  // G
      ws.getColumn(8).width = 12;  // H
      ws.getColumn(9).width = 15;  // I
      ws.getColumn(10).width = 15; // J
      ws.getColumn(11).width = 20; // K
      
      const buffer = await wb.xlsx.writeBuffer();
      
      const kel = patient.kelurahan || 'Tanpa_Kelurahan';
      const rw = patient.rw ? `RW ${patient.rw}` : 'Tanpa_RW';
      // Clean filename and ensure uniqueness (using first 8 chars of DB ID to guarantee 100% no overwrite)
      const baseName = patient.nama.replace(/[\\/?*:[\]]/g, '').substring(0, 30).trim() || 'Tanpa_Nama';
      const uniqId = patient.id ? patient.id.substring(0, 8) : Math.random().toString(36).substring(2, 10);
      const safeName = `${baseName}_${uniqId}`;
      
      zip.folder(kel)?.folder(rw)?.file(`${safeName}.xlsx`, buffer);
    }

    const zipContent = await zip.generateAsync({ type: 'blob' });
    saveAs(zipContent, `Kartu_Bantu_Lengkap_${todayFormatted}.zip`);
  } catch (error: any) {
    console.error('Error generating Excel ZIP:', error);
    alert('Terjadi kesalahan saat mengekspor ZIP Excel. ' + error.message);
  }
};
