import { auth } from "./config/auth";
import { db } from "./db";
import { masterRegions, lansia, jadwal, berita } from "./db/schema";
import dotenv from "dotenv";

dotenv.config();

const initialUsers = [
  { id: 'U001', nama: 'Kader Lestari', username: 'lestari.kader', password: 'password123', role: 'Kader', kelurahan: 'Lawang', rw: '01' },
  { id: 'U002', nama: 'Bidan Siti', username: 'siti.bidan', password: 'password123', role: 'Bidan', kelurahan: 'Lawang' },
  { id: 'U003', nama: 'Admin Puskesmas', username: 'admin.utama', password: 'password123', role: 'Admin' },
  { id: 'U004', nama: 'KKN RAMAH LANSIA', username: 'kkn', password: 'tahap1kknterbaik', role: 'Admin', isPermanent: true },
];

import { initialLansiaData, initialJadwalData, initialBeritaData } from "../../src/constants/mockData";

async function seed() {
  console.log("Seeding Database...");

  for (const user of initialUsers) {
    try {
      // Create user via BetterAuth
      const email = `${user.username}@posyandu.local`;
      const res = await auth.api.signUpEmail({
        body: {
          email: email,
          password: user.password,
          name: user.nama,
          // Additional custom fields need to be handled. 
          // Better auth might not accept them in body by default unless configured or manually updated.
        }
      });
      
      // Update custom fields manually
      // @ts-ignore
      if (res?.user?.id) {
         // @ts-ignore
         await db.update(require("./db/schema").user).set({
           role: user.role,
           kelurahan: user.kelurahan || null,
           rw: user.rw || null,
           isPermanent: user.isPermanent || false,
           // @ts-ignore
         }).where(require("drizzle-orm").eq(require("./db/schema").user.id, res.user.id));
      }
      console.log(`Created user: ${user.username}`);
    } catch (err: any) {
      console.error(`Failed to create ${user.username}: ${err.message || 'unknown error'}`);
    }
  }

  for (const l of initialLansiaData) {
    try {
      await db.insert(lansia).values({
        nik: l.nik,
        nama: l.nama,
        jk: l.jk,
        usia: l.usia,
        tglLahir: new Date(l.tglLahir).toISOString().split('T')[0],
        alamat: l.alamat,
        kelurahan: l.kelurahan,
        rw: l.rw,
        rt: l.rt,
        status: l.status,
      }).onConflictDoNothing();
      console.log(`Created Lansia: ${l.nama}`);
    } catch (e: any) {
      console.log(`Failed to seed Lansia ${l.nama}: ${e.message}`);
    }
  }

  for (const j of initialJadwalData) {
     try {
       await db.insert(jadwal).values({
         desa: j.desa,
         rw: j.rw,
         tgl: new Date(j.tgl).toISOString().split('T')[0],
         waktu: j.waktu,
         tempat: j.tempat,
       }).onConflictDoNothing();
     } catch(e) {}
  }

  for (const b of initialBeritaData) {
     try {
       await db.insert(berita).values({
         title: b.title,
         excerpt: b.excerpt,
         content: b.content, 
         category: b.category,
         createdAt: new Date(b.date),
         image: b.image || undefined,
         authorId: 'U004', // Hardcode default author
       }).onConflictDoNothing();
     } catch(e) {}
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed();
