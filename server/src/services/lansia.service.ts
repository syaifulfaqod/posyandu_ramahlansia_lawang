import { eq, and, inArray } from "drizzle-orm";
import { db } from "../db";
import { lansia, pemeriksaan, masterRegions } from "../db/schema";
import crypto from "crypto";

const calculateAge = (dob: Date | string | null) => {
  if (!dob) return null;
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};

export class LansiaService {
  static async getAllLansia(kelurahan?: string, rw?: string) {
    let conditions: any = eq(lansia.isDeleted, false);
    
    if (kelurahan && kelurahan !== 'Semua' && kelurahan !== '') {
      conditions = and(conditions, eq(lansia.kelurahan, kelurahan))!;
    }
    if (rw && rw !== 'Semua' && rw !== '') {
      conditions = and(conditions, eq(lansia.rw, rw))!;
    }

    const results = await db.select().from(lansia).where(conditions);
    
    // Manual Fetch for riwayat to bypass MariaDB json_arrayagg issues
    const lansiaIds = results.map(r => r.id);
    let allRiwayats: any[] = [];
    if (lansiaIds.length > 0) {
      allRiwayats = await db.select().from(pemeriksaan).where(inArray(pemeriksaan.lansiaId, lansiaIds));
    }
    
    return results.map(r => {
      const riwayat = allRiwayats
        .filter((p: any) => p.lansiaId === r.id)
        .sort((a: any, b: any) => new Date(b.tglKunjungan).getTime() - new Date(a.tglKunjungan).getTime());
      
      const computedUsia = calculateAge(r.tglLahir) ?? r.usia;
      return { ...r, usia: computedUsia, riwayat };
    });
  }

  static async getLansiaById(id: string) {
    const [result] = await db.select().from(lansia).where(and(eq(lansia.id, id), eq(lansia.isDeleted, false)));
    if (result) {
      const riwayats = await db.select().from(pemeriksaan).where(eq(pemeriksaan.lansiaId, id));
      riwayats.sort((a: any, b: any) => new Date(b.tglKunjungan).getTime() - new Date(a.tglKunjungan).getTime());
      (result as any).riwayat = riwayats;
      (result as any).usia = calculateAge(result.tglLahir) ?? result.usia;
    }
    return result || null;
  }

  static async createLansia(data: any) {
    const id = data.id || crypto.randomUUID();
    const newData = { ...data, id };
    await db.insert(lansia).values(newData);
    return newData;
  }

  static async bulkCreateLansia(dataList: any[]) {
    if (dataList.length === 0) return [];
    
    // Process and insert lansia
    const insertData = dataList.map(data => {
      const id = data.id || crypto.randomUUID();
      return { ...data, id };
    });
    
    await db.insert(lansia).values(insertData);

    // Sync masterRegions
    const grouped: any = {};
    insertData.forEach(l => {
      if (!l.kelurahan) return;
      if (!grouped[l.kelurahan]) grouped[l.kelurahan] = {};
      if (l.rw && !grouped[l.kelurahan][l.rw]) grouped[l.kelurahan][l.rw] = new Set();
      if (l.rt && l.rw) grouped[l.kelurahan][l.rw].add(l.rt);
    });

    for (const kel in grouped) {
      for (const rw in grouped[kel]) {
        for (const rt of grouped[kel][rw]) {
          await db.insert(masterRegions).ignore().values({
            id: crypto.randomUUID(),
            kelurahan: kel,
            rw,
            rt
          });
        }
      }
    }

    return insertData;
  }

  static async updateLansia(id: string, data: any) {
    await db.update(lansia)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(lansia.id, id));
    return await this.getLansiaById(id);
  }

  static async softDeleteLansia(id: string) {
    await db.update(lansia)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(lansia.id, id));
    return { id, isDeleted: true };
  }
}
