import { Router } from "express";
import { getHistorialINR, getPortfolio, getStats, getTodaysStocks } from "../controllers/userController";

const router = Router();

router.get('/today-stocks/:userId', getTodaysStocks);
router.get('/historical-inr/:userId', getHistorialINR);
router.get('/stats/:userId', getStats);
router.get('/portfolio/:userId', getPortfolio);

export default router;