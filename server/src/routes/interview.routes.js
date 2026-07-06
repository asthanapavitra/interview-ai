const {Router}=require('express');

const interviewRouter=Router();
const authMiddleware=require('../middlewares/auth.middleware')
const upload=require('../middlewares/file.middleware')
const {generateInterviewReportByAI}= require('../controllers/interview.controller')


/**
 * @route POST /api/interview/generate-report
 * @description generates interview report based on job description , resume and self description
 * @access private
 */

interviewRouter.post('/generate-report', authMiddleware,upload.single('resume'),generateInterviewReportByAI)

module.exports=interviewRouter;