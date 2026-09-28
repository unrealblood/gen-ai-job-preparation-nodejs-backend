import "dotenv/config";
import express from "express";
import { authRouter } from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { interviewRouter } from "./routes/interview.routes.js";

export const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

//routers
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);