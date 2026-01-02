/*----- libraries imports -----*/
import { Request, Response, NextFunction } from 'express';

/*----- internal imports -----*/
import { AppError } from '../../common/AppError.class.js';

/*----- utilities -----*/
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestLogger = req.log ?? logger;

  if (err.name === 'ZodError') {
    requestLogger.error({
      message: 'Validation error',
      requestId: req.id,
      method: req.method,
      path: req.path,
      errorType: 'ZodError',
      validationErrors: err.issues.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message,
        code: e.code,
      })),
    });

    return res.status(400).json({
      status: 400,
      message: 'Validation error',
      errors: err.issues.map((e: any) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  requestLogger.error({
    message: err.message,
    stack: err.stack,
    requestId: req.id,
    method: req.method,
    path: req.path,
    errorType: err.name,
    ...(err instanceof AppError && { statusCode: err.status }),
  });

  if (err instanceof AppError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  }

  if (err.name === 'QueryFailedError') {
    return res.status(500).json({
      status: 500,
      message: 'Database error',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 401,
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 401,
      message: 'Token expirado',
    });
  }

  return res.status(500).json({
    status: 500,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
