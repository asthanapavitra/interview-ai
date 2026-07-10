const pdfParser = require("pdf-parse");
const {
  generateInterviewReport,
  generatePDFfromHtml,
  generateResumePdf,
} = require("../services/ai.service");
const InterviewReport = require("../models/interview-report.model");
const interviewReport = require("../models/interview-report.model");

/**
 * @description generates interview report based on job description, resume and self description
 * @access private
 *
 */
async function generateInterviewReportByAI(req, res) {
  try {
    const resumeContent = await new pdfParser.PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();
    const { jobDescription, selfDescription } = req.body;

    const report = await generateInterviewReport({
      jobDescription,
      resume: resumeContent.text,
      selfDescription,
    });

    const interviewReport = await InterviewReport.create({
      resume: resumeContent.text,
      jobDescription,
      selfDescription,
      ...report,
      user: req.user.id,
    });

    res.status(201).send({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (err) {
    res.status(501).send({
      message: err.message,
    });
  }
}

/**
 * @description gets interview based on interviewId
 * @access private
 */

async function getInterviewReportById(req, res) {
  const interviewId = req.params.interviewId;
  const interviewreport = await InterviewReport.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewreport) {
    return res.status(404).send({
      message: "Interview report not found",
    });
  }
  res.status(200).send({
    message: "Interview report fetched successfully",
    interviewReport: interviewreport,
  });
}

/**
 * @description gets all interview reports of a user
 * @access private
 */

async function getAllInterviewReports(req, res) {
  const interviewReports = await InterviewReport.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );
  if (!interviewReports) {
    return res.status(404).send({
      message: "Interview reports not found",
    });
  }
  console.log("Interview report fetched successfully");
  res.status(200).send({
    message: "Interview report fetched successfully",
    interviewReports: interviewReports,
  });
}

async function getResumePdf(req, res) {
  const interviewId = req.params.interviewId;
  const interviewReport = await InterviewReport.findById(interviewId);
  if (!interviewReport) {
    return res.status(400).send({
      message: "Interview Report with the given id does not exist",
    });
  }
  const {jobDescription,selfDescription,resume}=interviewReport
  const pdfBuffer=await generateResumePdf({jobDescription,selfDescription,resume})
  res.set({
    "Content-Type":"application/pdf",
    "Content-Disposition":`inline; filename=resume_${interviewId}.pdf`
  });
  res.send(pdfBuffer)
}

async function deleteInterviewPlan(req,res){
  const interviewId=req.params.interviewId;
  const interviewReport=await InterviewReport.findOne({_id:interviewId,user:req.user.id});
  if(!interviewReport){
    return res.status(400).send({
      message:"Interview Report with the given id doesnot exist"
    })
  }
  await InterviewReport.deleteOne({_id:interviewId})
  res.status(200).send({
    message:"Interview Report deleted successfully"
  })
}
module.exports = {
  generateInterviewReportByAI,
  getAllInterviewReports,
  getInterviewReportById,
  getResumePdf,
  deleteInterviewPlan
};
