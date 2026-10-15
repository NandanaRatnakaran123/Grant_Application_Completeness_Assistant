
import { useState } from "react";
import {
  uploadDocument,
  createAssessment,
} from "./services/api";
import "./App.css";

function DocumentCard({
  title,
  description,
  document,
  onUpload,
  loading,
}) {
  return (
    <section className="document-card">
      <h2>{title}</h2>
      <p>{description}</p>

      <label className="upload-button">
        {loading ? "Uploading..." : "Choose document"}
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          disabled={loading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onUpload(file);
            event.target.value = "";
          }}
        />
      </label>

      {document && (
        <div className="document-result">
          <p>
            <strong>File:</strong> {document.originalName}
          </p>
          <p>
            <strong>Extracted characters:</strong>{" "}
            {document.text.length}
          </p>
          <details>
            <summary>Preview extracted text</summary>
            <pre>{document.text.slice(0, 3000)}</pre>
          </details>
        </div>
      )}
    </section>
  );
}

// function AssessmentResults({ assessment }) {
//   return (
//     <section className="results-panel">
//       <span className="eyebrow">ASSESSMENT RESULTS</span>
//       <h2>Requirement review</h2>

//       <div className="mock-notice" role="status">
//         <strong>Development mock — not AI analysis</strong>
//         <p>{assessment.notice}</p>
//       </div>

//       <div className="summary-grid">
//         <div className="summary-item">
//           <strong>{assessment.summary.total}</strong>
//           <span>Total checks</span>
//         </div>
//         <div className="summary-item">
//           <strong>{assessment.summary.needsReview}</strong>
//           <span>Needs review</span>
//         </div>
//         <div className="summary-item">
//           <strong>{assessment.summary.notFound}</strong>
//           <span>Not found</span>
//         </div>
//       </div>

//       {assessment.requirements.map((item) => (
//         <article className="requirement-card" key={item.id}>
//           <div className="requirement-heading">
//             <h3>{item.requirement}</h3>
//             <span className={`status ${item.status}`}>
//               {item.status === "not-found"
//                 ? "Not found"
//                 : "Needs review"}
//             </span>
//           </div>

//           <p>
//             <strong>Importance:</strong> Not verified
//           </p>

//           <div className="evidence-section">
//             <h4>Guideline text match</h4>
//             {item.guidelineEvidence ? (
//               <blockquote>{item.guidelineEvidence.quote}</blockquote>
//             ) : (
//               <p>No matching keyword found in the guideline.</p>
//             )}
//           </div>

//           <div className="evidence-section">
//             <h4>Application text match</h4>
//             {item.applicationEvidence ? (
//               <blockquote>{item.applicationEvidence.quote}</blockquote>
//             ) : (
//               <p>No matching keyword found in the application.</p>
//             )}
//           </div>

//           <div className="question-box">
//             <strong>Suggested clarification</strong>
//             <p>{item.clarificationQuestion}</p>
//           </div>
//         </article>
//       ))}
//     </section>
//   );
// }

function AssessmentResults({ assessment }) {
  const [reviews, setReviews] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  function getReview(item) {
    return (
      reviews[item.id] || {
        decision: "pending",
        correctedEvidence: null,
      }
    );
  }

  function saveDecision(item, decision) {
    setReviews((previous) => ({
      ...previous,
      [item.id]: {
        ...getReview(item),
        decision,
      },
    }));
    setEditingId(null);
  }

  function saveCorrection(item) {
    if (!editText.trim()) {
      return;
    }

    setReviews((previous) => ({
      ...previous,
      [item.id]: {
        ...getReview(item),
        decision: "corrected",
        correctedEvidence: editText.trim(),
      },
    }));

    setEditingId(null);
    setEditText("");
  }

  const confirmedCount = assessment.requirements.filter(
    (item) => getReview(item).decision === "confirmed"
  ).length;

  const correctedCount = assessment.requirements.filter(
    (item) => getReview(item).decision === "corrected"
  ).length;

  const rejectedCount = assessment.requirements.filter(
    (item) => getReview(item).decision === "rejected"
  ).length;

  return (
    <section className="results-panel">
      <span className="eyebrow">ASSESSMENT RESULTS</span>
      <h2>Requirement review</h2>

      <div className="mock-notice" role="status">
        <strong> {assessment.assessmentMode === "gemini-ai"
      ? "AI-assisted assessment — human review required"
      : "Development mock — not AI analysis"}</strong>
        <p>{assessment.notice}</p>
      </div>

      <div className="summary-grid">
        <div className="summary-item">
          <strong>{assessment.summary.total}</strong>
          <span>Total checks</span>
        </div>
        <div className="summary-item">
          <strong>{assessment.summary.needsReview}</strong>
          <span>Needs review</span>
        </div>
        <div className="summary-item">
          <strong>{assessment.summary.notFound}</strong>
          <span>Not found</span>
        </div>
        <div className="summary-item">
          <strong>{confirmedCount}</strong>
          <span>Confirmed</span>
        </div>
        <div className="summary-item">
          <strong>{correctedCount}</strong>
          <span>Corrected</span>
        </div>
        <div className="summary-item">
          <strong>{rejectedCount}</strong>
          <span>Rejected</span>
        </div>
      </div>

      {assessment.requirements.map((item) => {
        const review = getReview(item);
        const hasEvidence = Boolean(item.applicationEvidence);

        return (
          <article className="requirement-card" key={item.id}>
            <div className="requirement-heading">
              <h3>{item.requirement}</h3>
              <span className={`status ${item.status}`}>
                {item.status === "not-found"
                  ? "Not found"
                  : "Needs review"}
              </span>
            </div>

            <p>
              <strong>Importance:</strong> Not verified
            </p>

            <div className="evidence-section">
              <h4>Guideline text match</h4>
              {item.guidelineEvidence ? (
                <blockquote>
                  {item.guidelineEvidence.quote}
                </blockquote>
              ) : (
                <p>No matching keyword found in the guideline.</p>
              )}
            </div>

            <div className="evidence-section">
              <h4>Application evidence</h4>

              {editingId === item.id ? (
                <div>
                  <label htmlFor={`evidence-${item.id}`}>
                    Correct the suggested evidence
                  </label>
                  <textarea
                    id={`evidence-${item.id}`}
                    rows={4}
                    value={editText}
                    onChange={(event) =>
                      setEditText(event.target.value)
                    }
                    placeholder="Enter the correct evidence text"
                  />
                  <button
                    type="button"
                    onClick={() => saveCorrection(item)}
                    disabled={!editText.trim()}
                  >
                    Save correction
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  {review.correctedEvidence ? (
                    <blockquote>
                      {review.correctedEvidence}
                    </blockquote>
                  ) : item.applicationEvidence ? (
                    <blockquote>
                      {item.applicationEvidence.quote}
                    </blockquote>
                  ) : (
                    <p>No matching keyword found in the application.</p>
                  )}

                  {review.correctedEvidence && (
                    <p>Reviewer-provided evidence correction.</p>
                  )}
                </>
              )}
            </div>

            <div className="question-box">
              <strong>Suggested clarification</strong>
              <p>{item.clarificationQuestion}</p>
            </div>

            <div className="review-actions">
              <p>
                <strong>Reviewer decision:</strong>{" "}
                {review.decision === "pending"
                  ? "Pending"
                  : review.decision === "confirmed"
                    ? "Confirmed"
                    : review.decision === "corrected"
                      ? "Corrected"
                      : "Rejected"}
              </p>

              <button
                type="button"
                disabled={!hasEvidence || editingId !== null}
                onClick={() => saveDecision(item, "confirmed")}
              >
                Confirm evidence
              </button>

              <button
                type="button"
                disabled={editingId !== null}
                onClick={() => {
                  setEditText(
                    review.correctedEvidence ??
                      item.applicationEvidence?.quote ??
                      ""
                  );
                  setEditingId(item.id);
                }}
              >
                Correct evidence
              </button>

              <button
                type="button"
                disabled={!hasEvidence || editingId !== null}
                onClick={() => saveDecision(item, "rejected")}
              >
                Reject evidence
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function SupportingDocumentsChecklist({ application }) {
  const [items, setItems] = useState([
    {
      id: "registration",
      label: "Proof of organisational registration",
      status: "missing",
    },
    {
      id: "budget",
      label: "Detailed project budget",
      status: "included",
    },
    {
      id: "team-cvs",
      label: "CVs or profiles for project lead and trainers",
      status: "missing",
    },
  ]);

  function toggleStatus(id) {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status:
                item.status === "included"
                  ? "missing"
                  : "included",
            }
          : item
      )
    );
  }

  return (
    <section className="results-panel">
      <span className="eyebrow">DOCUMENT CHECKLIST</span>
      <h2>Supporting documents</h2>
      <p>
        Review each document and update its status. These are
        sample checklist entries and must be verified against
        the uploaded guideline and application.
      </p>

      {items.map((item) => (
        <div className="requirement-card" key={item.id}>
          <div className="requirement-heading">
            <h3>{item.label}</h3>
            <span
              className={`status ${
                item.status === "included"
                  ? "needs-review"
                  : "not-found"
              }`}
            >
              {item.status === "included"
                ? "Marked included"
                : "Outstanding"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => toggleStatus(item.id)}
          >
            Mark as{" "}
            {item.status === "included"
              ? "outstanding"
              : "included"}
          </button>
        </div>
      ))}
    </section>
  );
}


export default function App() {
  const [guideline, setGuideline] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [assessment, setAssessment] = useState(null);

  async function handleUpload(file, type) {
    setError("");
    setAssessment(null);

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be 5 MB or smaller.");
      return;
    }

    setLoading(type);

    try {
      const document = await uploadDocument(file);

      if (type === "guideline") {
        setGuideline(document);
      } else {
        setApplication(document);
      }
    } catch (err) {
      setError(err.message || "Unable to upload document.");
    } finally {
      setLoading("");
    }
  }

  async function handleAssessment() {
    if (!guideline || !application) {
      setError("Please upload both documents first.");
      return;
    }

    setError("");
    setLoading("assessment");
    setAssessment(null);

    try {
      const result = await createAssessment(
        guideline.text,
        application.text
      );

      setAssessment(result);
    } catch (err) {
      setError(err.message || "Unable to create assessment.");
    } finally {
      setLoading("");
    }
  }

  return (
    <main className="app">
      <header className="page-header">
        <span className="eyebrow">GRANT APPLICATION REVIEW</span>
        <h1>Grant Completeness Assistant</h1>
        <p>
          Check your application against grant requirements
          and identify missing evidence.
        </p>
      </header>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="document-grid">
        <DocumentCard
          title="1. Grant guidelines"
          description="Upload the document defining eligibility and submission requirements."
          document={guideline}
          loading={loading === "guideline"}
          onUpload={(file) => handleUpload(file, "guideline")}
        />

        <DocumentCard
          title="2. Draft application"
          description="Upload the application you want to review."
          document={application}
          loading={loading === "application"}
          onUpload={(file) => handleUpload(file, "application")}
        />
      </div>

      <section className="next-step">
        <h2>Review your documents</h2>
        <p>
          {guideline && application
            ? "Both documents are ready for a development assessment."
            : "Upload both documents to enable assessment."}
        </p>

        <button
          onClick={handleAssessment}
          disabled={
            !guideline ||
            !application ||
            loading !== ""
          }
        >
          {loading === "assessment"
            ? "Creating assessment..."
            : "Start Assessment"}
        </button>
      </section>

      {assessment && (
  <>
    <AssessmentResults assessment={assessment} />
    <SupportingDocumentsChecklist application={application} />
  </>
)}
    </main>
  );
}
