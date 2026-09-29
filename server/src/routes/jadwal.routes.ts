import { Router } from "express";
import { JadwalService } from "../services/jadwal.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await JadwalService.getAllJadwal();
    res.json(data);
  } catch (error: any) {
    console.error("GET ALL JADWAL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const record = await JadwalService.createJadwal(req.body);
    res.status(201).json(record);
  } catch (error: any) {
    console.error("CREATE JADWAL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const record = await JadwalService.updateJadwal(req.params.id, req.body);
    res.json(record);
  } catch (error: any) {
    console.error("UPDATE JADWAL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const record = await JadwalService.deleteJadwal(req.params.id);
    if (!record) return res.status(404).json({ error: "Jadwal not found" });
    res.json(record);
  } catch (error: any) {
    console.error("DELETE JADWAL ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
