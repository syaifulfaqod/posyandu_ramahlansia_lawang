import { mysqlTable, text, longtext, datetime, boolean, varchar, date, time, int, decimal } from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

// --- BETTER AUTH SCHEMA ---
export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(), // Better Auth requires email, we map username to email for BA
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: datetime("createdAt", { mode: "date" }).notNull(),
  updatedAt: datetime("updatedAt", { mode: "date" }).notNull(),
  
  // Custom Fields for Posyandu
  role: varchar("role", { length: 50 }).default('Kader').notNull(), // Admin, Ketua Kader, Bidan, Kader
  kelurahan: varchar("kelurahan", { length: 100 }),
  rw: varchar("rw", { length: 10 }),
  isPermanent: boolean("isPermanent").default(false),
  failedLoginAttempts: int("failedLoginAttempts").default(0).notNull(),
  isLocked: boolean("isLocked").default(false).notNull(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  expiresAt: datetime("expiresAt", { mode: "date" }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: datetime("createdAt", { mode: "date" }).notNull(),
  updatedAt: datetime("updatedAt", { mode: "date" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: varchar("userId", { length: 255 }).notNull().references(() => user.id)
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  providerId: varchar("providerId", { length: 255 }).notNull(),
  userId: varchar("userId", { length: 255 }).notNull().references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: datetime("accessTokenExpiresAt", { mode: "date" }),
  refreshTokenExpiresAt: datetime("refreshTokenExpiresAt", { mode: "date" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: datetime("createdAt", { mode: "date" }).notNull(),
  updatedAt: datetime("updatedAt", { mode: "date" }).notNull()
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: datetime("expiresAt", { mode: "date" }).notNull(),
  createdAt: datetime("createdAt", { mode: "date" }),
  updatedAt: datetime("updatedAt", { mode: "date" })
});

// --- CUSTOM APP SCHEMA ---

export const masterRegions = mysqlTable("master_regions", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  kelurahan: varchar("kelurahan", { length: 100 }).notNull(),
  rw: varchar("rw", { length: 10 }).notNull(),
  rt: varchar("rt", { length: 10 }).notNull(),
});

export const lansia = mysqlTable("lansia", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  nik: varchar("nik", { length: 16 }).notNull(),
  nama: varchar("nama", { length: 255 }).notNull(),
  jk: varchar("jk", { length: 1 }).notNull(), // 'L' or 'P'
  usia: int("usia"),
  tglLahir: date("tglLahir").notNull(),
  alamat: text("alamat"),
  kelurahan: varchar("kelurahan", { length: 100 }).notNull(),
  rw: varchar("rw", { length: 10 }).notNull(),
  rt: varchar("rt", { length: 10 }).notNull(),
  lastVisit: date("lastVisit"),
  status: varchar("status", { length: 50 }).notNull().default('Terdaftar'), // Normal, Pantau, Rujuk, Terdaftar, Meninggal
  skilas: varchar("skilas", { length: 50 }),
  aks: int("aks"),
  puma: int("puma"),
  golDarah: varchar("golDarah", { length: 3 }),
  statusKawin: varchar("statusKawin", { length: 50 }),
  pekerjaan: varchar("pekerjaan", { length: 100 }),
  keteranganMeninggal: text("keteranganMeninggal"),
  isDeleted: boolean("isDeleted").default(false).notNull(), // Soft Delete
  createdAt: datetime("createdAt", { mode: "date" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updatedAt", { mode: "date" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const pemeriksaan = mysqlTable("pemeriksaan", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  lansiaId: varchar("lansiaId", { length: 36 }).references(() => lansia.id).notNull(),
  tglKunjungan: date("tglKunjungan").notNull(),
  bb: decimal("bb", { precision: 5, scale: 2 }),
  tb: decimal("tb", { precision: 5, scale: 2 }),
  lingkarPerut: decimal("lingkarPerut", { precision: 5, scale: 2 }),
  lingkarLengan: decimal("lingkarLengan", { precision: 5, scale: 2 }),
  tdSistole: int("tdSistole"),
  tdDiastole: int("tdDiastole"),
  skilas: varchar("skilas", { length: 50 }),
  aks: int("aks"),
  puma: int("puma"),
  status: varchar("status", { length: 50 }),
  catatan: text("catatan"),
  gulaDarah: int("gulaDarah"),
  kolesterol: int("kolesterol"),
  asamUrat: decimal("asamUrat", { precision: 5, scale: 2 }),
  trigliserida: int("trigliserida"),
  hdl: int("hdl"),
  ekg: text("ekg"),
  mataKanan: varchar("mataKanan", { length: 50 }),
  mataKiri: varchar("mataKiri", { length: 50 }),
  telingaKanan: varchar("telingaKanan", { length: 50 }),
  telingaKiri: varchar("telingaKiri", { length: 50 }),

  // SKILAS Fields
  skilasKognitifOrientasi: boolean("skilasKognitifOrientasi"),
  skilasKognitifMengulang: boolean("skilasKognitifMengulang"),
  skilasMobilisasiBerdiri: boolean("skilasMobilisasiBerdiri"),
  skilasNutrisiBbturun: boolean("skilasNutrisiBbturun"),
  skilasNutrisiNafsumakan: boolean("skilasNutrisiNafsumakan"),
  skilasNutrisiLila: boolean("skilasNutrisiLila"),
  skilasMataMasalah: boolean("skilasMataMasalah"),
  skilasMataTes: boolean("skilasMataTes"),
  skilasTelingaBisik: boolean("skilasTelingaBisik"),
  skilasTelingaTes: boolean("skilasTelingaTes"),
  skilasDepresiSedih: boolean("skilasDepresiSedih"),
  skilasDepresiMinat: boolean("skilasDepresiMinat"),
  skilasCovid: boolean("skilasCovid"),

  // AKS Fields
  aksBAB: int("aksBAB"),
  aksBAK: int("aksBAK"),
  aksGrooming: int("aksGrooming"),
  aksToilet: int("aksToilet"),
  aksMakan: int("aksMakan"),
  aksTransfer: int("aksTransfer"),
  aksMobilitas: int("aksMobilitas"),
  aksBerpakaian: int("aksBerpakaian"),
  aksTangga: int("aksTangga"),
  aksMandi: int("aksMandi"),

  // PUMA Fields
  pumaMerokok: int("pumaMerokok"),
  pumaNapasPendek: int("pumaNapasPendek"),
  pumaDahak: int("pumaDahak"),
  pumaBatuk: int("pumaBatuk"),
  pumaSpirometri: int("pumaSpirometri"),

  // TBC & Kontrasepsi
  tbcBatuk: boolean("tbcBatuk"),
  tbcDemam: boolean("tbcDemam"),
  tbcBbTurun: boolean("tbcBbTurun"),
  tbcKontak: boolean("tbcKontak"),
  kontrasepsi: boolean("kontrasepsi"),
  kontrasepsiJenis: varchar("kontrasepsiJenis", { length: 50 }),

  createdAt: datetime("createdAt", { mode: "date" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const lansiaRelations = relations(lansia, ({ many }) => ({
  riwayat: many(pemeriksaan),
}));

export const pemeriksaanRelations = relations(pemeriksaan, ({ one }) => ({
  lansia: one(lansia, {
    fields: [pemeriksaan.lansiaId],
    references: [lansia.id],
  }),
}));

export const jadwal = mysqlTable("jadwal", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  desa: varchar("desa", { length: 100 }).notNull(),
  rw: varchar("rw", { length: 10 }).notNull(),
  tgl: date("tgl").notNull(),
  waktu: time("waktu").notNull(),
  tempat: varchar("tempat", { length: 255 }).notNull(),
  authorId: varchar("authorId", { length: 255 }).references(() => user.id),
  createdAt: datetime("createdAt", { mode: "date" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const berita = mysqlTable("berita", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  excerpt: text("excerpt"),
  content: longtext("content"),
  image: longtext("image"),
  authorId: varchar("authorId", { length: 255 }).references(() => user.id).notNull(),
  createdAt: datetime("createdAt", { mode: "date" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: datetime("updatedAt", { mode: "date" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const galeri = mysqlTable("galeri", {
  id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => randomUUID()),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: longtext("imageUrl").notNull(),
  authorId: varchar("authorId", { length: 255 }).references(() => user.id).notNull(),
  createdAt: datetime("createdAt", { mode: "date" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const beritaRelations = relations(berita, ({ one }) => ({
  author: one(user, {
    fields: [berita.authorId],
    references: [user.id],
  }),
}));

export const galeriRelations = relations(galeri, ({ one }) => ({
  author: one(user, {
    fields: [galeri.authorId],
    references: [user.id],
  }),
}));
