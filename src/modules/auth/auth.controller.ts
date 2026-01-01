import { NextFunction, Request, Response } from 'express';
import { logger } from '../../shared/utils/logger';
import { authService } from './auth.service';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestLogger = req.log ?? logger;
    const email = req.body.email;
    const password = req.body.password;

    requestLogger.info(
      { action: 'register_attempt', email },
      'User registration attempt'
    );

    if (!email || !password) {
      requestLogger.warn({ email }, 'Registration failed: missing credentials');
    }

    const response = await authService.register({ email, password });

    requestLogger.info(
      { action: 'register_success', userId: response.user.id },
      'User registered successfully'
    );

    return res.status(201).json(response);
  } catch (err: any) {
    const requestLogger = req.log ?? logger;
    requestLogger.error(
      { action: 'register_error', error: err.message },
      'Registration failed'
    );
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestLogger = req.log ?? logger;
    const email = req.body.email;
    const password = req.body.password;

    requestLogger.info(
      { action: 'login_attempt', email },
      'User login attempt'
    );

    const response = await authService.login({ email, password });

    requestLogger.info(
      { action: 'login_success', userId: response.user.id },
      'User logged in successfully'
    );

    return res.status(200).json(response);
  } catch (err: any) {
    const requestLogger = req.log ?? logger;
    requestLogger.error(
      { action: 'login_error', error: err.message },
      'Login failed'
    );
    next(err);
  }
};

export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    const response = await authService.findById(id);
    return res.status(200).json(response);
  } catch (err: any) {
    next(err);
  }
};
