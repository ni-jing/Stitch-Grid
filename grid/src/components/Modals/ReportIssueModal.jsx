import { useState } from "react";

function TextField({ label, value, onChange, autoFocus, hasError, placeholder, disabled }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
            <label style={{ color: "#4B4B4B", fontSize: 13, fontWeight: 400, textAlign: "left" }}>
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoFocus={autoFocus}
                placeholder={placeholder}
                disabled={disabled}
                style={{
                    width: "100%",
                    padding: "6px 10px",
                    background: disabled ? "#F3F3F5" : "#FFFFFF",
                    border: `1px solid ${hasError ? "#C42B1C" : "#EEEEF2"}`,
                    borderRadius: 6,
                    color: "#1E1E1E",
                    fontSize: 14,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                    textAlign: "left",
                }}
            />
        </div>
    );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ReportIssueModal({ onCancel, onSubmit }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleOk = async () => {
        if (!name.trim()) {
            setError("Please enter your name.");
            return;
        }
        if (!email.trim() || !EMAIL_RE.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!description.trim()) {
            setError("Please describe the issue.");
            return;
        }
        setError("");
        setSubmitting(true);
        try {
            await onSubmit({ name: name.trim(), email: email.trim(), description: description.trim() });
            setSubmitted(true);
        } catch (err) {
            setError(err?.message || "Couldn't send the report. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") onCancel();
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
            }}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
            onKeyDown={handleKeyDown}
        >
            <div
                style={{
                    background: "#E7E8EC",
                    border: "1px solid #EEEEF2",
                    borderRadius: 12,
                    padding: 0,
                    width: 440,
                    boxShadow: "0 0 40px rgba(0,122,204,0.2)",
                    overflow: "hidden",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        color: "#1E1E1E",
                        fontSize: 16,
                        fontWeight: 400,
                        marginTop: 20,
                        marginBottom: 16,
                        textAlign: "center",
                    }}
                >
                    Report Issue
                </div>

                {submitted ? (
                    <div style={{ padding: "0 28px 24px", boxSizing: "border-box", textAlign: "center" }}>
                        <div style={{ color: "#1E1E1E", fontSize: 14, marginBottom: 20 }}>
                            Thanks — your report has been sent.
                        </div>
                        <button
                            onClick={onCancel}
                            style={{
                                padding: "8px 24px",
                                background: "#DFF6DD",
                                border: "1px solid #9FD89F",
                                borderRadius: 6,
                                color: "#107C10",
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 400,
                            }}
                        >
                            Close
                        </button>
                    </div>
                ) : (
                <div style={{ padding: "0 28px", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={setName}
                            autoFocus
                            hasError={!!error}
                            placeholder="Your name"
                            disabled={submitting}
                        />
                        <TextField
                            label="Email"
                            value={email}
                            onChange={setEmail}
                            hasError={!!error}
                            placeholder="you@example.com"
                            disabled={submitting}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                        <label style={{ color: "#4B4B4B", fontSize: 13, fontWeight: 400, textAlign: "left" }}>
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What happened? Steps to reproduce, device you are accessing from, etc. "
                            rows={7}
                            disabled={submitting}
                            style={{
                                width: "100%",
                                padding: "8px 10px",
                                background: "#FFFFFF",
                                border: `1px solid ${error ? "#C42B1C" : "#EEEEF2"}`,
                                borderRadius: 6,
                                color: "#1E1E1E",
                                fontSize: 14,
                                fontFamily: "inherit",
                                outline: "none",
                                resize: "vertical",
                                boxSizing: "border-box",
                                textAlign: "left",
                            }}
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                color: "#C42B1C",
                                fontSize: 12,
                                fontWeight: 400,
                                marginBottom: 14,
                                textAlign: "center",
                                background: "#FDECEA",
                                border: "1px solid #F1B0B7",
                                borderRadius: 6,
                                padding: "6px 10px",
                                width: "100%",
                                boxSizing: "border-box",
                                wordBreak: "break-word",
                            }}
                        >
                            ⚠ {error}
                        </div>
                    )}

                    <div style={{ display: "flex", gap: 12, justifyContent: "center", paddingBottom: 24 }}>
                        <button
                            onClick={onCancel}
                            disabled={submitting}
                            style={{
                                padding: "8px 24px",
                                background: "#E7E8EC",
                                border: "1px solid #EEEEF2",
                                borderRadius: 6,
                                color: "#1E1E1E",
                                cursor: submitting ? "default" : "pointer",
                                fontSize: 13,
                                fontWeight: 400,
                                opacity: submitting ? 0.6 : 1,
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleOk}
                            disabled={submitting}
                            style={{
                                padding: "8px 24px",
                                background: "#DFF6DD",
                                border: "1px solid #9FD89F",
                                borderRadius: 6,
                                color: "#107C10",
                                cursor: submitting ? "default" : "pointer",
                                fontSize: 13,
                                fontWeight: 400,
                                opacity: submitting ? 0.6 : 1,
                            }}
                        >
                            {submitting ? "Sending…" : "Submit"}
                        </button>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}