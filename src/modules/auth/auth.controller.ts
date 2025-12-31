import { Request, Response } from "express";
import { AppError } from "../../common/AppError.class";
import { authService } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const response = await authService.register({ email, password });
    return res.status(201).json(response);
  } catch (err: any) {
    if (err instanceof AppError) {
      return res.status(err.status).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: err.message ?? "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const response = await authService.login({ email, password });
    return res.status(200).json(response);
  } catch (err: any) {
    if (err instanceof AppError) {
      return res.status(err.status).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: err.message ?? "Internal server error" });
  }
};

export const findById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const response = await authService.findById(id);
    return res.status(200).json(response);
  } catch (err: any) {
    if (err instanceof AppError) {
      return res.status(err.status).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: err.message ?? "Internal server error" });
  }
};
