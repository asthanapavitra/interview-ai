import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import {
  deleteInterviewPlan,
  generateInterviewReport,
  generateResumePdf,
  getAllInterviewReports,
  getInterviewReportById,
} from "../services/ai.service";
import { useParams } from "react-router-dom";



export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("Context must be used within provider");
  }
  const { loading, report, setReport, setLoading, reports, setReports } =
    context;

  const generateReport = async ({
    selfDescription,
    jobDescription,
    resumeFile,
  }) => {
    try {
      setLoading(true);
      const response = await generateInterviewReport({
        selfDescription,
        jobDescription,
        resumeFile,
      });
      console.log(response.interviewReport);
      setReport(response.interviewReport);
      return response.interviewReport._id;
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };
  const getReportById = async (interviewId) => {
    try {
      setLoading(true);
      const response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };
  const getAllReports = async () => {
    try {
      
      const response = await getAllInterviewReports();
      setReports(response.interviewReports);
    } catch (err) {
      console.log(err.message);
    }
  };

  const deletePlan= async (interviewId) => {
    try {
     
      const response = await deleteInterviewPlan(interviewId);
      getAllReports();
      if(response.status==200){
        console.log("Interview Report deleted Successfully");
      }
    } catch (err) {
      console.log(err.message);
    } 
  };
  const { interviewId } = useParams();
  const getResume = async () => {
    try {
      setLoading(true);

      // 1. Fetch the raw binary blob data from your API function
      const response = await generateResumePdf(interviewId);

      if (!response) {
        throw new Error("Failed to retrieve PDF data.");
      }

      // 2. Create a unique, local object URL pointing to that blob
      const pdfUrl = URL.createObjectURL(response);

      // 4. Open that unique blob URL inside a clean, new browser tab
      window.open(pdfUrl, "_blank");

      // Optional but recommended: Revoke the URL after a short delay to free up memory
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100000);
    } catch (err) {
      console.error("Error displaying PDF:", err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    } else {
      getAllReports();
    }
  }, [interviewId]);
  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getAllReports,
    getResume,
    deletePlan
  };
};
