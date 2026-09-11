// Mirrors TopBar.jsx's ICON_PATHS/MenuIcon convention: raw path data + a
// tiny local renderer, kept in the file that uses it rather than a shared
// icon module.
const CHEV_UP_PATH =
  "M8.024 5.928l-4.357 4.357-.62-.618L7.716 5h.618L13 9.667l-.619.618-4.357-4.357z";

function Icon({ d, size = 14, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <path fillRule="evenodd" clipRule="evenodd" d={d} fill={color} />
    </svg>
  );
}

export default function AddSymbolForm({
  newSymSvg,
  newSymName,
  setNewSymName,
  newSymWidth,
  setNewSymWidth,
  addError,
  fileInputRef,
  handleSvgFileChange,
  addSymbol,
}) {
  return (
    <div style={{ padding: "8px", borderBottom: "1px solid #EEEEF2", background: "#E8E8E8", flexShrink: 0 }}>
      <div style={{ color: "#8A8A8A", fontSize: 9, letterSpacing: 1, marginBottom: 6, textTransform: "uppercase" }}>
        Upload SVG
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${newSymSvg ? "#107C10" : "#EEEEF2"}`,
          borderRadius: 6,
          padding: "10px 6px",
          textAlign: "center",
          cursor: "pointer",
          marginBottom: 6,
          background: newSymSvg ? "rgba(16,124,16,0.06)" : "transparent",
          transition: "all 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = newSymSvg ? "#107C10" : "#007ACC")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = newSymSvg ? "#107C10" : "#EEEEF2")}
      >
        {newSymSvg ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div dangerouslySetInnerHTML={{ __html: newSymSvg.content }} style={{ width: 36, height: 36 }} />
            <div style={{ color: "#107C10", fontSize: 9 }}>{newSymSvg.name}</div>
          </div>
        ) : (
          <div style={{ color: "#4B4B4B", fontSize: 10 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
              <Icon d={CHEV_UP_PATH} size={18} color="#4B4B4B" />
            </div>
            Click to upload .svg
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        style={{ display: "none" }}
        onChange={handleSvgFileChange}
      />

      <input
        value={newSymName}
        onChange={(e) => setNewSymName(e.target.value)}
        placeholder="Symbol name"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "5px 8px",
          marginBottom: 5,
          background: "#FFFFFF",
          border: "1px solid #EEEEF2",
          borderRadius: 5,
          color: "#1E1E1E",
          fontSize: 11,
          fontFamily: "inherit",
          outline: "none",
        }}
      />

      <div style={{ display: "flex", gap: 5, marginBottom: 5, alignItems: "center" }}>
        <label style={{ color: "#8A8A8A", fontSize: 10, whiteSpace: "nowrap" }}>Width:</label>
        <input
          type="number"
          min={1}
          max={20}
          value={newSymWidth}
          onChange={(e) => setNewSymWidth(e.target.value)}
          style={{
            flex: 1,
            padding: "5px 6px",
            background: "#FFFFFF",
            border: "1px solid #EEEEF2",
            borderRadius: 5,
            color: "#1E1E1E",
            fontSize: 11,
            fontFamily: "inherit",
            outline: "none",
          }}
        />
      </div>

      <button
        onClick={addSymbol}
        style={{
          width: "100%",
          padding: "7px",
          background: "#DFF6DD",
          border: "1px solid #9FD89F",
          borderRadius: 6,
          color: "#107C10",
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 400,
          fontFamily: "inherit",
          transition: "background 0.12s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#CBEECB")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#DFF6DD")}
      >
        + Add Symbol
      </button>
      {addError && (
        <div style={{ color: "#C42B1C", fontSize: 10, marginTop: 4 }}>{addError}</div>
      )}
    </div>
  );
}