import { db } from './src/db';
import { lansia } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function run() {
  console.log("Mengambil semua data lansia...");
  try {
    const allLansia = await db.select().from(lansia);
    let count = 0;
    
    for (const l of allLansia) {
      let changed = false;
      let newRt = l.rt;
      let newRw = l.rw;
      
      if (newRt && newRt.trim() !== '') {
        const rtNum = parseInt(newRt, 10);
        if (!isNaN(rtNum)) {
          const formattedRt = String(rtNum).padStart(2, '0');
          if (formattedRt !== l.rt) {
            newRt = formattedRt;
            changed = true;
          }
        }
      }
      
      if (newRw && newRw.trim() !== '') {
        const rwNum = parseInt(newRw, 10);
        if (!isNaN(rwNum)) {
          const formattedRw = String(rwNum).padStart(2, '0');
          if (formattedRw !== l.rw) {
            newRw = formattedRw;
            changed = true;
          }
        }
      }
      
      if (changed) {
        await db.update(lansia)
          .set({ rt: newRt, rw: newRw })
          .where(eq(lansia.id, l.id));
        count++;
      }
    }
    
    console.log(`Selesai! Berhasil memperbarui format RT/RW pada ${count} data.`);
  } catch(e: any) {
    console.error(e.message);
  }
  process.exit(0);
}

run();
