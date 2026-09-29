import { Router } from "express";
import { GaleriService } from "../services/galeri.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await GaleriService.getAll();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = await GaleriService.create(req.body);
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await GaleriService.delete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json(deleted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
