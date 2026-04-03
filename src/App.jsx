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
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="nav-left">
            <div className="nav-logo">
              <div className="logo-icon">
                <assets.Logo width={18} height={18} />
              </div>
              <span className="logo-text">Kanban Board</span>
            </div>
            <div className={`nav-links ${menuOpen ? "open" : ""}`}>
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
          <div className="nav-right">
            <div className="search-box">
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
            <div className="user-avatar">AT</div>
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
      <div className="main">
        {/* Page header */}
        <div className="page-header">
          <div className="breadcrumb-wrapper">
            <p className="breadcrumb">
              PROJECTS /{" "}
              <span className="breadcrumb-active">FLOW AUTOMATE</span>
            </p>
            <h1 className="page-title">Project Sprint</h1>
          </div>
          <div className="header-actions">
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
      <footer className="footer">
        <div className="footer-inner">
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
