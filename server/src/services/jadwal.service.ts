import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { jadwal } from "../db/schema";
import crypto from "crypto";

export class JadwalService {
  static async getAllJadwal() {
    return await db.select().from(jadwal).orderBy(desc(jadwal.tgl));
  }

  static async createJadwal(data: any) {
    const id = data.id || crypto.randomUUID();
    const newData = { ...data, id };
    await db.insert(jadwal).values(newData);
    const [result] = await db.select().from(jadwal).where(eq(jadwal.id, id));
    return result;
  }

  static async updateJadwal(id: string, data: any) {
    await db.update(jadwal)
      .set(data)
      .where(eq(jadwal.id, id));
    const [result] = await db.select().from(jadwal).where(eq(jadwal.id, id));
    return result;
  }

  static async deleteJadwal(id: string) {
    const [j] = await db.select().from(jadwal).where(eq(jadwal.id, id));
    await db.delete(jadwal).where(eq(jadwal.id, id));
    return j;
  }
}
