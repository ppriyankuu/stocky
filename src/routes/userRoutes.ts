import { Router } from "express";
import { getHistorialINR, getPortfolio, getStats, getTodaysStocks } from "../controllers/userController";

const router = Router();

router.get('/today-stocks/:userid', getTodaysStocks);
router.get('/hist-inr/:userid', getHistorialINR);
router.get('/status/:userid', getStats);
router.get('/portfolio/:userid', getPortfolio);

export default router;