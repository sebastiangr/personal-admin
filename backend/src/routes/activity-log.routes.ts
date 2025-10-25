import { Router } from 'express';
import { getAllLogs } from '../controllers/activityLog.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);
router.get('/', getAllLogs);

export default router;