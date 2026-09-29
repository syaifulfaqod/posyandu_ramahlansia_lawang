import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
  });
};

export const generateSuratRujukan = async (patient: any, currentUser: any) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  
  const kelurahanName = currentUser.kelurahan || patient.kelurahan || '-';

  // Load Logos
  try {
    const imgLeft = await loadImage(window.location.origin + '/LOGO%20KECAMTAN%20LAWANG.png');
    doc.addImage(imgLeft, 'PNG', 20, 10, 22, 26);
  } catch(e) { console.warn("Failed to load left logo"); }

  try {
    const imgRight = await loadImage(window.location.origin + '/LOGO%20KKN%20RAMAH%20LANSIA%20TAHAP%201.png');
    doc.addImage(imgRight, 'PNG', 168, 12, 22, 22);
  } catch(e) { console.warn("Failed to load right logo"); }

  // Kop Surat (Formal Header)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PEMERINTAH KABUPATEN MALANG', 105, 16, { align: 'center' });
  doc.text('KECAMATAN LAWANG', 105, 22, { align: 'center' });
  doc.text(`DESA/KELURAHAN ${kelurahanName.toUpperCase()}`, 105, 28, { align: 'center' });
  doc.text('POSYANDU LANSIA', 105, 34, { align: 'center' });
  
  doc.setLineWidth(1);
  doc.line(20, 40, 190, 40);
  doc.setLineWidth(0.3);
  doc.line(20, 41.5, 190, 41.5);

  // Title
  doc.setFontSize(12);
  doc.text('SURAT RUJUKAN PEMERIKSAAN LANJUTAN', 105, 50, { align: 'center' });
  doc.setLineWidth(0.3);
  doc.line(60, 51, 150, 51);

  // Content
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Kepada Yth.', 20, 62);
  doc.text('Dokter / Petugas Puskesmas', 20, 68);
  doc.text('Di Tempat', 20, 74);

  doc.text('Dengan hormat,', 20, 86);
  doc.text('Melalui surat ini, kami memohon bantuan pemeriksaan dan penanganan medis lebih lanjut', 20, 92);
  doc.text('untuk warga lansia berikut:', 20, 98);

  // Patient Info
  const startY = 106;
  const labelX = 25;
  const colonX = 65;
  const valueX = 70;
  const lineSpacing = 7;

  doc.text('Nama', labelX, startY); doc.text(':', colonX, startY); doc.text(patient.nama || '-', valueX, startY);
  doc.text('NIK', labelX, startY + lineSpacing); doc.text(':', colonX, startY + lineSpacing); doc.text(patient.nik || '-', valueX, startY + lineSpacing);
  doc.text('Usia', labelX, startY + lineSpacing * 2); doc.text(':', colonX, startY + lineSpacing * 2); doc.text(`${patient.usia || '-'} Tahun`, valueX, startY + lineSpacing * 2);
  doc.text('Jenis Kelamin', labelX, startY + lineSpacing * 3); doc.text(':', colonX, startY + lineSpacing * 3); doc.text(patient.jk === 'L' ? 'Laki-laki' : 'Perempuan', valueX, startY + lineSpacing * 3);
  doc.text('Alamat', labelX, startY + lineSpacing * 4); doc.text(':', colonX, startY + lineSpacing * 4); doc.text(patient.alamat || '-', valueX, startY + lineSpacing * 4);
  doc.text('Desa/Kelurahan', labelX, startY + lineSpacing * 5); doc.text(':', colonX, startY + lineSpacing * 5); doc.text(kelurahanName, valueX, startY + lineSpacing * 5);
  doc.text('RT/RW', labelX, startY + lineSpacing * 6); doc.text(':', colonX, startY + lineSpacing * 6); doc.text(`${patient.rt || '-'}/${patient.rw || '-'}`, valueX, startY + lineSpacing * 6);

  const indicationY = startY + lineSpacing * 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Indikasi Rujukan:', 20, indicationY);
  doc.setFont('helvetica', 'normal');
  doc.text('Berdasarkan hasil skrining terakhir, lansia ini memerlukan tindakan/rujukan', 20, indicationY + 6);
  doc.text('karena ditemukan indikasi yang membutuhkan pemantauan profesional. Berikut rinciannya:', 20, indicationY + 12);
  
  // Create a table for the patient's latest examination results
  const latestHistory = patient.riwayat && patient.riwayat.length > 0 
    ? patient.riwayat[0] 
    : {
        tglKunjungan: patient.lastVisit,
        skilas: patient.skilas,
        aks: patient.aks,
        puma: patient.puma,
        status: patient.status
      };

  const tableData = [
    ['Tanggal Skrining Terakhir', latestHistory.tglKunjungan || '-'],
    ['Status Skrining', latestHistory.status || '-'],
    ['Hasil SKILAS', latestHistory.skilas || '-'],
    ['Hasil AKS (Aktivitas Keseharian)', latestHistory.aks !== undefined ? latestHistory.aks.toString() : '-'],
    ['Hasil PUMA (Risiko Paru)', latestHistory.puma !== undefined ? latestHistory.puma.toString() : '-'],
  ];

  autoTable(doc, {
    startY: indicationY + 16,
    head: [['Parameter', 'Hasil / Keterangan']],
    body: tableData,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [5, 150, 105], textColor: 255, fontStyle: 'bold' },
    margin: { left: 20, right: 20 }
  });

  const tableFinalY = (doc as any).lastAutoTable.finalY + 10;
  
  // Catatan Bidan
  doc.setFont('helvetica', 'bold');
  doc.text('Catatan Bidan / Kader:', 20, tableFinalY);
  doc.setFont('helvetica', 'normal');
  doc.setLineWidth(0.3);
  doc.rect(20, tableFinalY + 3, 170, 30);
  
  // Lines inside the notes box
  doc.setDrawColor(200, 200, 200);
  doc.line(22, tableFinalY + 13, 188, tableFinalY + 13);
  doc.line(22, tableFinalY + 23, 188, tableFinalY + 23);
  doc.setDrawColor(0, 0, 0);

  const finalY = tableFinalY + 45;
  doc.text('Demikian surat rujukan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.', 20, finalY);
  doc.text('Atas perhatian dan kerja samanya, kami ucapkan terima kasih.', 20, finalY + 6);

  // Signature Block
  const signatureY = finalY + 20;
  const signatureX = 140; // Align right
  
  doc.text(`Lawang, ${formattedDate}`, signatureX, signatureY, { align: 'center' });
  doc.text(`Bidan Desa/Kelurahan ${kelurahanName}`, signatureX, signatureY + 6, { align: 'center' });
  
  // Blank space for signature
  doc.text(`( ${currentUser.nama || '__________________'} )`, signatureX, signatureY + 30, { align: 'center' });

  // Save the PDF
  const filename = `Surat_Rujukan_${patient.nama.replace(/\s+/g, '_')}_${patient.nik}.pdf`;
  doc.save(filename);
};
