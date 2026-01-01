import { NextFunction, Request, Response } from 'express';

import { authService } from './auth.service';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const response = await authService.register({ email, password });
    return res.status(201).json(response);
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
    const email = req.body.email;
    const password = req.body.password;
    const response = await authService.login({ email, password });
    return res.status(200).json(response);
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
    const id = parseInt(req.params.id);

    const response = await authService.findById(id);
    return res.status(200).json(response);
  } catch (err: any) {
    next(err);
  }
};
