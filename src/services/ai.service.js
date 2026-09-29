import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_AI_API_KEY,
});

const interviewReportJsonSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "The title of the job for which the interview report is generated"
    },
    matchScore: {
      type: "integer",
      description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description",
    },
    technicalQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The technical question that can be asked in the interview",
          },
          intention: {
            type: "string",
            description: "The intention of the interviewer behind asking this question",
          },
          answer: {
            type: "string",
            description: "How to answer this question, points to cover, and approach to take",
          },
        },
        required: ["question", "intention", "answer"],
      },
      description: "Technical questions that can be asked in the interview along with intention and answer guide",
    },
    behavioralQuestions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The behavioral question that can be asked in the interview",
          },
          intention: {
            type: "string",
            description: "The intention of the interviewer behind asking this question",
          },
          answer: {
            type: "string",
            description: "How to answer this question, points to cover, and approach to take",
          },
        },
        required: ["question", "intention", "answer"],
      },
      description: "Behavioral questions along with their intention and answering strategy",
    },
    skillGaps: {
      type: "array",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "The specific skill or area which the candidate is lacking",
          },
        },
        required: ["skill"],
      },
      description: "List of skill gaps in the candidate's profile",
    },
    preparationPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: {
            type: "integer",
            description: "The day number in the preparation plan, starting from 1",
          },
          focus: {
            type: "string",
            description: "The core focus of this preparation day",
          },
          tasks: {
            type: "array",
            items: {
              type: "string",
            },
            description: "List of actionable tasks to be completed on this day",
          },
        },
        required: ["day", "focus", "tasks"],
      },
      description: "A day-wise preparation plan for the candidate",
    },
  },
  required: [
    "title",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

export async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  const prompt = `
    Generate a structured interview preparation report based on the candidate details below:

    RESUME:
    ${resume}

    SELF DESCRIPTION:
    ${selfDescription}

    JOB TARGET / DESCRIPTION:
    ${jobDescription}
    `.trim();

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportJsonSchema,
    },
  });

  // response.text contains the verified JSON adhering strictly to the schema
  const parsedData = JSON.parse(response.text);

  return parsedData;
}