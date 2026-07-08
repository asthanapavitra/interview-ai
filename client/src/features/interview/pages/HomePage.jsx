import React, { useState } from "react";
import "../style/home.scss";

const HomePage = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedOption, setSelectedOption] = useState("resume");

  const handleResumeChange = (e) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    if (e.dataTransfer.files) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <main className="home-page">
      <div className="header-section">
        <h1>
          Create Your Custom{" "}
          <span className="gradient-text">Interview Plan</span>
        </h1>
        <p>
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy
        </p>
      </div>

      <div className="interview-input-group">
        <div className="left-section">
          <div className="section-header">
            <div className="header-icon">💼</div>
            <h3>Target Job Description</h3>
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            name="jobDescription"
            id="jobDescription"
            placeholder="Paste the full job description here..."
            className="job-description-area"
          ></textarea>
          <small>{0} / 5000 chars</small>
        </div>

        <div className="right-section">
          <div className="section-header">
            <div className="header-icon">👤</div>
            <h3>Your Profile</h3>
          </div>

          <div className="profile-content">
            {/* Resume Upload Section */}
            <div className="upload-section">
              <div className="upload-label">
                Upload Resume <span className="required">*</span>
              </div>
              <label
                htmlFor="resume"
                className="drag-drop-area"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="upload-icon">📄</div>
                <p className="upload-text">Click to upload or drag & drop</p>
                <small>PDF, DOC, or DOCX (Max 5MB)</small>
                {resumeFile && <p className="file-name">{resumeFile.name}</p>}
              </label>
              <input
                hidden
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeChange}
              />
            </div>

            {/* OR Divider */}
            <div className="or-divider">
              <span>OR</span>
            </div>

            {/* Self Description Section */}
            <div className="description-section">
              <div className="upload-label">
                Quick Self Description{" "}
                <span className="optional">(Optional)</span>
              </div>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of expertise. If you don't have a resume handy..."
                className="self-description-area"
              ></textarea>
            </div>

            {/* Validation Message */}
            <div className="validation-message">
              <input
                type="radio"
                id="requirement"
                name="profile-requirement"
                checked={
                  selectedOption === "resume" ||
                  selectedOption === "description"
                }
                readOnly
              />
              <label htmlFor="requirement">
                Use <strong>Resume and Self Description </strong>  together 
                to generate a more accurate interview strategy
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="action-section">
        <button className="generate-button">
          <span>⭐</span> Generate My Interview Strategy
        </button>
      </div>

      <footer className="footer-info">
        <span>AI-Powered Strategy Generation • Aspire Jobs</span>
      </footer>
    </main>
  );
};

export default HomePage;
