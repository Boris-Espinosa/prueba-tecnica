import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { createRequestLogger } from '../utils/logger';

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = (req.headers['x-request-id'] as string) ?? randomUUID();
  req.id = requestId;
  req.log = createRequestLogger(requestId);
  res.setHeader('X-Request-Id', requestId);
  next();
};
