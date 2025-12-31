import { Request } from "express";

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
