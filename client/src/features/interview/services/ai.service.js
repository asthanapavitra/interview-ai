import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

/**
 * @description Service to generate interview report based on selfDescription, jobDescription, resume
 */
export async function generateInterviewReport({
  selfDescription,
  jobDescription,
  resumeFile,
}) {
  const form = new FormData();
  form.append("selfDescription", selfDescription);
  form.append("jobDescription", jobDescription);
  form.append("resume", resumeFile);
  try {
    const response = await api.post("/api/interview/generate-report", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {}
}

/**
 *
 * @param {*} interviewId
 * @returns interview report by id
 */
export async function getInterviewReportById(interviewId) {
  try {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
  } catch (err) {
    console.log(err.message);
  }
}

/**
 
 * @returns  all interview reports of a user
 */
export async function getAllInterviewReports() {
  try {
    const response = await api.get(`/api/interview`);

    return response.data;
  } catch (err) {
    console.log(err.message);
  }
}
export async function generateResumePdf(interviewId){
    try{
        const response=await api.get(`/api/interview/resume/pdf/${interviewId}`,{
            responseType:"blob"
        })
        return response.data;
    }catch(err){
         console.log(err.message);
    }
}
