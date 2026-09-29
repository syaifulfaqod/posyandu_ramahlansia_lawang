import { Router } from "express";
import { StatsService } from "../services/stats.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const stats = await StatsService.getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
