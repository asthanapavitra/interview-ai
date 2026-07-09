const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const puppeteer = require("puppeteer");

// Define the schema natively using Gemini's supported OpenAPI subset
const rawInterviewReportSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "RawInterviewReport",
  type: "object",
  properties: {
    matchScore: {
      type: "integer",
      minimum: 0,
      maximum: 100,
      description:
        "Score from 0 to 100 indicating how well the candidate matches the job description",
    },
    title: {
      type: "string",
      description: "Job title based on job description",
    },
    technicalQuestions: {
      type: "array",
      description: "List of technical questions along with answers and intent",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "Technical question that can be asked",
          },
          answer: {
            type: "string",
            description: "How to answer, what to cover, what to avoid",
          },
          intent: {
            type: "string",
            description: "What the interviewer is trying to assess",
          },
        },
        required: ["question", "answer", "intent"],
      },
    },
    behavioralQuestions: {
      type: "array",
      description: "List of behavioral questions along with answers and intent",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "Behavioral question that can be asked",
          },
          answer: {
            type: "string",
            description: "How to answer, what to cover, what to avoid",
          },
          intent: {
            type: "string",
            description: "What the interviewer is trying to assess",
          },
        },
        required: ["question", "answer", "intent"],
      },
    },
    skillGaps: {
      type: "array",
      description: "List of skill gaps identified in the candidate's profile",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "Skill that the candidate is lacking",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "How critical it is to improve",
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: "array",
      description: "Day-by-day preparation plan leading up to the interview",
      items: {
        type: "object",
        properties: {
          day: { type: "integer", description: "Day number starting from 1" },
          focus: {
            type: "string",
            description: "Main focus or topic for that day",
          },
          tasks: {
            type: "array",
            items: { type: "string" },
            description: "List of tasks for that day",
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: [
    "matchScore",
    "title",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

async function generateInterviewReport({
  jobDescription,
  resume,
  selfDescription,
}) {
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
        responseSchema: rawInterviewReportSchema, // Pass the completely flat schema here
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating report:", error);
  }
}
async function generatePDFfromHtml(htmlContent) {
  let browser;
  if (process.env.NODE_ENV === "production") {
    browser = await puppeteer.launch({
      executablePath: await puppeteer.executablePath(),
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // needed on Render's containers
    });
  } else {
    browser = await puppeteer.launch();
  }
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

  const pdfBuffer = await page.pdf({ format: "A4" });
  await browser.close();
  return pdfBuffer;
}
async function generateResumePdf({ resume, jobDescription, selfDescription }) {
  const resumeSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: "Resume Schema",
    type: "object",
    properties: {
      html: {
        type: "string",
        description:
          "The HTML content of the resume which could be converted easily into pdf using libraries like puppeteer",
      },
    },
    required: ["html"],
  };
  const prompt = `
Generate a highly targeted, interview-winning, and ATS-friendly resume based on these inputs:
- Candidate Resume: ${resume}
- Self Description: ${selfDescription}
- Target Job Description: ${jobDescription}

Writing & Strategy Guidelines:
1. **High Impact & ATS Optimized:** Tailor the content precisely to pass ATS filters for the provided Job Description. Highlight matching keywords, technical skills, and metrics-driven achievements naturally. 
2. **Human Tone:** Write like a professional resume writer, not an AI. Avoid cliché corporate buzzwords (e.g., "spearheaded a synergistic paradigm shift", "testament to"). Keep the language clear, crisp, and compelling enough to secure an interview call.
3. **Strict Page Budget:** Keep the layout tightly structured. Content must comfortably fit across 1 to 2 pages without being overly verbose or leaving excessive empty space.
4. **Design & HTML Layout:** Output a complete HTML document with embedded CSS. Use a clean, professional accent color (like deep navy or slate) for headings, combined with standard system fonts (Helvetica, Inter). 
5. **Puppeteer Print Fixes:** 
   - Use \`@page { size: A4; margin: 0.6in 0.5in 0.5in 0.5in; }\` for clean, uniform margins on all pages.
   - Set \`body { margin: 0; padding: 0; }\`.
   - Prevent titles from separating from their blocks: \`h2, h3 { page-break-after: avoid; break-after: avoid; }\`.
   - Prevent broken text blocks: \`li { break-inside: avoid; }\`. Do not use \`page-break-inside: avoid;\` on large container sections.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Stick to stable 2.5-flash
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema, // Pass the completely flat schema here
      },
    });

    const jsonObject = JSON.parse(response.text);
    const pdfBuffer = generatePDFfromHtml(jsonObject.html);
    return pdfBuffer;
  } catch (error) {
    console.error("Error generating report:", error);
  }
}
module.exports = {
  generateInterviewReport,
  generatePDFfromHtml,
  generateResumePdf,
};
