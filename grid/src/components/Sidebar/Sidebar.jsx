import { useState, useRef } from "react";
import DirectoryPanel from "./DirectoryPanel";
import AddSymbolForm from "./AddSymbolForm";
import SymbolRow from "./SymbolRow";

// Mirrors TopBar.jsx's ICON_PATHS/MenuIcon convention: raw path data + a
// tiny local renderer, kept in the file that uses it rather than a shared
// icon module. (chevLeft/folder duplicate TopBar's/DirectoryPanel's own
// copies — same precedent as those files each keeping an independent copy.)
const CHEV_LEFT_PATH =
  "M5.928 7.976l4.357 4.357-.618.62L5 8.284v-.618L9.667 3l.618.619-4.357 4.357z";
const CHEV_RIGHT_PATH =
  "M10.072 8.024L5.715 3.667l.618-.62L11 7.716v.618L6.333 13l-.618-.619 4.357-4.357z";
// Activity bar icons.
const SYMBOL_PATH =
  "M4 6h8v1H4V6zm8 3H4v1h8V9zM1 4l1-1h12l1 1v8l-1 1H2l-1-1V4zm1 0v8h12V4H2z";
const SYMBOL_GROUP_PATH =
  "M7 3l1-1h6l1 1v5l-1 1h-4V8h4V3H8v3H7V3zm2 6V8L8 7H2L1 8v5l1 1h6l1-1V9zM8 8v5H2V8h6zm1.414-1L9 6.586V6h4v1H9.414zM9 4h4v1H9V4zm-2 6H3v1h4v-1z";
const FOLDER_OPEN_PATH =
  "M1.5 14h11l.48-.37 2.63-7-.48-.63H14V3.5l-.5-.5H7.71l-.86-.85L6.5 2h-5l-.5.5v11l.5.5zM2 3h4.29l.86.85.35.15H13v2H8.5l-.35.15-.86.85H3.5l-.47.34-1 3.08L2 3zm10.13 10H2.19l1.67-5H7.5l.35-.15.86-.85h5.79l-2.37 6z";
// File-tree row icon (Files section, opened Gridmark .json files). Native
// viewBox is 32x32, unlike the other icons here, so it gets its own tiny
// renderer (FileGridIcon) instead of going through Icon's 16x16 assumption.
const FILE_GRID_ICON_PATH =
  "M1.2 0L12.8 0L14 1.2L14 12.8L12.8 14L1.2 14L0 12.8L0 1.2ZM2.2 2.2L11.8 2.2L11.8 11.8L2.2 11.8ZM19.2 0L30.8 0L32 1.2L32 12.8L30.8 14L19.2 14L18 12.8L18 1.2ZM20.2 2.2L29.8 2.2L29.8 11.8L20.2 11.8ZM1.2 18L12.8 18L14 19.2L14 30.8L12.8 32L1.2 32L0 30.8L0 19.2ZM2.2 20.2L11.8 20.2L11.8 29.8L2.2 29.8ZM19.2 18L30.8 18L32 19.2L32 30.8L30.8 32L19.2 32L18 30.8L18 19.2ZM20.2 20.2L29.8 20.2L29.8 29.8L20.2 29.8Z";

function FileGridIcon({ size = 13, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
      <path fillRule="evenodd" clipRule="evenodd" d={FILE_GRID_ICON_PATH} fill={color} />
    </svg>
  );
}

function Icon({ d, size = 14, color = "currentColor" }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <path fillRule="evenodd" clipRule="evenodd" d={d} fill={color} />
    </svg>
  );
}

/** One icon button in the activity bar (Symbols / Groups / Files) */
function ActivityBarButton({ d, active, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 28,
        height: 28,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "#DCEEFB" : "transparent",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#C9DEF5"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <Icon d={d} size={17} color={active ? "#007ACC" : "#8A8A8A"} />
    </button>
  );
}

/** One saved group under the "Groups" section — click to paste into the current selection */
function GroupRow({
  group,
  isEditing,
  editName,
  setEditName,
  onStartRename,
  onCommitRename,
  onCancelRename,
  onPaste,
  onDelete,
  disabled,
}) {
  if (isEditing) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "5px 6px",
          marginBottom: 2,
          background: "#E8E8E8",
          border: "1px solid #007ACC",
          borderRadius: 6,
        }}
      >
        <input
          autoFocus
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onCommitRename();
            if (e.key === "Escape") onCancelRename();
          }}
          style={{
            flex: 1,
            padding: "4px 6px",
            background: "#FFFFFF",
            border: "1px solid #EEEEF2",
            borderRadius: 4,
            color: "#1E1E1E",
            fontSize: 12,
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <button
          onClick={onCommitRename}
          style={{
            background: "#DFF6DD", border: "1px solid #9FD89F", borderRadius: 4,
            color: "#107C10", cursor: "pointer", fontSize: 11, padding: "3px 7px",
          }}
        >
          SAVE
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 6px",
        marginBottom: 2,
        background: "#E8E8E8",
        border: "1px solid #EEEEF2",
        borderRadius: 6,
      }}
    >
      <button
        onClick={onPaste}
        disabled={disabled}
        title={disabled ? "Select cells first, then click to paste this group" : "Paste this group into the selected cells"}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "2px 4px",
          background: "transparent",
          border: "none",
          textAlign: "left",
          cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.5 : 1,
          color: "#1E1E1E",
          fontSize: 13,
          fontFamily: "inherit",
        }}
      >
        <Icon d={SYMBOL_GROUP_PATH} size={14} color="#8A8A8A" />
        {group.name}
      </button>
      <button
        onClick={onStartRename}
        style={{
          background: "#E8E8E8", border: "1px solid #EEEEF2", borderRadius: 4,
          color: "#007ACC", cursor: "pointer", fontSize: 11, padding: "2px 6px", flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#C9DEF5")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#E8E8E8")}
      >
        ✎
      </button>
      <button
        onClick={onDelete}
        style={{
          background: "#FDECEA", border: "1px solid #F1B0B7", borderRadius: 4,
          color: "#C42B1C", cursor: "pointer", fontSize: 11, padding: "2px 6px", flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#FAD4D4")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#FDECEA")}
      >
        ✕
      </button>
    </div>
  );
}

/** Count total files in a folder-tree node recursively (mirrors DirectoryPanel's countFiles) */
function countTreeFiles(node) {
  let count = (node.__files || []).length;
  for (const key of Object.keys(node)) {
    if (key === "__files") continue;
    count += countTreeFiles(node[key]);
  }
  return count;
}

/** Capitalize a raw folder name for display (mirrors DirectoryPanel's folderLabel) */
function folderNodeLabel(name) {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * One .json file row in the local-folder tree — click to open it onto the
 * grid. `depth` is the nesting depth of the *folder this file lives in*
 * (0 for root-level files and files one level inside a top-level folder),
 * used only to pad the row's own content over — the highlighted background
 * itself always spans the full width of the sidebar's content area, no
 * outline, just a filled rectangle.
 */
function FileTreeFileRow({ item, depth, isOpen, onOpen }) {
  return (
    <button
      onClick={() => onOpen(item)}
      title={item.name}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        width: "100%",
        boxSizing: "border-box",
        padding: `6px 10px 6px ${20 + depth * 14}px`,
        marginBottom: 1,
        background: isOpen ? "#DCEEFB" : "transparent",
        border: "none",
        borderRadius: 4,
        color: isOpen ? "#007ACC" : "#4B4B4B",
        cursor: "pointer",
        fontSize: 13,
        fontFamily: "inherit",
        textAlign: "left",
      }}
      onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "#C9DEF5"; }}
      onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}
    >
      <FileGridIcon size={13} color={isOpen ? "#007ACC" : "#8A8A8A"} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {item.name.replace(/\.json$/i, "")}
      </span>
    </button>
  );
}

/**
 * Recursive collapsible folder node for the local-folder browser.
 * Mirrors DirectoryPanel.jsx's TreeNode, adapted so leaves open a file onto
 * the grid instead of adding a symbol.
 */
function FileTreeNode({ node, label, depth, defaultOpen, openFileId, onOpenFile }) {
  const [open, setOpen] = useState(defaultOpen ?? depth === 0);
  const subfolders = Object.keys(node).filter((k) => k !== "__files");
  const files = node.__files || [];

  if (subfolders.length === 0 && files.length === 0) return null;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          width: "100%",
          boxSizing: "border-box",
          padding: `4px 6px 4px ${6 + depth * 14}px`,
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
          <Icon d={FOLDER_OPEN_PATH} size={13} color="#8A8A8A" />
        </span>
        {label}
        <span style={{ color: "#8A8A8A", fontSize: 11, fontWeight: 400, marginLeft: 2 }}>
          ({countTreeFiles(node)})
        </span>
      </button>

      {open && (
        <div>
          {subfolders.sort().map((key) => (
            <FileTreeNode
              key={key}
              node={node[key]}
              label={folderNodeLabel(key)}
              depth={depth + 1}
              openFileId={openFileId}
              onOpenFile={onOpenFile}
            />
          ))}
          {files.map((item) => (
            <FileTreeFileRow key={item.id} item={item} depth={depth} isOpen={openFileId === item.id} onOpen={onOpenFile} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Renders the root folder's direct children with no wrapping header row (the folder name + Change/Close controls are already shown above this in the Files section). */
function FileTreeRootChildren({ node, openFileId, onOpenFile }) {
  const subfolders = Object.keys(node).filter((k) => k !== "__files");
  const files = node.__files || [];

  if (subfolders.length === 0 && files.length === 0) {
    return (
      <div style={{ color: "#8A8A8A", fontSize: 13, padding: "8px 2px", lineHeight: 1.5 }}>
        No .json files found in this folder.
      </div>
    );
  }

  return (
    <div>
      {subfolders.sort().map((key) => (
        <FileTreeNode
          key={key}
          node={node[key]}
          label={folderNodeLabel(key)}
          depth={0}
          openFileId={openFileId}
          onOpenFile={onOpenFile}
        />
      ))}
      {files.map((item) => (
        <FileTreeFileRow key={item.id} item={item} depth={0} isOpen={openFileId === item.id} onOpen={onOpenFile} />
      ))}
    </div>
  );
}

export default function Sidebar({
  // symbols
  symbols,
  reorderSymbols,
  showEditSymbols,
  setShowEditSymbols,
  newSymName,
  setNewSymName,
  newSymWidth,
  setNewSymWidth,
  newSymSvg,
  addError,
  fileInputRef,
  handleSvgFileChange,
  addSymbol,
  deleteSymbol,
  placeSymbol,
  // edit symbol
  editingSymbolId,
  editSymName,
  setEditSymName,
  editSymWidth,
  setEditSymWidth,
  startEditSymbol,
  saveEditSymbol,
  cancelEditSymbol,
  // directory
  showDirectory,
  setShowDirectory,
  svgTree,
  customDirectoryTree,
  dirFileInputRef,
  handleDirSvgUpload,
  addFromDirectory,
  removeFromDirectory,
  // groups — saved via TopBar's Edit → Group; wired through App.jsx/useGridState.js.
  groups = [],
  pasteGroupAtSelection,
  deleteGroup,
  renameGroup,
  // selection context (needed for place-symbol + group paste)
  selected,
  setSelected,
  moveMode,
  // local folder browser (Files section) — wired through App.jsx/useGridState.js.
  fileSystemApiSupported,
  folderTree,
  folderName,
  openFolder,
  closeFolder,
  openFileFromTree,
  openFileId,
  folderError,
}) {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [collapsed, setCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  // Which activity-bar section is showing: "symbols" | "groups" | "files".
  // "files" is a placeholder — opening/browsing a local folder isn't wired
  // up yet, see the note in that section below.
  const [activeSection, setActiveSection] = useState("symbols");
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState("");

  // Drag-to-reorder state
  const dragIndexRef = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (index) => {
    dragIndexRef.current = index;
  };

  const handleDragEnter = (index) => {
    if (dragIndexRef.current === null) return;
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (
      dragIndexRef.current !== null &&
      dragOverIndex !== null &&
      dragIndexRef.current !== dragOverIndex
    ) {
      reorderSymbols(dragIndexRef.current, dragOverIndex);
    }
    dragIndexRef.current = null;
    setDragOverIndex(null);
  };

  const handleResizeStart = (e) => {
    if (collapsed) return;
    e.preventDefault();
    const startX = e.clientX;
    const startW = sidebarWidth;
    setIsResizing(true);
    const prevCursor = document.body.style.cursor;
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const onMove = (ev) => {
      const newW = Math.max(180, Math.min(500, startW + ev.clientX - startX));
      setSidebarWidth(newW);
    };
    const onUp = () => {
      setIsResizing(false);
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevUserSelect;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const COLLAPSED_WIDTH = 56;

  // Which of the three "Symbols" section views is active. Reuses the
  // existing showDirectory/showEditSymbols props (unchanged upstream
  // contract) — the plain list is just the state where both are false.
  const activeView = showDirectory ? "directory" : showEditSymbols ? "edit" : "symbols";

  const toggleDirectory = () => {
    setShowDirectory((v) => !v);
    if (showEditSymbols) setShowEditSymbols(false);
  };
  const toggleEdit = () => {
    setShowEditSymbols((v) => !v);
    if (showDirectory) setShowDirectory(false);
    cancelEditSymbol();
  };

  const hasSelection = !!selected && selected.size > 0;

  const startRenameGroup = (g) => {
    setEditingGroupId(g.id);
    setEditGroupName(g.name);
  };
  const commitRenameGroup = () => {
    if (editingGroupId) renameGroup?.(editingGroupId, editGroupName.trim() || "group");
    setEditingGroupId(null);
  };
  const cancelRenameGroup = () => setEditingGroupId(null);

  return (
    <div
      style={{
        width: collapsed ? COLLAPSED_WIDTH : sidebarWidth,
        flexShrink: 0,
        background: "#F3F3F3",
        borderRight: "1px solid #EEEEF2",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
        overflow: "hidden",
        position: "relative",
        paddingTop: 50,
        transition: isResizing ? "none" : "width 0.18s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Resize handle — hidden when collapsed */}
      {!collapsed && (
        <div
          onMouseDown={handleResizeStart}
          style={{
            position: "absolute", top: 0, right: 0, width: 5, height: "100%",
            cursor: "col-resize", zIndex: 20, background: "transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(196,43,28,0.3)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        />
      )}

      {/* Header — title + collapse arrow */}
      {!collapsed && (
        <div
          style={{
            paddingTop: 8,
            paddingRight: 12,
            paddingBottom: 10,
            paddingLeft: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ color: "#1E1E1E", fontSize: 15, fontWeight: 400, letterSpacing: 0.5 }}>
            Library
          </div>
          <button
            onClick={() => setCollapsed(true)}
            title="Collapse sidebar"
            style={{
              background: "transparent",
              border: "none",
              color: "#8A8A8A",
              cursor: "pointer",
              fontSize: 13,
              padding: "2px 4px",
              lineHeight: 1,
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#007ACC")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8A8A")}
          >
            <Icon d={CHEV_LEFT_PATH} size={13} color="currentColor" />
          </button>
        </div>
      )}

      {/* Activity bar + active section — hidden when collapsed */}
      {!collapsed && (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Activity bar */}
          <div
            style={{
              width: 40,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              paddingTop: 10,
              borderRight: "1px solid #EEEEF2",
            }}
          >
            <ActivityBarButton
              d={SYMBOL_PATH}
              active={activeSection === "symbols"}
              onClick={() => setActiveSection("symbols")}
              title="Symbols"
            />
            <ActivityBarButton
              d={SYMBOL_GROUP_PATH}
              active={activeSection === "groups"}
              onClick={() => setActiveSection("groups")}
              title="Groups"
            />
            <ActivityBarButton
              d={FOLDER_OPEN_PATH}
              active={activeSection === "files"}
              onClick={() => setActiveSection("files")}
              title="Files"
            />
          </div>

          {/* Active section content */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "10px" }}>
            {/* ── Symbols section ── */}
            {activeSection === "symbols" && (
              <>
                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                  <button
                    onClick={toggleDirectory}
                    style={{
                      background: showDirectory ? "#007ACC" : "#E7E8EC",
                      border: `1px solid ${showDirectory ? "#007ACC" : "#8A8A8A"}`,
                      borderRadius: 4,
                      color: showDirectory ? "#fff" : "#007ACC",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 400,
                      fontFamily: "inherit",
                      padding: "2px 6px",
                    }}
                  >
                    {showDirectory ? "CLOSE" : "DIR"}
                  </button>
                  <button
                    onClick={toggleEdit}
                    style={{
                      background: showEditSymbols ? "#C42B1C" : "#E7E8EC",
                      border: `1px solid ${showEditSymbols ? "#C42B1C" : "#8A8A8A"}`,
                      borderRadius: 4,
                      color: showEditSymbols ? "#fff" : "#007ACC",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 400,
                      fontFamily: "inherit",
                      padding: "2px 6px",
                    }}
                  >
                    {showEditSymbols ? "DONE" : "EDIT"}
                  </button>
                </div>

                {(activeView === "directory" || activeView === "edit") && (
                  <div
                    style={{
                      marginBottom: 8,
                      borderBottom: "2px solid #C9C9CC",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.10)",
                    }}
                  >
                    {activeView === "directory" && (
                      <DirectoryPanel
                        svgTree={svgTree}
                        customDirectoryTree={customDirectoryTree}
                        dirFileInputRef={dirFileInputRef}
                        handleDirSvgUpload={handleDirSvgUpload}
                        addFromDirectory={addFromDirectory}
                        removeFromDirectory={removeFromDirectory}
                        symbols={symbols}
                      />
                    )}

                    {activeView === "edit" && (
                      <AddSymbolForm
                        newSymSvg={newSymSvg}
                        newSymName={newSymName}
                        setNewSymName={setNewSymName}
                        newSymWidth={newSymWidth}
                        setNewSymWidth={setNewSymWidth}
                        addError={addError}
                        fileInputRef={fileInputRef}
                        handleSvgFileChange={handleSvgFileChange}
                        addSymbol={addSymbol}
                      />
                    )}
                  </div>
                )}

                {symbols.length === 0 && activeView === "symbols" && (
                  <div style={{ padding: "20px 8px", textAlign: "center" }}>
                    <div style={{ color: "#AAAAAA", fontSize: 22, marginBottom: 8 }}>⬙</div>
                    <div style={{ color: "#8A8A8A", fontSize: 16, lineHeight: 1.6 }}>
                      No symbols loaded
                    </div>
                    <div style={{ color: "#AAAAAA", fontSize: 16, marginTop: 4, lineHeight: 1.5 }}>
                      Open the{" "}
                      <span style={{ color: "#007ACC", fontWeight: 400, cursor: "pointer" }} onClick={toggleDirectory}>
                        DIR
                      </span>{" "}
                      for stock svgs, or use{" "}
                      <span style={{ color: "#007ACC", fontWeight: 400, cursor: "pointer" }} onClick={toggleEdit}>
                        EDIT
                      </span>{" "}
                      to add one directly
                    </div>
                  </div>
                )}

                {symbols.map((sym, index) => (
                  <SymbolRow
                    key={sym.id}
                    sym={sym}
                    index={index}
                    collapsed={false}
                    isEditMode={activeView === "edit"}
                    isEditing={editingSymbolId === sym.id}
                    editSymName={editSymName}
                    setEditSymName={setEditSymName}
                    editSymWidth={editSymWidth}
                    setEditSymWidth={setEditSymWidth}
                    startEditSymbol={startEditSymbol}
                    saveEditSymbol={saveEditSymbol}
                    cancelEditSymbol={cancelEditSymbol}
                    deleteSymbol={deleteSymbol}
                    placeSymbol={placeSymbol}
                    moveMode={moveMode}
                    isDragOver={dragOverIndex === index}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </>
            )}

            {/* ── Groups section ── */}
            {activeSection === "groups" && (
              <>
                {groups.length === 0 ? (
                  <div style={{ padding: "10px 4px", color: "#8A8A8A", fontSize: 13, lineHeight: 1.5 }}>
                    No groups saved yet. Select cells on the grid, then use Edit → Group in the top bar to save one.
                  </div>
                ) : (
                  <>
                    <div style={{ padding: "0 2px 6px", color: "#8A8A8A", fontSize: 11 }}>
                      {hasSelection
                        ? "Click a group to paste it into your selection."
                        : "Select cells first, then click a group to paste it."}
                    </div>
                    {groups.map((g) => (
                      <GroupRow
                        key={g.id}
                        group={g}
                        isEditing={editingGroupId === g.id}
                        editName={editGroupName}
                        setEditName={setEditGroupName}
                        onStartRename={() => startRenameGroup(g)}
                        onCommitRename={commitRenameGroup}
                        onCancelRename={cancelRenameGroup}
                        onPaste={() => pasteGroupAtSelection?.(g.id)}
                        onDelete={() => deleteGroup?.(g.id)}
                        disabled={!hasSelection}
                      />
                    ))}
                  </>
                )}
              </>
            )}

            {/* ── Files section ──
                Local-folder browser (File System Access API): pick a folder,
                browse its .json (Gridmark) files, click one to open it onto
                the grid. Opening reuses importGridmark with the file's own
                handle, so Save writes straight back to that same file. */}
            {activeSection === "files" && (
              <div>
                {!fileSystemApiSupported ? (
                  <div style={{ padding: "20px 8px", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                      <Icon d={FOLDER_OPEN_PATH} size={26} color="#AAAAAA" />
                    </div>
                    <div style={{ color: "#8A8A8A", fontSize: 16, lineHeight: 1.6 }}>
                      Not supported in this browser
                    </div>
                    <div style={{ color: "#AAAAAA", fontSize: 14, marginTop: 4, lineHeight: 1.5 }}>
                      Opening local folders needs a Chromium-based browser (Chrome, Edge).
                    </div>
                  </div>
                ) : !folderTree ? (
                  <div style={{ padding: "20px 8px", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                      <Icon d={FOLDER_OPEN_PATH} size={26} color="#AAAAAA" />
                    </div>
                    <div style={{ color: "#8A8A8A", fontSize: 16, lineHeight: 1.6, marginBottom: 12 }}>
                      No folder open
                    </div>
                    <button
                      onClick={openFolder}
                      style={{
                        background: "#EEEEF2",
                        border: "1px solid #EEEEF2",
                        borderRadius: 4,
                        color: "#007ACC",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 400,
                        padding: "6px 14px",
                        fontFamily: "inherit",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#C9DEF5")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#EEEEF2")}
                    >
                      + OPEN FOLDER
                    </button>
                    {folderError && (
                      <div style={{ color: "#C42B1C", fontSize: 12, marginTop: 10, lineHeight: 1.5 }}>
                        {folderError}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 6,
                        padding: "0 2px 8px",
                      }}
                    >
                      <div
                        title={folderName}
                        style={{
                          color: "#007ACC",
                          fontSize: 13,
                          fontWeight: 400,
                          letterSpacing: 0.5,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {folderName}
                      </div>
                      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        <button
                          onClick={openFolder}
                          title="Open a different folder"
                          style={{
                            background: "#EEEEF2",
                            border: "1px solid #EEEEF2",
                            borderRadius: 4,
                            color: "#007ACC",
                            cursor: "pointer",
                            fontSize: 11,
                            fontFamily: "inherit",
                            padding: "2px 6px",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#C9DEF5")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#EEEEF2")}
                        >
                          CHANGE
                        </button>
                        <button
                          onClick={closeFolder}
                          title="Close folder"
                          style={{
                            background: "#FDECEA",
                            border: "1px solid #F1B0B7",
                            borderRadius: 4,
                            color: "#C42B1C",
                            cursor: "pointer",
                            fontSize: 11,
                            fontFamily: "inherit",
                            padding: "2px 6px",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#FAD4D4")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#FDECEA")}
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {folderError && (
                      <div style={{ color: "#C42B1C", fontSize: 12, marginBottom: 8, lineHeight: 1.5 }}>
                        {folderError}
                      </div>
                    )}

                    <FileTreeRootChildren node={folderTree} openFileId={openFileId} onOpenFile={openFileFromTree} />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapsed strip — flat symbol icons only, sections hidden for space */}
      {collapsed && (
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "4px 4px" }}>
          <button
            onClick={() => setCollapsed(false)}
            title="Expand sidebar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "6px 0",
              marginBottom: 6,
              background: "transparent",
              border: "none",
              color: "#8A8A8A",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#007ACC")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8A8A")}
          >
            <Icon d={CHEV_RIGHT_PATH} size={13} color="currentColor" />
          </button>

          {symbols.map((sym, index) => (
            <SymbolRow
              key={sym.id}
              sym={sym}
              index={index}
              collapsed={true}
              isEditMode={false}
              isEditing={false}
              editSymName={editSymName}
              setEditSymName={setEditSymName}
              editSymWidth={editSymWidth}
              setEditSymWidth={setEditSymWidth}
              startEditSymbol={startEditSymbol}
              saveEditSymbol={saveEditSymbol}
              cancelEditSymbol={cancelEditSymbol}
              deleteSymbol={deleteSymbol}
              placeSymbol={placeSymbol}
              moveMode={moveMode}
              isDragOver={dragOverIndex === index}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  );
}