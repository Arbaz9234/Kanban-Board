import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import KanbanBoard from "./components/KanbanBoard";
import { assets } from "./assets/assets";

export default function App() {
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

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
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
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
        theme={theme}
        toastOptions={{
          style: {
            background: "var(--bg-card)",
            border: "1px solid var(--fg-8)",
            color: "var(--text)",
          },
        }}
      />
    </div>
  );
}
