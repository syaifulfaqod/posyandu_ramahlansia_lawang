import { eq, inArray, desc } from "drizzle-orm";
import { db } from "../db";
import { berita, user } from "../db/schema";
import crypto from "crypto";

export class BeritaService {
  static async getAllBerita() {
    const rawData = await db.select().from(berita).orderBy(desc(berita.createdAt));
    
    // Manual Fetch for authors
    const authorIds = [...new Set(rawData.map(b => b.authorId).filter(Boolean))] as string[];
    let authors: any[] = [];
    if (authorIds.length > 0) {
      authors = await db.select().from(user).where(inArray(user.id, authorIds));
    }
    const authorMap = Object.fromEntries(authors.map(a => [a.id, a]));
    
    // Map to frontend expected format
    return rawData.map(b => {
       const d = new Date(b.createdAt);
       const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
       const formattedDate = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
       
       const authorName = b.authorId && authorMap[b.authorId] ? authorMap[b.authorId].name : 'Admin';
       
       return {
          ...b,
          date: formattedDate,
          author: authorName
       };
    });
  }

  static async createBerita(data: any) {
    const id = data.id || crypto.randomUUID();
    const newData = { ...data, id };
    await db.insert(berita).values(newData);
    const [b] = await db.select().from(berita).where(eq(berita.id, id));
    const d = new Date(b.createdAt);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    return { ...b, date: `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}` };
  }

  static async updateBerita(id: string, data: any) {
    await db.update(berita)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(berita.id, id));
    const [b] = await db.select().from(berita).where(eq(berita.id, id));
    const d = new Date(b.createdAt);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
    return { ...b, date: `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}` };
  }

  static async deleteBerita(id: string) {
    const [b] = await db.select().from(berita).where(eq(berita.id, id));
    await db.delete(berita).where(eq(berita.id, id));
    return b;
  }
}
