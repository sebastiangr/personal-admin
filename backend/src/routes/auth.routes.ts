import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/auth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { registerSchema, loginSchema } from '../lib/schemas';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/me', authenticateToken, getMe);

export default router;