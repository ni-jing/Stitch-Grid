import { svgToDataUrl } from "../../utils/svgUtils";

export default function SymbolRow({
  sym,
  index,
  collapsed,
  isEditMode,
  isEditing,
  editSymName,
  setEditSymName,
  editSymWidth,
  setEditSymWidth,
  startEditSymbol,
  saveEditSymbol,
  cancelEditSymbol,
  deleteSymbol,
  placeSymbol,
  moveMode,
  isDragOver,
  onDragStart,
  onDragEnter,
  onDragEnd,
}) {
  const previewDataUrl = sym.svgContent ? svgToDataUrl(sym.svgContent) : null;

  // Collapsed mode — icon only, no name or width
  if (collapsed) {
    return (
      <button
        onClick={() => placeSymbol(sym)}
        disabled={moveMode}
        title={sym.name}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "4px 0",
          marginBottom: 3,
          background: "#E8E8E8",
          border: "1px solid #EEEEF2",
          borderRadius: 5,
          cursor: moveMode ? "default" : "pointer",
          opacity: moveMode ? 0.4 : 1,
        }}
        onMouseEnter={(e) => {
          if (!moveMode) {
            e.currentTarget.style.background = "#C9DEF5";
            e.currentTarget.style.borderColor = "#C42B1C";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#E8E8E8";
          e.currentTarget.style.borderColor = "#EEEEF2";
        }}
      >
        {previewDataUrl && (
          <div
            style={{
              width: 36,
              height: 36,
              background: "#fff",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              boxSizing: "border-box",
            }}
          >
            <img
              src={previewDataUrl}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              alt={sym.name}
            />
          </div>
        )}
      </button>
    );
  }

  // Normal (expanded, non-edit) mode
  if (!isEditMode) {
    return (
      <button
        onClick={() => placeSymbol(sym)}
        disabled={moveMode}
        style={{
          display: "block",
          width: "100%",
          padding: 0,
          marginBottom: 3,
          background: "#E8E8E8",
          border: "1px solid #EEEEF2",
          borderRadius: 6,
          cursor: moveMode ? "default" : "pointer",
          opacity: moveMode ? 0.4 : 1,
          textAlign: "left",
          overflowX: "auto",
        }}
        onMouseEnter={(e) => {
          if (!moveMode) {
            e.currentTarget.style.background = "#C9DEF5";
            e.currentTarget.style.borderColor = "#C42B1C";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#E8E8E8";
          e.currentTarget.style.borderColor = "#EEEEF2";
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
          }}
        >
          {previewDataUrl && (
            <div
              style={{
                width: 36 * (sym.width || 1),
                height: 36,
                background: "#fff",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                padding: 2,
                boxSizing: "border-box",
              }}
            >
              <img src={previewDataUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
            </div>
          )}
          <div
            style={{
              flexShrink: 0,
              color: "#1E1E1E",
              fontSize: 16,
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}
          >
            {sym.name}
          </div>
          <div
            style={{
              flexShrink: 0,
              color: "#4B4B4B",
              fontSize: 14,
              fontWeight: 400,
              background: "#E8E8E8",
              borderRadius: 4,
              padding: "2px 6px",
              minWidth: 20,
              textAlign: "center",
            }}
          >
            {sym.width}
          </div>
        </div>
      </button>
    );
  }

  // Edit mode — currently editing this symbol
  if (isEditing) {
    return (
      <div
        style={{
          padding: "6px 8px",
          background: "#E8E8E8",
          border: "1px solid #007ACC",
          borderRadius: 6,
          marginBottom: 3,
          overflowX: "auto",
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 5 }}>
          {previewDataUrl && (
            <div
              style={{
                width: 33 * (sym.width || 1),
                height: 33,
                background: "#fff",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                padding: 1,
                boxSizing: "border-box",
              }}
            >
              <img src={previewDataUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
            </div>
          )}
          <input
            value={editSymName}
            onChange={(e) => setEditSymName(e.target.value)}
            placeholder="Name"
            style={{
              flex: 1,
              minWidth: 80,
              padding: "4px 6px",
              background: "#FFFFFF",
              border: "1px solid #EEEEF2",
              borderRadius: 4,
              color: "#1E1E1E",
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 5 }}>
          <label style={{ color: "#8A8A8A", fontSize: 12, whiteSpace: "nowrap" }}>Width:</label>
          <input
            type="number"
            min={1}
            max={20}
            value={editSymWidth}
            onChange={(e) => setEditSymWidth(e.target.value)}
            style={{
              width: 50,
              padding: "3px 5px",
              background: "#FFFFFF",
              border: "1px solid #EEEEF2",
              borderRadius: 4,
              color: "#1E1E1E",
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={saveEditSymbol}
            style={{
              flex: 1,
              padding: "4px",
              background: "#DFF6DD",
              border: "1px solid #9FD89F",
              borderRadius: 4,
              color: "#107C10",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 400,
            }}
          >
            SAVE
          </button>
          <button
            onClick={cancelEditSymbol}
            style={{
              flex: 1,
              padding: "4px",
              background: "#E8E8E8",
              border: "1px solid #8A8A8A",
              borderRadius: 4,
              color: "#8A8A8A",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 400,
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    );
  }

  // Edit mode — not editing this symbol (shows drag handle + edit/delete buttons)
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        // Use a transparent drag image so the ghost doesn't flicker
        const ghost = document.createElement("div");
        ghost.style.position = "absolute";
        ghost.style.top = "-9999px";
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => document.body.removeChild(ghost), 0);
        onDragStart(index);
      }}
      onDragEnter={() => onDragEnter(index)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnd={onDragEnd}
      style={{
        marginBottom: 3,
        background: isDragOver ? "#C9DEF5" : "#E8E8E8",
        border: `1px solid ${isDragOver ? "#007ACC" : "#EEEEF2"}`,
        borderRadius: 6,
        overflowX: "auto",
        cursor: "grab",
        transition: "background 0.1s, border-color 0.1s",
        // Drop indicator: blue top border line when dragging over
        borderTop: isDragOver ? "2px solid #007ACC" : undefined,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          padding: "6px 8px",
          gap: 6,
        }}
      >
        {/* Drag handle */}
        <div
          title="Drag to reorder"
          style={{
            color: "#8A8A8A",
            fontSize: 14,
            cursor: "grab",
            flexShrink: 0,
            userSelect: "none",
            lineHeight: 1,
            paddingRight: 2,
          }}
        >
          ⠿
        </div>

        {previewDataUrl && (
          <div
            style={{
              width: 33 * (sym.width || 1),
              height: 33,
              background: "#fff",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              padding: 1,
              boxSizing: "border-box",
            }}
          >
            <img src={previewDataUrl} style={{ width: "100%", height: "100%", objectFit: "contain" }} alt="" />
          </div>
        )}
        <div
          style={{
            flexShrink: 0,
            color: "#1E1E1E",
            fontSize: 16,
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          {sym.name}
        </div>
        <div
          style={{
            flexShrink: 0,
            color: "#4B4B4B",
            fontSize: 14,
            fontWeight: 400,
            background: "#E8E8E8",
            borderRadius: 4,
            padding: "2px 6px",
            minWidth: 20,
            textAlign: "center",
          }}
        >
          {sym.width}
        </div>
        <button
          onClick={() => startEditSymbol(sym)}
          style={{
            background: "#E8E8E8",
            border: "1px solid #EEEEF2",
            borderRadius: 4,
            color: "#007ACC",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 400,
            padding: "2px 6px",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#C9DEF5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#E8E8E8")}
        >
          ✎
        </button>
        <button
          onClick={() => deleteSymbol(sym.id)}
          style={{
            background: "#FDECEA",
            border: "1px solid #F1B0B7",
            borderRadius: 4,
            color: "#C42B1C",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 400,
            padding: "2px 6px",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#FAD4D4")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#FDECEA")}
        >
          ✕
        </button>
      </div>
    </div>
  );
}