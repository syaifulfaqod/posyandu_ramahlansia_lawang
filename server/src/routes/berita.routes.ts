import { Router } from "express";
import { BeritaService } from "../services/berita.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await BeritaService.getAllBerita();
    res.json(data);
  } catch (error: any) {
    console.error("GET ALL BERITA ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const record = await BeritaService.createBerita(req.body);
    res.status(201).json(record);
  } catch (error: any) {
    console.error("CREATE BERITA ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const record = await BeritaService.updateBerita(req.params.id, req.body);
    res.json(record);
  } catch (error: any) {
    console.error("UPDATE BERITA ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const record = await BeritaService.deleteBerita(req.params.id);
    if (!record) return res.status(404).json({ error: "Berita not found" });
    res.json(record);
  } catch (error: any) {
    console.error("DELETE BERITA ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
