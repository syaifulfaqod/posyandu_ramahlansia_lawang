import { Router } from "express";
import { UserService } from "../services/user.service";
import { db } from "../db";
import { user } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// Endpoint untuk mengecek apakah akun terkunci
router.get("/login-check", async (req, res) => {
  try {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    if (!existingUser) return res.json({ isLocked: false, attempts: 0 });

    res.json({
      isLocked: existingUser.isLocked,
      attempts: existingUser.failedLoginAttempts,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      detail:
        error.cause?.message ||
        error.cause?.sqlMessage ||
        error.sqlMessage ||
        String(error.cause || error),
    });
  }
});

// Endpoint untuk mencatat kegagalan login
router.post("/login-failed", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    // [TEST 01 - READABILITY]
    // Status: SESUAI
    // Temuan: Penamaan variabel 'existingUser' dan 'isAdminKkn' sangat jelas,
    // menggunakan standar camelCase, dan langsung merepresentasikan kegunaannya.
    const [existingUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));
    if (!existingUser) return res.json({ success: true });

    const isAdminKkn =
      existingUser.role === "Admin" && existingUser.name === "KKN RAMAH LANSIA";
    if (!isAdminKkn) {
      const newAttempts = (existingUser.failedLoginAttempts || 0) + 1;
      const isLocked = newAttempts >= 5;
      await db
        .update(user)
        .set({
          failedLoginAttempts: newAttempts,
          isLocked: isLocked,
        })
        .where(eq(user.id, existingUser.id));

      return res.json({ success: true, isLocked, attempts: newAttempts });
    }

    res.json({ success: true, isLocked: false });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk mereset percobaan login karena sukses
router.post("/login-success", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    await db
      .update(user)
      .set({ failedLoginAttempts: 0 })
      .where(eq(user.email, email));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint untuk membuka kunci (unlock)
router.post("/:id/unlock", async (req, res) => {
  try {
    await db
      .update(user)
      .set({ isLocked: false, failedLoginAttempts: 0 })
      .where(eq(user.id, req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await UserService.getAllUsers();
    res.json(data);
  } catch (error: any) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const record = await UserService.createUser(req.body);
    res.status(201).json(record);
  } catch (error: any) {
    console.error("CREATE USER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const record = await UserService.updateUser(req.params.id, req.body);
    res.json(record);
  } catch (error: any) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await UserService.deleteUser(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
