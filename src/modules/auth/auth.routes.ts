import express from "express";
import { register, login, findById } from "../auth/auth.controller";
import { validate } from "../../shared/middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../../schemas/auth.schema";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/:id", findById);

export default router;
