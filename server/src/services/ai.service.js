const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define the schema natively using Gemini's supported OpenAPI subset
const rawInterviewReportSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "integer",
      description: "Score from 0 to 100 indicating how well the candidate matches the job description"
    },
    technicalQuestions: {
      type: "array",
      description: "List of technical questions along with answers and intent",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "Technical question that can be asked" },
          answer: { type: "string", description: "How to answer, what to cover, what to avoid" },
          intent: { type: "string", description: "What the interviewer is trying to assess" }
        },
        required: ["question", "answer", "intent"]
      }
    },
    behavioralQuestions: {
      type: "array",
      description: "List of behavioral questions along with answers and intent",
      items: {
        type: "object",
        properties: {
          question: { type: "string", description: "Behavioral question that can be asked" },
          answer: { type: "string", description: "How to answer, what to cover, what to avoid" },
          intent: { type: "string", description: "What the interviewer is trying to assess" }
        },
        required: ["question", "answer", "intent"]
      }
    },
    skillGaps: {
      type: "array",
      description: "List of skill gaps identified in the candidate's profile",
      items: {
        type: "object",
        properties: {
          skill: { type: "string", description: "Skill that the candidate is lacking" },
          severity: { type: "string", enum: ["low", "medium", "high"], description: "How critical it is to improve" }
        },
        required: ["skill", "severity"]
      }
    },
    preparationPlan: {
      type: "array",
      description: "Day-by-day preparation plan leading up to the interview",
      items: {
        type: "object",
        properties: {
          day: { type: "integer", description: "Day number starting from 1" },
          focus: { type: "string", description: "Main focus or topic for that day" },
          tasks: { 
            type: "array", 
            items: { type: "string" },
            description: "List of tasks for that day" 
          }
        },
        required: ["day", "focus", "tasks"]
      }
    }
  },
  required: ["matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

async function generateInterviewReport({ jobDescription, resume, selfDescription }) {
  const prompt = `You are an expert interview coach. Generate a structured interview report based on:
    Resume: ${resume} 
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Stick to stable 2.5-flash
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: rawInterviewReportSchema // Pass the completely flat schema here
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating report:", error);
  }
}

module.exports = { generateInterviewReport };