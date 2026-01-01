import rateLimit from 'express-rate-limit';

const isTestEnv = process.env.NODE_ENV === 'test';

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: 'Demasiados intentos de login, intenta de nuevo en 5 minutos',
  skipSuccessfulRequests: true,
  skip: () => isTestEnv,
});

export const createLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Demasiadas creaciones, intenta de nuevo en 1 minuto',
  skip: () => isTestEnv,
});

export const normalLimiter = [
  rateLimit({
    windowMs: 1000,
    max: 2,
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde',
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isTestEnv,
  }),
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde',
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isTestEnv,
  }),
];
