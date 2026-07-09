const {Router}=require('express');

const interviewRouter=Router();
const authMiddleware=require('../middlewares/auth.middleware')
const upload=require('../middlewares/file.middleware')
const {generateInterviewReportByAI,getAllInterviewReports,getInterviewReportById,getResumePdf}= require('../controllers/interview.controller')


/**
 * @route POST /api/interview/generate-report
 * @description generates interview report based on job description , resume and self description
 * @access private
 */

interviewRouter.post('/generate-report', authMiddleware,upload.single('resume'),generateInterviewReportByAI)

/**
 * @route Get /api/interview/report/:interviewId
 * @description gets interview report based on interviewId
 * @access private 
 */

interviewRouter.get('/report/:interviewId', authMiddleware,getInterviewReportById);

/**
 * @route Get /api/interview
 * @description gets all interview reports of a user
 * @access private 
 */
interviewRouter.get('/', authMiddleware,getAllInterviewReports)


/**
 * @route GET /api/interview/resume/pdf/:interviewId
 * @description Returns pdf of the resume generated
 * @access Private
 */
interviewRouter.get('/resume/pdf/:interviewId', authMiddleware,getResumePdf)
module.exports=interviewRouter;