import { Request } from 'express';
import { createRequestLogger } from '../shared/utils/logger';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      id?: string;
      log?: ReturnType<typeof createRequestLogger>;
    }
  }
}

export interface AuthRequest extends Request {
  clientUser: ClientUser;
}

export interface ClientUser {
  id: number;
  email: string;
}

export interface JWTPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}
