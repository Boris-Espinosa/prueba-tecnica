/*----- libraries imports -----*/
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/*----- utilities -----*/
import { createRequestLogger } from '../utils/logger.js';

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
