import { Router } from "express";
import { LansiaService } from "../services/lansia.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { kelurahan, rw } = req.query;
    // In a real app, you would also extract the user's role from the session 
    // and restrict `kelurahan` and `rw` if they are a Kader
    const lansiaList = await LansiaService.getAllLansia(kelurahan as string, rw as string);
    res.json(lansiaList);
  } catch (error: any) {
    console.error("GET ALL LANSIA ERROR:", error);
    res.status(500).json({ error: "Failed to fetch lansia data", details: error?.message || error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await LansiaService.getLansiaById(req.params.id);
    if (!data) return res.status(404).json({ error: "Lansia not found" });
    res.json(data);
  } catch (error: any) {
    console.error("GET LANSIA BY ID ERROR:", error);
    res.status(500).json({ error: "Failed to fetch lansia", details: error?.message || error });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const newLansiaData = await LansiaService.bulkCreateLansia(req.body);
    res.status(201).json({ message: `Successfully imported ${newLansiaData.length} records`, data: newLansiaData });
  } catch (error: any) {
    console.error("BULK CREATE LANSIA ERROR:", error);
    res.status(500).json({ error: "Failed to bulk create lansia", details: error?.message || error });
  }
});

router.post("/", async (req, res) => {
  try {
    const newLansia = await LansiaService.createLansia(req.body);
    res.status(201).json(newLansia);
  } catch (error: any) {
    console.error("CREATE LANSIA ERROR:", error);
    res.status(500).json({ error: "Failed to create lansia", details: error?.message || error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await LansiaService.updateLansia(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    console.error("UPDATE LANSIA ERROR:", error);
    res.status(500).json({ error: "Failed to update lansia", details: error?.message || error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // We agreed to use Soft Delete
    await LansiaService.softDeleteLansia(req.params.id);
    res.json({ message: "Lansia deleted successfully" });
  } catch (error: any) {
    console.error("DELETE LANSIA ERROR:", error);
    res.status(500).json({ error: "Failed to delete lansia", details: error?.message || error });
  }
});

export default router;
