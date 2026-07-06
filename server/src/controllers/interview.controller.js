const pdfParser=require('pdf-parse')
const {generateInterviewReport}=require('../services/ai.service')
const InterviewReport=require('../models/interview-report.model')

async function generateInterviewReportByAI(req, res) {
  try {
    const resumeContent= await (new pdfParser.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const {jobDescription , selfDescription}=req.body;

    const report=await generateInterviewReport({jobDescription,resume:resumeContent.text,selfDescription})

    const interviewReport=await InterviewReport.create({
        resume:resumeContent.text,
        jobDescription,
        selfDescription,
        ...report,
        user:req.user.id,

    })

    res.status(201).send({
        message:"Interview report generated successfully",
        interviewReport
    })
  } catch (err) {
    res.status(501).send({
      message: err.message,
    });
  }
}

module.exports = {
  generateInterviewReportByAI,
};
