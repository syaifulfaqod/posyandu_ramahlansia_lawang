import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth";
import lansiaRoutes from "./routes/lansia.routes";
import pemeriksaanRoutes from "./routes/pemeriksaan.routes";
import jadwalRoutes from "./routes/jadwal.routes";
import beritaRoutes from "./routes/berita.routes";
import userRoutes from "./routes/user.routes";
import galeriRoutes from "./routes/galeri.routes";
import regionsRoutes from "./routes/regions.routes";
import statsRoutes from "./routes/stats.routes";
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan permintaan tanpa origin (seperti mobile app, curl, atau Postman)
    if (!origin) return callback(null, true);
    
    // Parse origin tambahan dari ALLOWED_ORIGINS (dipisahkan koma)
    const extraOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean)
      : [];

    const clientUrl = process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : undefined;

    const allowedOrigins = [
      clientUrl,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:3001",
      ...extraOrigins
    ].filter(Boolean) as string[];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV !== "production") {
      // Pada mode development, izinkan semua origin untuk memudahkan debugging
      callback(null, true);
    } else {
      // Pada mode production, tolak origin yang tidak terdaftar
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    }
  },
  credentials: true
}));

// Better Auth Route (MUST BE BEFORE express.json())
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});

// Database Diagnostic Check
app.get("/api/db-test", async (req, res) => {
  try {
    const { connection } = await import("./db");
    const [tables] = await connection.query("SHOW TABLES");
    res.json({
      status: "connected",
      tables
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message,
      code: err.code,
      sqlState: err.sqlState
    });
  }
});

// API Routes
app.use("/api/lansia", lansiaRoutes);
app.use("/api/pemeriksaan", pemeriksaanRoutes);
app.use("/api/jadwal", jadwalRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/galeri", galeriRoutes);
app.use("/api/regions", regionsRoutes);
app.use("/api/stats", statsRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
