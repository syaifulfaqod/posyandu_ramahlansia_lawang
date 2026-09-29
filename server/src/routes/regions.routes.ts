import { Router } from "express";
import { RegionsService } from "../services/regions.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const data = await RegionsService.getAllGrouped();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/raw", async (req, res) => {
  try {
    const data = await RegionsService.getAllRaw();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const record = await RegionsService.createRegion(req.body);
    res.status(201).json(record);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/kelurahan/:kel", async (req, res) => {
  try {
    const record = await RegionsService.deleteKelurahan(req.params.kel);
    res.json(record);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/rw/:kel/:rw", async (req, res) => {
  try {
    const record = await RegionsService.deleteRW(req.params.kel, req.params.rw);
    res.json(record);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/rt/:kel/:rw/:rt", async (req, res) => {
  try {
    const record = await RegionsService.deleteRT(req.params.kel, req.params.rw, req.params.rt);
    res.json(record);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
