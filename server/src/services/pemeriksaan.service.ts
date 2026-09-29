import { eq } from "drizzle-orm";
import { db } from "../db";
import { pemeriksaan, lansia } from "../db/schema";
import crypto from "crypto";

export class PemeriksaanService {
  static async addPemeriksaan(data: any) {
    const sanitizedData = { ...data };
    const numericFields = ['bb', 'tb', 'lingkarPerut', 'lingkarLengan', 'tdSistole', 'tdDiastole', 'aks', 'puma', 'gulaDarah', 'kolesterol', 'asamUrat', 'trigliserida', 'hdl'];
    numericFields.forEach(field => {
      if (sanitizedData[field] === "") {
        sanitizedData[field] = null;
      } else if (sanitizedData[field] !== null && sanitizedData[field] !== undefined) {
        sanitizedData[field] = Number(sanitizedData[field]);
      }
    });

    const id = sanitizedData.id || crypto.randomUUID();
    const newData = { ...sanitizedData, id };
    await db.insert(pemeriksaan).values(newData);
    const [p] = await db.select().from(pemeriksaan).where(eq(pemeriksaan.id, id));
    
    // Auto-update lansia's lastVisit when a new pemeriksaan is added
    if (p?.tglKunjungan && p?.lansiaId) {
       await db.update(lansia)
         .set({ lastVisit: p.tglKunjungan })
         .where(eq(lansia.id, p.lansiaId));
    }

    return p;
  }

  static async updatePemeriksaan(id: string, data: any) {
    const sanitizedData = { ...data };
    const numericFields = ['bb', 'tb', 'lingkarPerut', 'lingkarLengan', 'tdSistole', 'tdDiastole', 'aks', 'puma', 'gulaDarah', 'kolesterol', 'asamUrat', 'trigliserida', 'hdl'];
    numericFields.forEach(field => {
      if (sanitizedData[field] === "") {
        sanitizedData[field] = null;
      } else if (sanitizedData[field] !== null && sanitizedData[field] !== undefined) {
        sanitizedData[field] = Number(sanitizedData[field]);
      }
    });

    await db.update(pemeriksaan)
      .set(sanitizedData)
      .where(eq(pemeriksaan.id, id));
    const [result] = await db.select().from(pemeriksaan).where(eq(pemeriksaan.id, id));
    return result;
  }
}
