import { PDFDocument, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const exportToPdfLib = async (filteredData: any[], todayFormatted: string) => {
  try {
    const response = await fetch('/templates/kartu_bantu_template.pdf');
    if (!response.ok) {
        throw new Error('Template PDF tidak ditemukan di /templates/kartu_bantu_template.pdf');
    }
    const templateBytes = await response.arrayBuffer();

    const zip = new JSZip();

    for (const patient of filteredData) {
      const pdfDoc = await PDFDocument.load(templateBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      
      const fontSize = 16;
      const color = rgb(0, 0, 0);
      
      // Coordinates are guessed based on standard layout (origin is bottom-left)
      // Since height is ~1035, top is 1035
      // Title is probably at y=950
      // Identity data probably at y=850 down to y=700
      // Table probably from y=600 down to y=100
      
      const drawText = (text: string, x: number, y: number, size = fontSize) => {
        if(text) {
          firstPage.drawText(String(text), { x, y, size, color });
        }
      };

      // Posyandu Name
      drawText(patient.kelurahan || 'Lawang', 300, 935, 20); // Example Posyandu Name
      
      // Identity
      drawText(patient.nama, 250, 855);
      drawText(patient.jk, 500, 855);
      drawText(patient.nik, 250, 825);
      drawText(patient.tglLahir, 250, 795);
      drawText(patient.usia?.toString(), 450, 795);
      drawText(patient.alamat, 250, 765);
      drawText(patient.rt ? `${patient.rt} / ${patient.rw}` : '', 250, 675);
      drawText(patient.kelurahan, 250, 645);
      
      // Main Table (Riwayat)
      // We assume table rows start around y=500 and go down by 25 points each
      let startY = 490;
      let rowHeight = 22.5;

      const riwayatList = patient.riwayat && patient.riwayat.length > 0 ? patient.riwayat : [];
      if(riwayatList.length === 0 && patient.lastVisit && patient.lastVisit !== 'Belum pernah') {
          riwayatList.push({ 
            tglKunjungan: patient.lastVisit, bb: patient.bb, tb: patient.tb, 
            tdSistole: patient.tdSistole, tdDiastole: patient.tdDiastole, status: patient.status 
          });
      }

      for (let i = 0; i < Math.min(riwayatList.length, 19); i++) {
        const r = riwayatList[i];
        const y = startY - (i * rowHeight);
        
        drawText(r.tglKunjungan, 70, y, 12);
        drawText(r.bb, 200, y, 12);
        drawText(r.tb, 250, y, 12);
        
        const bbNum = parseFloat(r.bb);
        const tbNum = parseFloat(r.tb) / 100;
        const imt = (!isNaN(bbNum) && !isNaN(tbNum) && tbNum > 0) ? (bbNum / (tbNum * tbNum)).toFixed(1) : '';
        drawText(imt, 300, y, 12);
        
        const tensi = r.tdSistole && r.tdDiastole ? `${r.tdSistole}/${r.tdDiastole}` : '';
        drawText(tensi, 480, y, 12);
        drawText(r.gulaDarah, 580, y, 12);
        drawText(r.kolesterol, 720, y, 12);
        drawText(r.trigliserida, 780, y, 12);
        drawText(r.hdl, 840, y, 12);
        drawText(r.asamUrat, 920, y, 12);
      }

      // Page 2: Skrining (PUMA, SKILAS, AKS)
      if (pages.length > 1) {
        const secondPage = pages[1];
        // Draw total scores or statuses on page 2
        // Assuming PUMA is at top, SKILAS at middle, AKS at bottom
        
        const drawPage2 = (text: string, x: number, y: number, size = 16) => {
          if(text) {
             secondPage.drawText(String(text), { x, y, size, color });
          }
        };

        // PUMA Score
        drawPage2(patient.puma !== undefined ? patient.puma.toString() : '', 700, 700);
        // SKILAS
        drawPage2(patient.skilas || '', 700, 400);
        // AKS Score
        drawPage2(patient.aks !== undefined ? patient.aks.toString() : '', 700, 100);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      zip.file(`Kartu_Bantu_${patient.nama.replace(/[^a-z0-9]/gi, '_')}.pdf`, blob);
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, `Export_Kartu_Bantu_Lansia_${todayFormatted}.zip`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Terjadi kesalahan saat mengekspor PDF format baru. ' + error.message);
  }
};
