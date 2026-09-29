import { Router } from "express";
import * as interviewController from "../controllers/interview.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";
import { uploadFile } from "../middlewares/file.middleware.js";

export const interviewRouter = Router();

interviewRouter.post("/generate-interview-report", authMiddleware.authUser, uploadFile.single("resume"), interviewController.generateInterviewReportController);

interviewRouter.get("/get-interview-report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportById);

interviewRouter.get("/get-all", authMiddleware.authUser, interviewController.getAllInterviewReportByUserId);