import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_AI_API_KEY
});

const interviewReportJsonSchema = {
    matchScore: {
        type: "integer",
        description: "A score between 0 and 100 indicating how well the candidate's profile matches the job describe"
    },
    technicalQuestions: {
        type: "array",
        items: {
            type: "object",
            properties: {
                question: {
                    type: "string",
                    description: "The technical question can be asked in the interview"
                },
                intention: {
                    type: "string",
                    description: "The intention of interviewer behind asking this question"
                },
                answer: {
                    type: "string",
                    description: "How to answer this question, what points to cover, what approach to take etc."
                }
            }
        },
        description: "Technical questions that can be asked in the interview along with their intention and how to answer them"
    },
    behavioralQuestions: {
        type: "array",
        items: {
            type: "object",
            properties: {
                question: {
                    type: "string",
                    description: "The behavioral question can be asked in the interview"
                },
                intention: {
                    type: "string",
                    description: "The intention of interviewer behind asking this question"
                },
                answer: {
                    type: "string",
                    description: "How to answer this question, what points to cover, what approach to take etc."
                }
            }
        },
        description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them"
    },
    skillGaps: {
        type: "array",
        items: {
            type: "object",
            properties: {
                skill: {
                    type: "string",
                    description: "The skill which the candidate is lacking"
                }
            }
        },
        description: "List of skill gaps in the candidate's profile along with their severity"
    },
    preparationPlan: {
        type: "array",
        items: {
            type: "object",
            properties: {
                day: {
                    type: "integer",
                    description: "The day number in the preparation plan, starting from 1"
                },
                focus: {
                    type: "string",
                    description: "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."
                },
                tasks: {
                    type: "array",
                    items: {
                        type: "string",
                    },
                    description: "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc."
                }
            }
        },
        description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"
    }
}
const interviewReportSchema = z.fromJSONSchema(interviewReportJsonSchema);

export async function generateInterviewReport({resume, selfDescription, jobDescription}) {
    const prompt = `Generate an interview report for a candidate with the following details: Resume: ${resume}, Self Description: ${selfDescription}, Job Description: ${jobDescription}`;

    const client = new GoogleGenAI({
        apiKey: process.env.GOOGLE_GEMINI_AI_API_KEY
    });

    const interaction = await client.interactions.create({
        model: "gemini-3.5-flash-lite",
        input: prompt,
        response_format: {
            type: 'text',
            mime_type: 'application/json',
            schema: interviewReportJsonSchema
        },
    });

    const interviewReport = interviewReportSchema.parse(JSON.parse(interaction.output_text));
    
    return interviewReport;
}