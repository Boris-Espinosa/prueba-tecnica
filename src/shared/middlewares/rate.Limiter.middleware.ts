/*----- libraries imports -----*/
import rateLimit from 'express-rate-limit';

const isTestEnv = process.env.NODE_ENV === 'test';

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: {
    status: 429,
    message: 'Demasiados intentos de login, intenta de nuevo en 5 minutos',
  },
  skipSuccessfulRequests: true,
  skip: () => isTestEnv,
  standardHeaders: true,
  legacyHeaders: false,
});

export const createLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    status: 429,
    message: 'Demasiadas creaciones, intenta de nuevo en 1 minuto',
  },
  skip: () => isTestEnv,
  standardHeaders: true,
  legacyHeaders: false,
});

export const normalLimiter = [
  rateLimit({
    windowMs: 1000,
    max: 2,
    message: {
      status: 429,
      message:
        'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isTestEnv,
  }),
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: {
      status: 429,
      message:
        'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => isTestEnv,
  }),
];
