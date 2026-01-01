import express from 'express';
import { register, login, findById } from '../auth/auth.controller';
import { validate } from '../../shared/middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../../schemas/auth.schema';
import { authLimiter } from '../../shared/middlewares/rate.Limiter.middleware';

const router = express.Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/:id', findById);

export default router;
