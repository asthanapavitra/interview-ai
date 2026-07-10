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

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "10mm", // Professional top spacing
      bottom: "8mm", // Prevents single bullet points from leaking to page 2
      left: "5mm", // Clean left alignment margin
      right: "5mm", // Clean right alignment margin
    },
  });
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
You are an elite, professional resume writer and ATS (Applicant Tracking System) optimization specialist who has helped thousands of candidates secure interviews at FAANG and top tier tech firms. Your task is to generate a pristine, ready-to-submit, single-page-optimized, ATS-friendly HTML resume.

Analyze these inputs to customize the output perfectly:
- Candidate Resume: ${resume}
- Self Description: ${selfDescription}
- Target Job Description: ${jobDescription}

═══════════════════════════════════
STEP 1: RUTHLESS JOB DESCRIPTION ALIGNMENT & FILTERING
═══════════════════════════════════
Your priority is to ensure a 100% match with the Target Job Description while strictly respecting physical space limits.
- **Extract Target Keywords:** Identify core tech stacks, languages, frameworks, and tools from the Target Job Description. Prioritize these across the Skills, Experience, and Projects sections.
- **Ruthless Content Trimming:** If the candidate qualifies as a FRESHER (0-1 years full-time experience), the output MUST fit flawlessly onto **exactly 1 page**. 
- If the original material contains too many sections (e.g., extracurriculars, multiple secondary projects, overlapping certificates), you MUST select the top 2-3 most relevant items and completely delete the rest. Do not let minor details (like club coordination or general activities) push critical text onto a second page.

═══════════════════════════════════
STEP 2: DEFINE CONTENT DENSITY & COMPACT DESIGN
═══════════════════════════════════
The resume must feature a clean, high-density, small-font professional aesthetic exactly like standard premium recruiter layouts:
- **Font Size:** Body text and bullets must be strictly **10pt** (or 13px/0.85rem). Headings should be **13-14pt** bold. Candidate name should be **22-24pt** bold.
- **Margins & Spacing:** Use compact vertical space management. Line-height should be **1.2 to 1.3** max. Keep margins between sections extremely disciplined (e.g., 8-12px padding/margin) to guarantee a compact layout that feels complete without text spillage.
- **Fresher Limits:** Summary: 2 lines max. Skills: 3-4 category lines max. Projects: Max 2-3 projects, strictly 2-3 bullets each. Education: 2 lines. Awards/Certifications: Combine or isolate to the top 2-3 highest-impact achievements only.

═══════════════════════════════════
STEP 3: ATS-COMPLIANCE RULES (STRICT — 100% PARSEABLE)
═══════════════════════════════════
1. **Single Column Only:** Absolutely no sidebars, multi-column layouts, or side-by-side split panels.
2. **No Layout Tables:** Do not use HTML tables for grid structures or skills matrices. Use simple text dividers (e.g., vertical pipes "|" or commas) for categorized skills lines.
3. **No Icons/Graphics/SVGs:** Remove all vector paths, emojis, or font icons from contact details or headers. Use clean, plain text labels: "Email: | Phone: | LinkedIn: | GitHub:".
4. **Standard Headers Only:** Use exactly: "Summary", "Skills", "Professional Experience" (or "Experience"), "Projects", "Education", "Certifications & Achievements".
5. **No Header/Footer HTML Tags:** Keep all content inside the main \`<body>\` flow to prevent ATS processing engines from omitting floating text blocks.
6. **Standard Bullets:** Use only classic black bullet points (•). List all entries in strict reverse-chronological order.

═══════════════════════════════════
STEP 4: HUMAN EXECUTIVE TONE (ZERO AI-BUZZWORDS)
═══════════════════════════════════
The language must sound like an elite human resume engineer, completely scrubbing away any generic AI-generated footprints.
- **CRITICAL - BAN ALL AI CLICHÉS:** Automatically delete and avoid: *"spearheaded", "synergy", "testament", "passionate", "results-driven", "fostered", "orchestrated", "delved", "beacon", "dynamic", "transformative", "additionally", "furthermore"*. 
- **The Metric-First Formula:** Every single bullet point must follow an action-driven, quantitative structure: **[Strong Action Verb] + [Technical core execution/what you built using specific tools] + [Quantifiable Business Impact/Result]** (e.g., *"Reduced API latency by 24% by refactoring the core Redis caching layers"* instead of *"Responsible for optimizing API endpoints"*).
- Bold key metrics, percentages, numbers, and core tech terms within bullets to make the document highly scannable for recruiters.

═══════════════════════════════════
STEP 5: VISUAL CSS LAYOUT
═══════════════════════════════════
- **Typography:** Use clean, premium system fonts for maximum platform cross-compatibility: \`font-family: 'Arial', 'Helvetica', sans-serif;\` or \`'Calibri'\`. Body color must be a crisp off-black (\`#111111\` or \`#1a1a1a\`).
- **Accent Color:** Use exactly one deep, professional dark accent color sparingly for the Candidate Name and Section Headers (e.g., Deep Navy \`#1a2942\` or Slate \`#2d3748\`). 
- **Dividers:** Include a clean \`border-bottom: 1px solid [accent-color];\` immediately beneath section headings with tight margins.
- **Layout Alignment:** Left/Right flex row alignment for titles and dates: \`display: flex; justify-content: space-between; align-items: baseline; break-inside: avoid;\`.

═══════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════
Return ONLY a valid JSON object matching the requested schema. The 'html' property value must contain the complete HTML document starting with \`<!DOCTYPE html>\`. Do not include code markdown blocks (\`\`\`html), explanations, or opening/closing commentary.
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
