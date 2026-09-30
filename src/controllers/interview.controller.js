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

        const result = await db.collection("interviewReports").insertOne({...interviewReport, userId: ObjectId.createFromHexString(req.user.id)});

        return res.status(201).json({message: "Interview report generated successfully", result: {...interviewReport, _id: result.insertedId.toString()}});
    }
    catch(error) {
        return res.status(400).json({message: error.message});
    }
    finally {
        await client.close();
    }
}

export async function getInterviewReportById(req, res) {
    const { interviewId } = req.params;

    if (!interviewId || !ObjectId.isValid(interviewId)) {
        return res.status(400).json({ message: "Invalid interview ID format." });
    }

    const client = await connectAndGetMongoDbClient();

    try {
        const db = client.db();

        const interviewReport = await db.collection("interviewReports").findOne({_id: ObjectId.createFromHexString(interviewId), userId: ObjectId.createFromHexString(req.user.id)});

        if (!interviewReport) {
            return res.status(404).json({
                message: "interview report not found"
            })
        }

        return res.status(200).json({message: "get interview report by id successfull", interviewReport: {...interviewReport, _id: interviewReport._id.toString(), userId: interviewReport.userId.toString()}});
    }
    catch(error) {
        return res.status(400).json({message: error.message});
    }
    finally {
        await client.close();
    }
}

export async function getAllInterviewReportByUserId(req, res) {
    const client = await connectAndGetMongoDbClient();

    try {
        const db = client.db();

        const interviewReports = await db.collection("interviewReports").find({userId: ObjectId.createFromHexString(req.user.id)}).toArray();

        return res.status(200).json({message: "get all interview reports by userId successfull", interviewReports: interviewReports.map((ir) => ({...ir, _id: ir._id.toString(), userId: ir.userId.toString()}))});
    }
    catch(error) {
        return res.status(400).json({message: error.message});
    }
    finally {
        await client.close();
    }
}