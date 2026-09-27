import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import * as authController from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register-user", authController.registerUser);

authRouter.post("/login", authController.login);

authRouter.get("/logout", authController.logout);