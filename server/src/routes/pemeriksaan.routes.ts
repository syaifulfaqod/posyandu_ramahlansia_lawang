import { Router } from "express";
import { PemeriksaanService } from "../services/pemeriksaan.service";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const record = await PemeriksaanService.addPemeriksaan(req.body);
    res.status(201).json(record);
  } catch (error: any) {
    console.error("ADD PEMERIKSAAN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const record = await PemeriksaanService.updatePemeriksaan(req.params.id, req.body);
    res.json(record);
  } catch (error: any) {
    console.error("UPDATE PEMERIKSAAN ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
