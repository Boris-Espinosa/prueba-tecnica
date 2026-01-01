import { NextFunction, Response, Request } from 'express';
import { AppError } from '../../common/AppError.class';
import { AuthRequest } from '../../common/interfaces';
import { verifyToken } from '../utils/jwt.util';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization)
      throw new AppError('Header de autorización invalido', 401);

    const token = authorization.split(' ')[1];
    if (!token)
      throw new AppError('Formato de header de autorización invalido', 401);

    const payload = await verifyToken(token);

    (req as AuthRequest).clientUser = {
      id: payload.id,
      email: payload.email,
    };

    next();
  } catch (err: any) {
    if (err instanceof AppError) {
      return res.status(err.status).json({ message: err.message });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
};
