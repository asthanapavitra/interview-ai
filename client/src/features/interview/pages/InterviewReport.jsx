import React, { useContext, useState } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { HiSparkles } from "react-icons/hi2";
import { FiDownload } from "react-icons/fi";
import Loader from "../../../Loader";

const InterviewReport = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [expandedDays, setExpandedDays] = useState({});
  const { loading, report, getResume } = useInterview();
  const [generatingResume, setGeneratingResume] = useState(false);
  // Sample data - replace with props or API call
  const reportData = report;

  if ((loading && !generatingResume)  || !report) {
    return <Loader text="Generating Interview Report..." />;
  }

  const currentSection =
    activeSection === "technical"
      ? reportData.technicalQuestions
      : activeSection === "behavioral"
        ? reportData.behavioralQuestions
        : activeSection === "roadmap"
          ? reportData.preparationPlan
          : null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#e91e63";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
      default:
        return "#999";
    }
  };

  const toggleAnswer = (index) => {
    setExpandedAnswers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleResumeGeneration = async () => {
    try {
      setGeneratingResume(true);
      await getResume();
    } catch (err) {
      console.log(err.message);
    } finally {
      setGeneratingResume(false);
    }
  };

  if (report) {
    return (
      <div>
        {generatingResume && (
          <div className="loader-overlay">
            <Loader text="Generating AI Resume..." />
          </div>
        )}
        <div className={`interview-report-container ${generatingResume ? "blur-content" : ""}`}>
          <div className="page-header">
            <h1>Interview Analysis Report</h1>
          </div>

          {/* Main Layout */}
          <div className="report-layout">
            {/* Left Sidebar - Navigation */}
            <aside className="sidebar left-sidebar">
              <div className="sidebar-content">
                <nav className="nav-menu">
                  <button
                    className={`nav-item ${activeSection === "technical" ? "active" : ""}`}
                    onClick={() => {
                      setActiveSection("technical");
                      setActiveIndex(0);
                    }}
                  >
                    <span className="nav-icon">💡</span>
                    Technical Questions
                  </button>
                  <button
                    className={`nav-item ${activeSection === "behavioral" ? "active" : ""}`}
                    onClick={() => {
                      setActiveSection("behavioral");
                      setActiveIndex(0);
                    }}
                  >
                    <span className="nav-icon">🤝</span>
                    Behavioral Questions
                  </button>
                  <button
                    className={`nav-item ${activeSection === "roadmap" ? "active" : ""}`}
                    onClick={() => {
                      setActiveSection("roadmap");
                      setActiveIndex(0);
                    }}
                  >
                    <span className="nav-icon">🗺️</span>
                    Preparation Map
                  </button>
                  <button
                    onClick={handleResumeGeneration}
                    className="resume-btn"
                  >
                    <HiSparkles className="ai-icon" />
                    <span>AI Resume</span>
                    <FiDownload className="download-icon" />
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
              <div className="content-card">
                {activeSection === "technical" ||
                activeSection === "behavioral" ? (
                  <div className="questions-list">
                    {currentSection?.map((item, idx) => (
                      <div key={idx} className="question-item">
                        <div
                          className="question-header"
                          onClick={() => toggleAnswer(idx)}
                        >
                          <span className="question-number">Q{idx + 1}</span>
                          <div className="question-main">
                            <p className="question-text">{item.question}</p>
                          </div>
                          <span
                            className={`expand-icon ${expandedAnswers[idx] ? "open" : ""}`}
                          >
                            ▲
                          </span>
                        </div>

                        {expandedAnswers[idx] && (
                          <div className="question-details">
                            <div className="detail-section">
                              <div className="section-label">INTENTION</div>
                              <p className="detail-text">{item.intent}</p>
                            </div>

                            <div className="detail-section">
                              <div className="section-label">MODEL ANSWER</div>
                              <p className="detail-text">{item.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="roadmap-content">
                    <div className="timeline-wrapper">
                      {currentSection?.map((day, idx) => (
                        <div key={day.day} className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div
                            className="timeline-content"
                            onClick={() => toggleDay(day.day)}
                          >
                            <div className="day-header-inline">
                              <span className="day-badge-inline">
                                Day {day.day}
                              </span>
                              <h3 className="day-focus-inline">{day.focus}</h3>
                            </div>
                            <span
                              className={`expand-icon-inline ${expandedDays[day.day] ? "open" : ""}`}
                            >
                              ▼
                            </span>
                          </div>

                          {expandedDays[day.day] && (
                            <div className="timeline-tasks">
                              <ul className="tasks-list">
                                {day.tasks?.map((task, taskIdx) => (
                                  <li key={taskIdx}>{task}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </main>

            {/* Right Sidebar - Match Score & Skill Gaps */}
            <aside className="sidebar right-sidebar">
              <div className="sidebar-content">
                {/* Match Score */}
                <div className="match-score-section">
                  <div className="score-circle">
                    <div className="score-value">{reportData.matchScore}</div>
                    <div className="score-label">Match Score</div>
                  </div>
                  <div className="score-info">
                    <p>
                      Your profile shows strong alignment with the job
                      requirements. Focus on the highlighted skill gaps to
                      maximize your interview performance.
                    </p>
                  </div>
                </div>

                {/* Skill Gaps Section */}
                <div className="skill-gaps-section">
                  <h3 className="section-title">
                    <span className="title-icon">⚠️</span>
                    Skill Gaps
                  </h3>
                  <div className="skills-container">
                    {reportData.skillGaps.map((skillGap, idx) => (
                      <div
                        key={idx}
                        className={`skill-tag severity-${skillGap.severity}`}
                        style={{
                          borderColor: getSeverityColor(skillGap.severity),
                        }}
                      >
                        <span className="skill-name">{skillGap.skill}</span>
                        <span
                          className="severity-badge"
                          style={{
                            backgroundColor: getSeverityColor(
                              skillGap.severity,
                            ),
                          }}
                        >
                          {skillGap.severity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="quick-stats">
                  <h3 className="section-title">
                    <span className="title-icon">📊</span>
                    Quick Stats
                  </h3>
                  <div className="stats-list">
                    <div className="stat-item">
                      <span className="stat-label">Technical Qs</span>
                      <span className="stat-value">
                        {reportData.technicalQuestions.length}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Behavioral Qs</span>
                      <span className="stat-value">
                        {reportData.behavioralQuestions.length}
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Skill Gaps</span>
                      <span className="stat-value">
                        {reportData.skillGaps.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }
};

export default InterviewReport;
