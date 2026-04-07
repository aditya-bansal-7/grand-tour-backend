import { Router } from 'express';
import { register, login, getMe, googleLogin } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate, registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

// Auth Routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', googleLogin);
router.get('/me', requireAuth, getMe);

export default router;
