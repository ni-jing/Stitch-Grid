export default function ResetModal({ onCancel, onReset }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "#E7E8EC", border: "1px solid #C42B1C", borderRadius: 12, padding: 32, maxWidth: 320, textAlign: "center", boxShadow: "0 0 40px rgba(196,43,28,0.3)" }}>
        <div style={{ color: "#C42B1C", fontSize: 24, marginBottom: 8 }}>⚠</div>
        <div style={{ color: "#1E1E1E", fontSize: 15, fontWeight: 400, marginBottom: 8 }}>Reset Grid?</div>
        <div style={{ color: "#8A8A8A", fontSize: 12, marginBottom: 24 }}>This will clear all symbols and selections.</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button onClick={onCancel} style={{ padding: "8px 20px", background: "#E7E8EC", border: "1px solid #EEEEF2", borderRadius: 6, color: "#1E1E1E", cursor: "pointer", fontSize: 12, fontWeight: 400 }}>Cancel</button>
          <button onClick={onReset} style={{ padding: "8px 20px", background: "#C42B1C", border: "none", borderRadius: 6, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 400 }}>Reset</button>
        </div>
      </div>
    </div>
  );
}