import "dotenv/config";
import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

export const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

//routers
app.use("/api/auth", authRouter);