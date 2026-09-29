import { db } from "../db";
import { lansia } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

export const StatsService = {
  async getDashboardStats() {
    const [totalLansia] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` }).from(lansia).where(eq(lansia.isDeleted, false));
    
    // Status 'Hadir Hari Ini' could be derived from lastVisit = today.
    // For now, let's just count based on status.
    const [pantau] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` })
      .from(lansia).where(and(eq(lansia.status, 'Pantau'), eq(lansia.isDeleted, false)));
      
    const [rujuk] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` })
      .from(lansia).where(and(eq(lansia.status, 'Rujuk'), eq(lansia.isDeleted, false)));
      
    const [hadirHariIni] = await db.select({ count: sql<number>`cast(count(*) as unsigned)` })
      .from(lansia).where(and(sql`lastVisit = CURRENT_DATE`, eq(lansia.isDeleted, false)));

    return {
      totalLansia: totalLansia.count,
      hadirHariIni: hadirHariIni.count,
      pantau: pantau.count,
      rujuk: rujuk.count
    };
  }
};
