import React, { useRef, useState } from "react";

import useFinalGrades from "../../../hooks/Admin/FinalGrades/Usefinalgrades";

// ─── Inline style objects ────────────────────────────────────────────────────

const styles = {
  wrapper: {
    padding: "2rem",
    maxWidth: "680px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', sans-serif",
  },

  // Header
  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    marginBottom: "2rem",
  },
  headerIconBox: {
    flexShrink: 0,
    width: "48px",
    height: "48px",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    padding: "10px",
    boxSizing: "border-box",
    boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1e1b4b",
    margin: "0 0 0.25rem 0",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#6b7280",
    margin: 0,
    lineHeight: 1.5,
  },

  // Card
  card: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "2rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  // Field
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#374151",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },

  // Input
  inputWrapper: { position: "relative" },
  inputIconSpan: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    width: "18px",
    height: "18px",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem 0.75rem 2.75rem",
    border: "1.5px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "0.9375rem",
    color: "#111827",
    background: "#f9fafb",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  inputFocus: {
    borderColor: "#4f46e5",
    background: "#fff",
    boxShadow: "0 0 0 3px rgba(79,70,229,0.1)",
  },

  // Dropzone
  dropzone: (isActive) => ({
    border: `2px dashed ${isActive ? "#4f46e5" : "#d1d5db"}`,
    borderRadius: "16px",
    padding: "2.5rem 1.5rem",
    textAlign: "center",
    cursor: "pointer",
    background: isActive ? "#f5f3ff" : "#fafafa",
    transition: "border-color 0.25s, background 0.25s",
  }),

  // Drop placeholder
  dropIconCircle: {
    width: "52px",
    height: "52px",
    margin: "0 auto 1rem auto",
    background: "#ede9fe",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#4f46e5",
  },
  dropText: {
    fontSize: "0.9375rem",
    fontWeight: 500,
    color: "#374151",
    margin: "0 0 0.25rem 0",
  },
  dropHint: {
    fontSize: "0.8125rem",
    color: "#9ca3af",
    margin: 0,
  },

  // File preview
  filePreview: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    textAlign: "left",
  },
  fileIconBox: {
    flexShrink: 0,
    width: "44px",
    height: "44px",
    background: "#dcfce7",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#16a34a",
  },
  fileInfo: { flex: 1, minWidth: 0 },
  fileName: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#111827",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  fileSize: {
    display: "block",
    fontSize: "0.8rem",
    color: "#6b7280",
    marginTop: "2px",
  },
  fileCheck: {
    flexShrink: 0,
    width: "28px",
    height: "28px",
    background: "#16a34a",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: 700,
  },

  // Alerts
  alertBase: {
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
    padding: "0.875rem 1.125rem",
    borderRadius: "12px",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  alertError: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },
  alertSuccess: {
    background: "#f0fdf4",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
  },

  // Result
  resultBox: {
    background: "#f5f3ff",
    border: "1px solid #ddd6fe",
    borderRadius: "14px",
    padding: "1.25rem 1.5rem",
  },
  resultTitle: {
    fontSize: "0.875rem",
    fontWeight: 700,
    color: "#4f46e5",
    margin: "0 0 1rem 0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  resultGrid: { display: "flex", gap: "2rem" },
  resultItem: { display: "flex", flexDirection: "column", gap: "0.25rem" },
  resultNum: {
    fontSize: "1.75rem",
    fontWeight: 800,
    color: "#1e1b4b",
    lineHeight: 1,
  },
  resultLabel: {
    fontSize: "0.8rem",
    color: "#7c3aed",
    fontWeight: 500,
  },

  // Button
  btn: (loading) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "0.9rem 1.5rem",
    background: loading
      ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
      : "linear-gradient(135deg,#4f46e5,#7c3aed)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontSize: "0.9375rem",
    fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer",
    boxShadow: "0 4px 14px rgba(79,70,229,0.4)",
    opacity: loading ? 0.8 : 1,
    boxSizing: "border-box",
  }),

  // Note
  note: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    fontSize: "0.8125rem",
    color: "#9ca3af",
    lineHeight: 1.5,
    margin: 0,
  },
};

// ─── Spinner (CSS keyframe injected once) ────────────────────────────────────
const SpinnerStyle = () => (
  <style>{`
    @keyframes fg-spin { to { transform: rotate(360deg); } }
    .fg-spinner {
      width: 18px; height: 18px;
      border: 2.5px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: fg-spin 0.7s linear infinite;
      flex-shrink: 0;
    }
    .fg-input-el:focus {
      border-color: #4f46e5 !important;
      background: #fff !important;
      box-shadow: 0 0 0 3px rgba(79,70,229,0.1) !important;
    }
    .fg-dropzone-el:hover {
      border-color: #4f46e5 !important;
      background: #f5f3ff !important;
    }
    .fg-btn-el:hover:not(:disabled) {
      opacity: 0.92;
      transform: translateY(-1px);
    }
  `}</style>
);

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const IconGrades = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: "100%", height: "100%" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
    />
  </svg>
);

const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px", height: "18px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    />
  </svg>
);

const IconUpload = ({ size = 26 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ width: size, height: size }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
    />
  </svg>
);

const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: "22px", height: "22px" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

const IconError = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px", height: "18px", flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
  </svg>
);

const IconSuccess = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "18px", height: "18px", flexShrink: 0 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "15px", height: "15px", flexShrink: 0, marginTop: "1px", color: "#c4b5fd" }}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────
const FinalGradesComp = () => {
  const {
    file,
    courseId,
    setCourseId,
    loading,
    successMessage,
    errorMessage,
    uploadResult,
    handleFileChange,
    handleUpload,
    clearMessages,
  } = useFinalGrades();

  const fileInputRef = useRef(null);
  const [dropHover, setDropHover] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDropHover(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange({ target: { files: [droppedFile] } });
    }
  };

  return (
    <>
      <SpinnerStyle />

      <div style={styles.wrapper}>
        {/* ── Header ── */}
        <div style={styles.header}>
          <div style={styles.headerIconBox}>
            <IconGrades />
          </div>
          <div>
            <h1 style={styles.title}>Upload Final Grades</h1>
            <p style={styles.subtitle}>
              Upload an Excel sheet with final student grades — they'll be
              distributed automatically to every student.
            </p>
          </div>
        </div>

        {/* ── Card ── */}
        <div style={styles.card}>

          {/* Course ID */}
          <div style={styles.field}>
            <label style={styles.label}>Course ID</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIconSpan}>
                <IconBook />
              </span>
              <input
                className="fg-input-el"
                type="text"
                placeholder="e.g. CS101"
                value={courseId}
                style={styles.input}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  clearMessages();
                }}
              />
            </div>
          </div>

          {/* Drop Zone */}
          <div style={styles.field}>
            <label style={styles.label}>Excel File</label>
            <div
              className="fg-dropzone-el"
              style={styles.dropzone(dropHover || !!file)}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDropHover(true); }}
              onDragLeave={() => setDropHover(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                id="finalGradesFileInput"
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={(e) => {
                  handleFileChange(e);
                  clearMessages();
                }}
              />

              {file ? (
                <div style={styles.filePreview}>
                  <div style={styles.fileIconBox}><IconFile /></div>
                  <div style={styles.fileInfo}>
                    <span style={styles.fileName}>{file.name}</span>
                    <span style={styles.fileSize}>
                      {(file.size / 1024).toFixed(1)} KB — ready to upload
                    </span>
                  </div>
                  <div style={styles.fileCheck}>✓</div>
                </div>
              ) : (
                <div>
                  <div style={styles.dropIconCircle}>
                    <IconUpload size={26} />
                  </div>
                  <p style={styles.dropText}>Drag & drop your Excel file here</p>
                  <p style={styles.dropHint}>or click to browse — .xlsx / .xls</p>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div style={{ ...styles.alertBase, ...styles.alertError }}>
              <IconError />
              {errorMessage}
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div style={{ ...styles.alertBase, ...styles.alertSuccess }}>
              <IconSuccess />
              {successMessage}
            </div>
          )}

          {/* Result summary */}
          {uploadResult && (
            <div style={styles.resultBox}>
              <h3 style={styles.resultTitle}>Upload Summary</h3>
              <div style={styles.resultGrid}>
                {uploadResult.processed !== undefined && (
                  <div style={styles.resultItem}>
                    <span style={styles.resultNum}>{uploadResult.processed}</span>
                    <span style={styles.resultLabel}>Students Processed</span>
                  </div>
                )}
                {uploadResult.results?.length > 0 && (
                  <div style={styles.resultItem}>
                    <span style={styles.resultNum}>{uploadResult.results.length}</span>
                    <span style={styles.resultLabel}>Records Updated</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            className="fg-btn-el"
            style={styles.btn(loading)}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="fg-spinner" />
                Uploading Grades...
              </>
            ) : (
              <>
                <IconUpload size={18} />
                Upload Final Grades
              </>
            )}
          </button>

          {/* Note */}
          <p style={styles.note}>
            <IconInfo />
            Grades will be distributed to students automatically. Academic
            records and GPA will be recalculated, and students will receive
            push notifications.
          </p>
        </div>
      </div>
    </>
  );
};

export default FinalGradesComp;