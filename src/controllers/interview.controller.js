import { PDFParse } from "pdf-parse";
import { generateInterviewReport } from "../services/ai.service.js";
import { connectAndGetMongoDbClient } from "../db/db.js";
import { ObjectId } from "mongodb";

export async function generateInterviewReportController(req, res) {
    const resumeContent = (await (new PDFParse({data: Uint8Array.from(req.file.buffer)})).getText()).text;
    
    const { selfDescription, jobDescription } = req.body;

    const interviewReportByGeminiAi = await generateInterviewReport({resume: resumeContent, selfDescription, jobDescription});

    const interviewReport = {
        userId: req.user.id,
        resumeContent,
        selfDescription,
        jobDescription,
        ...interviewReportByGeminiAi
    };

    const client = await connectAndGetMongoDbClient();

    try {
        const db = client.db();

        await db.collection("interviewReports").insertOne({...interviewReport, userId: ObjectId.createFromHexString(req.user.id)});

        return res.status(201).json({message: "Interview report generated successfully", result: interviewReport});
    }
    catch(error) {
        console.log(error.message);
    }
    finally {
        await client.close();
    }
}