import { PDFParse } from "pdf-parse";
import { generateInterviewReport } from "../services/ai.service.js";

export async function generateInterviewReportController(req, res) {
    const resumeContent = await (new PDFParse(Uint8Array.from(req.file.buffer))).getText();
    
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByGeminiAi = await generateInterviewReport({resume: resumeContent, selfDescription, jobDescription});

    return res.status(200).json({
        message: "Interview report generated successfully.",
        result: {
            user: req.user.id,
            resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByGeminiAi
        }
    });
}