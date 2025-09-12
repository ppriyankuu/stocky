import { Router } from "express";
import { createReward } from "../controllers/rewardController";
import { validateRewardRequest } from "../middleware/validation";

const router = Router();

router.post('/reward', validateRewardRequest, createReward);

export default router;