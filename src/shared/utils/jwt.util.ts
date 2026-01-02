/*----- libraries imports -----*/
import jwt, { SignOptions } from 'jsonwebtoken';
import { promisify } from 'util';

/*----- internal imports -----*/
import { AppError } from '../../common/AppError.class.js';
import { JWTPayload } from '../../common/interfaces.js';

const verifyAsync = promisify<string, string, JWTPayload>(
  jwt.verify as (
    token: string,
    secret: string,
    callback: (err: any, decoded: any) => void
  ) => void
);

const signAsync = promisify<string | object, string, SignOptions, string>(
  jwt.sign as (
    payload: string | object,
    secret: string,
    options: SignOptions,
    callback: (err: any, token: string) => void
  ) => void
);

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT_SECRET is missing', 500);
  }

  return await verifyAsync(token, process.env.JWT_SECRET);
};

export const generateToken = async (
  payload: { id: number; email: string },
  expiresIn?: string | number
): Promise<string> => {
  if (!process.env.JWT_SECRET) {
    throw new AppError('JWT_SECRET is missing', 500);
  }

  const expiresInValue = expiresIn ?? process.env.JWT_EXPIRES_IN ?? '24h';
  const options: SignOptions = {
    expiresIn: expiresInValue as SignOptions['expiresIn'],
  };
  return await signAsync(payload, process.env.JWT_SECRET, options);
};
