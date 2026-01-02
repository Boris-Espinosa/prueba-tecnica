/*----- libraries imports -----*/
import { NextFunction, Request, Response } from 'express';

/*----- internal imports -----*/
import { authService } from './auth.service.js';

/*----- utilities -----*/
import { logger } from '../../shared/utils/logger.js';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestLogger = req.log ?? logger;
    requestLogger.info(
      { action: 'register_attempt', email: req.body.email },
      'User registration attempt'
    );

    const response = await authService.register({
      email: req.body.email,
      password: req.body.password,
    });

    requestLogger.info(
      { action: 'register_success', userId: response.user.id },
      'User registered successfully'
    );

    return res.status(201).json({
      status: 201,
      ...response,
    });
  } catch (err: any) {
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
    requestLogger.info(
      { action: 'login_attempt', email: req.body.email },
      'User login attempt'
    );

    const response = await authService.login({
      email: req.body.email,
      password: req.body.password,
    });

    requestLogger.info(
      { action: 'login_success', userId: response.user.id },
      'User logged in successfully'
    );

    return res.status(200).json({
      status: 200,
      ...response,
    });
  } catch (err: any) {
    next(err);
  }
};

export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestLogger = req.log ?? logger;
    requestLogger.info(
      { action: 'Find_user_by_id_attempt', userToFindId: req.params.id },
      'Find user by id attempt'
    );
    const id = parseInt(req.params.id);

    const response = await authService.findById(id);
    requestLogger.info(
      { action: 'Find_user_by_id_success', userId: response.id },
      'User found successfully'
    );
    return res.status(200).json({
      status: 200,
      ...response,
    });
  } catch (err: any) {
    next(err);
  }
};
