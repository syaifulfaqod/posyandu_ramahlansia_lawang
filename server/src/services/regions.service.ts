import { db } from "../db";
import { masterRegions } from "../db/schema";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export const RegionsService = {
  async getAllGrouped() {
    const regions = await db.select().from(masterRegions);
    
    // Group into object format: { Kelurahan: { RW: [RT, RT] } }
    const grouped: Record<string, Record<string, string[]>> = {};
    
    regions.forEach((r) => {
      if (!grouped[r.kelurahan]) {
        grouped[r.kelurahan] = {};
      }
      if (r.rw && r.rw !== "") {
        if (!grouped[r.kelurahan][r.rw]) {
          grouped[r.kelurahan][r.rw] = [];
        }
        if (r.rt && r.rt !== "" && !grouped[r.kelurahan][r.rw].includes(r.rt)) {
          grouped[r.kelurahan][r.rw].push(r.rt);
        }
      }
    });

    return grouped;
  },

  async getAllRaw() {
    return await db.select().from(masterRegions);
  },

  async createRegion(data: { kelurahan: string; rw: string; rt: string }) {
    const id = crypto.randomUUID();
    await db.insert(masterRegions).values({
      id,
      kelurahan: data.kelurahan,
      rw: data.rw || "",
      rt: data.rt || ""
    });
    const [result] = await db.select().from(masterRegions).where(eq(masterRegions.id, id));
    return result;
  },

  async deleteKelurahan(kelurahan: string) {
    const items = await db.select().from(masterRegions).where(eq(masterRegions.kelurahan, kelurahan));
    await db.delete(masterRegions).where(eq(masterRegions.kelurahan, kelurahan));
    return items;
  },

  async deleteRW(kelurahan: string, rw: string) {
    const items = await db.select().from(masterRegions).where(and(eq(masterRegions.kelurahan, kelurahan), eq(masterRegions.rw, rw)));
    await db.delete(masterRegions).where(and(eq(masterRegions.kelurahan, kelurahan), eq(masterRegions.rw, rw)));
    return items;
  },

  async deleteRT(kelurahan: string, rw: string, rt: string) {
    const items = await db.select().from(masterRegions).where(and(
        eq(masterRegions.kelurahan, kelurahan), 
        eq(masterRegions.rw, rw), 
        eq(masterRegions.rt, rt)
      ));
    await db.delete(masterRegions)
      .where(and(
        eq(masterRegions.kelurahan, kelurahan), 
        eq(masterRegions.rw, rw), 
        eq(masterRegions.rt, rt)
      ));
    return items;
  }
};
