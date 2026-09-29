import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export const exportUsersExcelZip = async (users: any[], todayFormatted: string) => {
  try {
    const zip = new JSZip();

    // Group users by Kelurahan -> RW
    const grouped: Record<string, Record<string, any[]>> = {};
    const globalUsers: any[] = [];

    users.forEach(user => {
      if (user.role === 'Admin') {
        globalUsers.push(user);
      } else {
        const kel = user.kelurahan || 'Tanpa_Kelurahan';
        const rw = user.role === 'Bidan' ? 'Bidan_Desa' : (user.rw ? `RW ${user.rw}` : 'Tanpa_RW');
        
        if (!grouped[kel]) grouped[kel] = {};
        if (!grouped[kel][rw]) grouped[kel][rw] = [];
        
        grouped[kel][rw].push(user);
      }
    });

    const createExcelBuffer = async (userList: any[], title: string) => {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('Data Akun');

      ws.mergeCells('A1:G1');
      ws.getCell('A1').value = title;
      ws.getCell('A1').font = { bold: true, size: 14 };
      ws.getCell('A1').alignment = { horizontal: 'center' };

      ws.addRow([]);

      const headerRow = ws.addRow(['No', 'Nama Lengkap', 'Username', 'Password', 'Role', 'Kelurahan', 'RW Tugas']);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF059669' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });

      userList.forEach((u, idx) => {
        const row = ws.addRow([
          idx + 1,
          u.nama,
          u.username,
          u.password || '-',
          u.role === 'Admin' ? 'Admin Sistem' : u.role === 'Bidan' ? 'Bidan' : 'Kader Posyandu',
          u.kelurahan || '-',
          u.rw || '-'
        ]);
        row.eachCell((cell) => {
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
      });

      ws.getColumn(1).width = 5;
      ws.getColumn(2).width = 25;
      ws.getColumn(3).width = 20;
      ws.getColumn(4).width = 20;
      ws.getColumn(5).width = 20;
      ws.getColumn(6).width = 20;
      ws.getColumn(7).width = 15;

      return await wb.xlsx.writeBuffer();
    };

    // 1. Export Global Users (Admin & Bidan)
    if (globalUsers.length > 0) {
      const buffer = await createExcelBuffer(globalUsers, 'DAFTAR AKUN AKSES GLOBAL (BIDAN & ADMIN)');
      zip.folder('Akses_Global')?.file('Akun_Global.xlsx', buffer);
    }

    // 2. Export Kader/Bidan grouped by Kelurahan and RW
    for (const kel of Object.keys(grouped)) {
      for (const rw of Object.keys(grouped[kel])) {
        const isBidan = rw === 'Bidan_Desa';
        const title = isBidan 
            ? `DAFTAR AKUN BIDAN - ${kel.toUpperCase()}`
            : `DAFTAR AKUN KADER - ${kel.toUpperCase()} (${rw.toUpperCase()})`;
        const buffer = await createExcelBuffer(grouped[kel][rw], title);
        const fileName = isBidan ? `Akun_Bidan.xlsx` : `Akun_Kader_${rw.replace(' ', '')}.xlsx`;
        zip.folder(kel)?.folder(isBidan ? 'Bidan' : rw)?.file(fileName, buffer);
      }
    }

    const zipContent = await zip.generateAsync({ type: 'blob' });
    saveAs(zipContent, `Data_Akun_Posyandu_${todayFormatted}.zip`);
  } catch (error: any) {
    console.error('Error generating User Excel ZIP:', error);
    alert('Terjadi kesalahan saat mengekspor ZIP Excel Akun. ' + error.message);
  }
};
