import React, { useState } from "react";
import "../style/interview.scss";

const InterviewReport = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedAnswers, setExpandedAnswers] = useState({});
  const [expandedDays, setExpandedDays] = useState({});

  // Sample data - replace with props or API call
  const reportData = {
    matchScore: 88,
    technicalQuestions: [
      {
        question:
          "The KAD tool processed 500+ KB articles. Can you elaborate on the architecture of this tool and how it efficiently handled such a large volume of data for actionable insights?",
        answer:
          "Describe the overall architecture (e.g., data ingestion, processing pipeline, output storage). Explain the technologies used for data processing (e.g., NLP libraries, custom scripts). Highlight how scalability was considered for handling 500+ articles and beyond. Mention any challenges faced with data volume or variety and how they were overcome. Emphasize the 'actionable insights' part – what kind of insights, and how they contributed to automation workflows.",
        intent:
          "To assess deep understanding of system architecture, data processing, scalability, and practical application of tools/technologies in a real-world project.",
      },
      {
        question:
          "Your DevSync project uses Socket.io for real-time collaboration. Can you explain the challenges involved in ensuring 'low-latency state synchronization' and how you addressed 'collaboration conflicts by 80%'?",
        answer:
          "Discuss the challenges of real-time synchronization, such as latency, message ordering, and conflict resolution (e.g., operational transformations, CRDTs, or simpler server-side merging). Explain the specific techniques or algorithms used to achieve low latency. Detail how collaboration conflicts were identified and resolved, and what metrics or methods were used to measure the 80% reduction. Mention how the shared file system and nested directories were structured and synchronized.",
        intent:
          "To evaluate understanding of real-time communication protocols, distributed system challenges, conflict resolution strategies, and performance optimization.",
      },
    ],
    behavioralQuestions: [
      {
        question:
          "Tell me about a time you faced a significant technical challenge in one of your projects or during your internship. How did you approach solving it, and what was the outcome?",
        answer:
          "Use the STAR method: Situation, Task, Action, Result. Describe a specific, complex technical problem (e.g., performance issue, tricky bug, integration challenge). Explain the steps taken to diagnose and resolve it, including research, collaboration, and experimentation. Highlight any new skills learned or innovative solutions applied. Discuss the positive outcome and what you learned from the experience.",
        intent:
          "To assess problem-solving skills, resilience, technical aptitude under pressure, and ability to learn from challenges.",
      },
      {
        question:
          "The job description emphasizes collaboration within Agile teams. Describe your experience working in a team, particularly on a project like DevSync or your ServiceNow internship. How did you contribute to the team's success, and how did you handle disagreements or different technical opinions?",
        answer:
          "Provide an example of team collaboration. Describe your specific role and responsibilities. Explain how you communicated with teammates, shared knowledge, and helped achieve common goals. If disagreements arose, explain your approach to resolving them constructively, focusing on objective technical merits and fostering a positive team environment. Mention any specific Agile practices you participated in (e.g., stand-ups, sprint reviews).",
        intent:
          "To evaluate teamwork, communication skills, conflict resolution, and understanding of collaborative development methodologies like Agile.",
      },
    ],
    skillGaps: [
      { skill: "CI/CD Pipeline Design", severity: "high" },
      { skill: "AWS/Azure/GCP", severity: "medium" },
      { skill: "Jest & Mocha", severity: "medium" },
      { skill: "Logging & Monitoring", severity: "medium" },
      { skill: "Microservices", severity: "low" },
      { skill: "TypeScript", severity: "low" },
    ],
    roadMap: [
      {
        day: 1,
        focus: "MERN Stack Depth & Performance",
        tasks: [
          "Review advanced React concepts: Hooks, Context API, and state management libraries",
          "Deep dive into Node.js event loop and asynchronous patterns",
          "Practice MongoDB aggregation framework and indexing strategies",
        ],
      },
      {
        day: 2,
        focus: "System Design & Scalability",
        tasks: [
          "Study software architecture patterns, especially for microservices",
          "Review REST API design best practices and versioning",
          "Understand Docker Compose and basic Kubernetes concepts",
        ],
      },
    ],
  };

  const currentSection =
    activeSection === "technical"
      ? reportData.technicalQuestions
      : activeSection === "behavioral"
        ? reportData.behavioralQuestions
        : activeSection === "roadmap"
          ? reportData.roadMap
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

  return (
    <div className="interview-report-container">
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
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <div className="content-card">
            {activeSection === "technical" || activeSection === "behavioral" ? (
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
                  Your profile shows strong alignment with the job requirements.
                  Focus on the highlighted skill gaps to maximize your interview
                  performance.
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
                    style={{ borderColor: getSeverityColor(skillGap.severity) }}
                  >
                    <span className="skill-name">{skillGap.skill}</span>
                    <span
                      className="severity-badge"
                      style={{
                        backgroundColor: getSeverityColor(skillGap.severity),
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
  );
};

export default InterviewReport;
