import { useState } from "react";

function Tab({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                padding: "9px 0",
                background: active ? "#E7E8EC" : "transparent",
                border: "none",
                borderBottom: active ? "2px solid #007ACC" : "2px solid transparent",
                color: active ? "#1E1E1E" : "#8A8A8A",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 400,
                fontFamily: "inherit",
                letterSpacing: 0.5,
                transition: "color 0.12s, background 0.12s, border-color 0.12s",
            }}
        >
            {label}
        </button>
    );
}

function NumberField({ label, value, onChange, onKeyDown, autoFocus, hasError }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <label
                style={{
                    color: "#4B4B4B",
                    fontSize: 13,
                    fontWeight: 400,
                    width: 70,
                    textAlign: "right",
                    flexShrink: 0,
                }}
            >
                {label}:
            </label>
            <input
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                autoFocus={autoFocus}
                style={{
                    flex: 1,
                    padding: "6px 10px",
                    background: "#FFFFFF",
                    border: `1px solid ${hasError ? "#C42B1C" : "#EEEEF2"}`,
                    borderRadius: 6,
                    color: "#1E1E1E",
                    fontSize: 14,
                    fontFamily: "inherit",
                    outline: "none",
                }}
            />
        </div>
    );
}

export default function ResizeCellModal({ onCancel, onResize, cellAspect }) {
    const isCustomAspect = cellAspect && (cellAspect.w !== 1 || cellAspect.h !== 1);
    const [tab, setTab] = useState(isCustomAspect ? "define" : "gauge"); // "gauge" | "define"
    const [gaugeStitches, setGaugeStitches] = useState("");
    const [gaugeRows, setGaugeRows] = useState("");
    const [defineHeight, setDefineHeight] = useState(isCustomAspect ? String(Math.round(cellAspect.h * 100) / 100) : "");
    const [defineWidth, setDefineWidth] = useState(isCustomAspect ? String(Math.round(cellAspect.w * 100) / 100) : "");
    const [error, setError] = useState("");

    const fields = tab === "gauge"
        ? [
            { key: "stitches", label: "Stitches", value: gaugeStitches, setValue: setGaugeStitches },
            { key: "rows", label: "Rows", value: gaugeRows, setValue: setGaugeRows },
        ]
        : [
            { key: "height", label: "Height", value: defineHeight, setValue: setDefineHeight },
            { key: "width", label: "Width", value: defineWidth, setValue: setDefineWidth },
        ];

    const switchTab = (next) => {
        setTab(next);
        setError("");
    };

    const isValidNumber = (str) => {
        if (str === null || str === undefined) return false;
        const trimmed = String(str).trim();
        if (trimmed === "") return false;
        const n = Number(trimmed);
        return Number.isFinite(n) && n > 0;
    };

    const handleOk = () => {
        for (const f of fields) {
            if (!isValidNumber(f.value)) {
                setError(`Please enter a valid number for ${f.label.toLowerCase()}.`);
                return;
            }
        }
        setError("");

        if (tab === "gauge") {
            onResize({
                mode: "gauge",
                stitches: Number(gaugeStitches),
                rows: Number(gaugeRows),
            });
        } else {
            onResize({
                mode: "define",
                height: Number(defineHeight),
                width: Number(defineWidth),
            });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleOk();
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
        >
            <div
                style={{
                    background: "#E7E8EC",
                    border: "1px solid #EEEEF2",
                    borderRadius: 12,
                    padding: 0,
                    width: 320,
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
                    Resize Cell
                </div>

                <div style={{ display: "flex", borderBottom: "1px solid #EEEEF2", margin: "0 28px" }}>
                    <Tab label="Gauge" active={tab === "gauge"} onClick={() => switchTab("gauge")} />
                    <Tab label="Define" active={tab === "define"} onClick={() => switchTab("define")} />
                </div>

                <div style={{ padding: "20px 28px 0", boxSizing: "border-box" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                        {fields.map((f, i) => (
                            <NumberField
                                key={f.key}
                                label={f.label}
                                value={f.value}
                                onChange={f.setValue}
                                onKeyDown={handleKeyDown}
                                autoFocus={i === 0}
                                hasError={!!error}
                            />
                        ))}
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
                            style={{
                                padding: "8px 24px",
                                background: "#E7E8EC",
                                border: "1px solid #EEEEF2",
                                borderRadius: 6,
                                color: "#1E1E1E",
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 400,
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleOk}
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
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}