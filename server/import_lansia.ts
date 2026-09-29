import * as XLSX from 'xlsx';
import { db } from './src/db';
import { lansia } from './src/db/schema';
import crypto from 'crypto';

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

async function run() {
  console.log("Membaca file Excel...");
  // Using cellDates to automatically parse dates
  const workbook = XLSX.readFile('DATA LANSIA KEL. LAWANG 0926.xlsx', { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // Skip header row
  const rows = rawData.slice(1);
  const toInsert: any[] = [];
  
  let successCount = 0;
  let skipCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || !row[0]) {
      continue;
    }
    
    // NIK, NAMA, TGL LHR, JK, ALAMAT, Kelurahan, RT, RW
    let [nik, nama, tglLhr, jk, alamat, kelurahan, rt, rw] = row;
    
    if (!nik || !nama) continue;
    
    nik = String(nik).trim();
    nama = String(nama).trim();
    
    // Parse Date
    let birthDate = new Date();
    if (tglLhr instanceof Date) {
      birthDate = tglLhr;
    } else if (typeof tglLhr === 'string') {
      birthDate = new Date(tglLhr);
    } else if (typeof tglLhr === 'number') {
      // Fallback if cellDates didn't work for some reason
      birthDate = new Date(Math.round((tglLhr - 25569) * 86400 * 1000));
    }
    
    const usia = calculateAge(birthDate);
    const tglLahirStr = birthDate.toISOString().split('T')[0];
    
    // JK Mapping
    jk = String(jk).trim().toUpperCase();
    let jkFull = 'Perempuan'; // default
    if (jk === 'L' || jk === 'LAKI-LAKI') jkFull = 'Laki-laki';
    else if (jk === 'P' || jk === 'PEREMPUAN') jkFull = 'Perempuan';
    
    // RT / RW formatting (Strict parse int then pad 2)
    let rwNum = parseInt(String(rw).trim(), 10);
    let rtNum = parseInt(String(rt).trim(), 10);
    let rwStr = !isNaN(rwNum) ? String(rwNum).padStart(2, '0') : '01';
    let rtStr = !isNaN(rtNum) ? String(rtNum).padStart(2, '0') : '01';
    
    // Optional defaults
    alamat = alamat ? String(alamat).trim() : '';
    kelurahan = kelurahan ? String(kelurahan).trim() : 'Lawang';
    
    toInsert.push({
      id: crypto.randomUUID(),
      nik: nik,
      nama: nama,
      jk: jkFull,
      usia: isNaN(usia) ? 0 : usia,
      tglLahir: tglLahirStr,
      alamat: alamat,
      kelurahan: kelurahan,
      rw: rwStr,
      rt: rtStr,
      status: 'Aktif',
      lastVisit: 'Belum pernah',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  console.log(`Menyiapkan ${toInsert.length} data untuk di-insert...`);

  // Insert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < toInsert.length; i += batchSize) {
    const batch = toInsert.slice(i, i + batchSize);
    try {
      await db.insert(lansia).values(batch);
      successCount += batch.length;
      console.log(`Berhasil insert data ke ${i + batch.length} dari ${toInsert.length}`);
    } catch (err: any) {
      console.error(`Gagal insert batch pada index ${i}:`, err.message);
      skipCount += batch.length;
    }
  }

  console.log('===============================');
  console.log(`Selesai! Berhasil: ${successCount}, Gagal: ${skipCount}`);
  process.exit(0);
}

run();
