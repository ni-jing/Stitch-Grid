import { useRef, useEffect, useCallback } from "react";

const MIN_W = 220;
const MIN_H = 160;
const DEFAULT_W = 300;
const DEFAULT_H = 260;

export default function MemoPanel({ text, onChange, onClose }) {
  const panelRef = useRef(null);
  const dragState = useRef(null);
  const resizeState = useRef(null);
  const posRef = useRef(null);

  // Initialise bottom-right position once on first mount
  useEffect(() => {
    if (posRef.current) return;
    posRef.current = {
      x: window.innerWidth  - DEFAULT_W - 20,
      y: window.innerHeight - DEFAULT_H - 20,
      w: DEFAULT_W,
      h: DEFAULT_H,
    };
    applyPos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyPos() {
    const el = panelRef.current;
    if (!el || !posRef.current) return;
    const { x, y, w, h } = posRef.current;
    el.style.left   = `${x}px`;
    el.style.top    = `${y}px`;
    el.style.width  = `${w}px`;
    el.style.height = `${h}px`;
  }

  // ── Title-bar drag ──────────────────────────────────────────────────────────
  const onTitleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const { x, y } = posRef.current;
    dragState.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startX: x,
      startY: y,
    };

    function onMove(ev) {
      const dx = ev.clientX - dragState.current.startMouseX;
      const dy = ev.clientY - dragState.current.startMouseY;
      posRef.current.x = dragState.current.startX + dx;
      posRef.current.y = dragState.current.startY + dy;
      applyPos();
    }
    function onUp() {
      dragState.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
  }, []);

  // ── Corner resize (bottom-right) ────────────────────────────────────────────
  const onResizeMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const { w, h } = posRef.current;
    resizeState.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startW: w,
      startH: h,
    };

    function onMove(ev) {
      const dx = ev.clientX - resizeState.current.startMouseX;
      const dy = ev.clientY - resizeState.current.startMouseY;
      posRef.current.w = Math.max(MIN_W, resizeState.current.startW + dx);
      posRef.current.h = Math.max(MIN_H, resizeState.current.startH + dy);
      applyPos();
    }
    function onUp() {
      resizeState.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
  }, []);

  return (
    <div
      ref={panelRef}
      style={{
        position:      "fixed",
        zIndex:        200,
        display:       "flex",
        flexDirection: "column",
        background:    "#E7E8EC",
        border:        "1px solid #EEEEF2",
        borderRadius:  8,
        boxShadow:     "0 8px 32px rgba(0,0,0,0.65)",
        overflow:      "hidden",
        minWidth:      MIN_W,
        minHeight:     MIN_H,
        // left / top / width / height set imperatively by applyPos()
      }}
    >
      {/* ── Title bar ── */}
      <div
        onMouseDown={onTitleMouseDown}
        style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "space-between",
          padding:         "5px 10px",
          background:      "#E7E8EC",
          borderBottom:    "1px solid #EEEEF2",
          cursor:          "grab",
          userSelect:      "none",
          flexShrink:      0,
        }}
      >
        <span style={{
          fontSize:      13,
          fontWeight: 400,
          color:         "#007ACC",
          fontFamily:    "Arial, sans-serif",
          letterSpacing: "0.08em",
        }}>
          MEMO
        </span>
        <button
          onMouseDown={(e) => e.stopPropagation()} // don't start drag on close click
          onClick={onClose}
          title="Close memo"
          style={{
            background:  "none",
            border:      "none",
            color:       "#8A8A8A",
            cursor:      "pointer",
            fontSize:    15,
            lineHeight:  1,
            padding:     "0 2px",
            display:     "flex",
            alignItems:  "center",
            fontFamily:  "inherit",
            transition:  "color 0.12s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#C42B1C"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#8A8A8A"; }}
        >
          ✕
        </button>
      </div>

      {/* ── Textarea ── */}
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your notes here…"
        spellCheck
        style={{
          flex:        1,
          resize:      "none",        // resizing via corner grip below
          border:      "none",
          outline:     "none",
          background:  "#FFFFFF",
          color:       "#1E1E1E",
          fontFamily:  "Arial, sans-serif",
          fontSize:    13,
          lineHeight:  1.65,
          padding:     "10px 12px",
          overflowY:   "auto",
        }}
      />

      {/* ── Resize grip (bottom-right corner) ── */}
      <div
        onMouseDown={onResizeMouseDown}
        title="Drag to resize"
        style={{
          position: "absolute",
          bottom:   0,
          right:    0,
          width:    16,
          height:   16,
          cursor:   "nwse-resize",
          // two subtle diagonal lines matching the app's #EEEEF2 border tone
          background: `linear-gradient(
            135deg,
            transparent 0%,   transparent 38%,
            #EEEEF2    38%,   #EEEEF2    50%,
            transparent 50%,  transparent 60%,
            #EEEEF2    60%,   #EEEEF2    72%,
            transparent 72%
          )`,
        }}
      />
    </div>
  );
}