import { useState } from "react";
import { Toaster } from "sonner";
import KanbanBoard from "./components/KanbanBoard";
import { assets } from "./assets/assets";

export default function App() {
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="navbar sticky top-0 z-40 bg-[#0d0d16d9] backdrop-blur-[12px] border-b border-white/10">
        <div className="nav-inner max-w-[1280px] mx-auto px-6 h-[56px] flex items-center justify-between">
          <div className="nav-left flex items-center gap-8">
            <div className="nav-logo flex items-center gap-[10px]">
              <div className="logo-icon w-7 h-7 rounded-lg bg-[#4424e0] flex items-center justify-center">
                <assets.Logo width={18} height={18} />
              </div>
              <span className="logo-text font-bold text-[15px] tracking-[-0.3px]">
                Kanban Board
              </span>
            </div>
            <div
              className={`nav-links flex items-center gap-[2px] ${menuOpen ? "open" : ""}`}
            >
              {["Board", "Analytics", "Team", "Settings"].map((item) => (
                <button
                  key={item}
                  className={`nav-link ${item === "Board" ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="nav-right flex items-center gap-3">
            <div className="search-box flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-[7px] text-white/30 text-xs w-[220px] transition-all duration-150">
              <assets.SearchIcon />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button
                  className="search-clear"
                  onClick={() => setSearchQuery("")}
                >
                  <assets.CloseIcon />
                </button>
              )}
            </div>
            <div className="user-avatar w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] flex items-center justify-center text-[11px] font-bold text-white cursor-pointer select-none">
              AT
            </div>
            <button
              className="hamburger"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
              <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
              <span className={`hamburger-line ${menuOpen ? "open" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="main flex-1 max-w-[1280px] mx-auto px-6 py-8 w-full">
        {/* Page header */}
        <div className="page-header flex items-start justify-between mb-7">
          <div className="breadcrumb-wrapper">
            <p className="breadcrumb text-[11px] font-semibold tracking-[0.08em] text-white/30 mb-1">
              PROJECTS /{" "}
              <span className="breadcrumb-active text-purple-400">
                FLOW AUTOMATE
              </span>
            </p>
            <h1 className="page-title text-[22px] font-bold">Project Sprint</h1>
          </div>
          <div className="header-actions flex gap-2">
            <button
              className="btn-secondary"
              onClick={() => setShowHistory(true)}
            >
              <assets.ClockIcon />
              History
            </button>
            <button
              className="btn-primary"
              onClick={() => setShowAddColumn(true)}
            >
              <assets.AddIcon />
              New Column
            </button>
          </div>
        </div>

        {/* Board */}
        <KanbanBoard
          searchQuery={searchQuery}
          showAddColumn={showAddColumn}
          onCloseAddColumn={() => setShowAddColumn(false)}
          showHistory={showHistory}
          onCloseHistory={() => setShowHistory(false)}
        />
      </div>

      {/* Footer */}
      <footer className="footer border-t border-white/5 mt-auto">
        <div className="footer-inner max-w-[1280px] mx-auto px-6 py-[14px] flex items-center justify-between">
          <div className="footer-left">
            <span>~ Arbaz Tahir</span>
          </div>
          <div className="footer-right">
            <span>Privacy Policy</span>
            <span>Documentation</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </footer>

      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: "#1e1e2e",
            border: "1px solid #ffffff14",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}
