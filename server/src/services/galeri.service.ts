import { db } from "../db";
import { galeri } from "../db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const GaleriService = {
  async getAll() {
    return await db.select().from(galeri);
  },

  async create(data: { title: string; description?: string; imageUrl: string; authorId: string }) {
    const id = crypto.randomUUID();
    const newData = { ...data, id };
    await db.insert(galeri).values(newData);
    const [result] = await db.select().from(galeri).where(eq(galeri.id, id));
    return result;
  },

  async delete(id: string) {
    const [item] = await db.select().from(galeri).where(eq(galeri.id, id));
    await db.delete(galeri).where(eq(galeri.id, id));
    return item;
  }
};
