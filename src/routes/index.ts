import { Router } from 'express'
import rewardRoutes from './rewardRoutes'
import userRoutes from './userRoutes'

const router = Router();

router.use('/', rewardRoutes)
router.use('/', userRoutes)

export default router;