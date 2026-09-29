import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function run() {
  console.log("Memperbarui format RT dan RW...");
  try {
    // LPAD(string, length, pad_string)
    // Update RT
    await db.execute(sql`
      UPDATE lansia 
      SET rt = LPAD(TRIM(rt), 2, '0') 
      WHERE LENGTH(TRIM(rt)) = 1 AND TRIM(rt) REGEXP '^[0-9]$'
    `);
    
    // Update RW
    await db.execute(sql`
      UPDATE lansia 
      SET rw = LPAD(TRIM(rw), 2, '0') 
      WHERE LENGTH(TRIM(rw)) = 1 AND TRIM(rw) REGEXP '^[0-9]$'
    `);

    // Hapus nol berlebih jika ada yang salah masuk jadi 003 dsb, tapi ini opsional
    
    console.log("Selesai. Seluruh data RT dan RW di tabel lansia telah diformat menjadi 2 digit (01-09).");
  } catch(e: any) {
    console.error(e.message);
  }
  process.exit(0);
}

run();
