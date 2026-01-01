import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../common/AppError.class';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const requestLogger = req.log ?? logger;
  requestLogger.error({
    message: err.message,
    stack: err.stack,
    requestId: req.id,
    method: req.method,
    path: req.path,
    errorType: err.name,
  });

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.issues,
    });
  }

  if (err.name === 'QueryFailedError') {
    return res.status(500).json({
      success: false,
      message: 'Database error',
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
  }

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
