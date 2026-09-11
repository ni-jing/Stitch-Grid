import { useState } from "react";
import { svgToDataUrl } from "../../utils/svgUtils";

// Mirrors TopBar.jsx's ICON_PATHS/MenuIcon convention: raw path data + a
// tiny local renderer, kept in the file that uses it rather than a shared
// icon module. (chevRight duplicates TopBar's own ICON_PATHS.chevRight —
// same precedent as that file having its own independent copy.)
const CHEV_RIGHT_PATH =
  "M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z";
const FOLDER_PATH =
  "M14.5 3H7.71l-.85-.85L6.51 2h-5l-.5.5v11l.5.5h13l.5-.5v-10L14.5 3zm-.51 8.49V13h-12V7h4.49l.35-.15.86-.86H14v1.5l-.01 4zm0-6.49h-6.5l-.35.15-.86.86H2v-3h4.29l.85.85.36.15H14l-.01.99z";

function Icon({ d, size = 14, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <path fillRule="evenodd" clipRule="evenodd" d={d} fill={color} />
    </svg>
  );
}

/** Count total files in a tree node recursively */
function countFiles(node) {
  let count = (node.__files || []).length;
  for (const key of Object.keys(node)) {
    if (key === "__files") continue;
    count += countFiles(node[key]);
  }
  return count;
}

/** Capitalize folder name for display */
function folderLabel(name) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Single file row inside the tree */
function DirFileRow({ item, symbols, addFromDirectory, removeFromDirectory, isCustom, depth }) {
  const alreadyAdded = symbols.some((s) => s.svgContent === item.svgContent);
  return (
    <div
      style={{
        marginLeft: (depth + 1) * 10,
        marginBottom: 2,
        background: "#E8E8E8",
        border: "1px solid #EEEEF2",
        borderRadius: 4,
        overflowX: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          padding: "4px 6px",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 36 * (item.defaultWidth || 1),
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
          <img
            src={svgToDataUrl(item.svgContent)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            alt=""
          />
        </div>
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              color: "#4B4B4B",
              fontSize: 16,
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}
          >
            {item.name}
          </div>
          <div style={{ color: "#8A8A8A", fontSize: 12 }}>{item.defaultWidth}W</div>
        </div>
        <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
          {isCustom && (
            <button
              onClick={() => removeFromDirectory(item.id)}
              style={{
                background: "#FDECEA",
                border: "1px solid #FAD4D4",
                borderRadius: 3,
                color: "#C42B1C",
                cursor: "pointer",
                fontSize: 12,
                padding: "2px 6px",
                fontWeight: 400,
              }}
            >
              ✕
            </button>
          )}
          <button
            onClick={() => addFromDirectory(item)}
            disabled={alreadyAdded}
            style={{
              background: alreadyAdded ? "#EDF2ED" : "#DFF6DD",
              border: `1px solid ${alreadyAdded ? "#D3DBD3" : "#9FD89F"}`,
              borderRadius: 3,
              color: alreadyAdded ? "#7A9A7A" : "#107C10",
              cursor: alreadyAdded ? "default" : "pointer",
              fontSize: 12,
              padding: "2px 7px",
              fontWeight: 400,
            }}
          >
            {alreadyAdded ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Recursive collapsible tree node.
 * Each node has { __files: [...items], subfolderA: {...}, subfolderB: {...} }
 */
function TreeNode({
  node,
  label,
  depth,
  defaultOpen,
  symbols,
  addFromDirectory,
  removeFromDirectory,
  isCustomTree,
}) {
  const [open, setOpen] = useState(defaultOpen ?? depth === 0);

  const subfolders = Object.keys(node).filter((k) => k !== "__files");
  const files = node.__files || [];

  if (subfolders.length === 0 && files.length === 0) return null;

  return (
    <div style={{ marginLeft: depth > 0 ? 8 : 0 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          width: "100%",
          padding: "4px 6px",
          marginBottom: 1,
          background: "transparent",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          color: depth === 0 ? "#4B4B4B" : "#8A8A8A",
          fontSize: depth === 0 ? 14 : 13,
          fontWeight: 400,
          fontFamily: "inherit",
          letterSpacing: depth === 0 ? 0.5 : 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#C9DEF5")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 12,
            transition: "transform 0.15s",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <Icon d={CHEV_RIGHT_PATH} size={10} color="#8A8A8A" />
        </span>
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          <Icon d={FOLDER_PATH} size={14} color="#8A8A8A" />
        </span>
        {label}
        <span style={{ color: "#8A8A8A", fontSize: 11, fontWeight: 400, marginLeft: 2 }}>
          ({countFiles(node)})
        </span>
      </button>

      {open && (
        <div>
          {subfolders.sort().map((key) => (
            <TreeNode
              key={key}
              node={node[key]}
              label={folderLabel(key)}
              depth={depth + 1}
              symbols={symbols}
              addFromDirectory={addFromDirectory}
              removeFromDirectory={removeFromDirectory}
              isCustomTree={isCustomTree}
            />
          ))}

          {files.map((item) => (
            <DirFileRow
              key={item.id}
              item={item}
              symbols={symbols}
              addFromDirectory={addFromDirectory}
              removeFromDirectory={removeFromDirectory}
              isCustom={isCustomTree}
              depth={depth}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DirectoryPanel({
  svgTree,
  customDirectoryTree,
  dirFileInputRef,
  handleDirSvgUpload,
  addFromDirectory,
  removeFromDirectory,
  symbols,
}) {
  const hasCustomContent = customDirectoryTree.__files.length > 0 ||
    Object.keys(customDirectoryTree).filter((k) => k !== "__files").length > 0;

  return (
    <div
      style={{
        borderBottom: "1px solid #EEEEF2",
        background: "#E8E8E8",
        flexShrink: 0,
        maxHeight: 360,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ padding: "8px 8px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ color: "#007ACC", fontSize: 13, fontWeight: 400, letterSpacing: 1 }}>SVG DIRECTORY</div>
        <button
          onClick={() => dirFileInputRef.current?.click()}
          style={{
            background: "#EEEEF2",
            border: "1px solid #EEEEF2",
            borderRadius: 4,
            color: "#007ACC",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 400,
            padding: "3px 10px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#C9DEF5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#EEEEF2")}
        >
          + ADD SVG
        </button>
        <input
          ref={dirFileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          multiple
          style={{ display: "none" }}
          onChange={handleDirSvgUpload}
        />
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "2px 4px 8px" }}>
        {/* Built-in SVGs from src/assets/svgs/ */}
        <TreeNode
          node={svgTree}
          label="Built-in"
          depth={0}
          defaultOpen={true}
          symbols={symbols}
          addFromDirectory={addFromDirectory}
          removeFromDirectory={removeFromDirectory}
          isCustomTree={false}
        />
        {/* Custom uploads (runtime) */}
        {hasCustomContent && (
          <TreeNode
            node={customDirectoryTree}
            label="Custom Uploads"
            depth={0}
            defaultOpen={true}
            symbols={symbols}
            addFromDirectory={addFromDirectory}
            removeFromDirectory={removeFromDirectory}
            isCustomTree={true}
          />
        )}
      </div>
    </div>
  );
}