import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function run() {
  console.log("Menghapus seluruh data lansia dan pemeriksaan...");
  try {
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0;`);
    await db.execute(sql`TRUNCATE TABLE pemeriksaan;`);
    await db.execute(sql`TRUNCATE TABLE lansia;`);
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1;`);
    console.log("Selesai. Data lansia dan pemeriksaan telah dikosongkan.");
  } catch(e) { 
    console.error(e.message); 
  }
  process.exit(0);
}

run();
