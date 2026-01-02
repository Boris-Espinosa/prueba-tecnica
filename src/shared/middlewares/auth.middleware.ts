/*----- libraries imports -----*/
import { NextFunction, Response, Request } from 'express';

/*----- internal imports -----*/
import { AppError } from '../../common/AppError.class.js';
import { AuthRequest } from '../../common/interfaces.js';

/*----- utilities -----*/
import { verifyToken } from '../utils/jwt.util.js';

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
    next(err);
  }
};
