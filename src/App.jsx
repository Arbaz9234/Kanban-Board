import { Toaster } from "sonner";
import KanbanBoard from "./components/KanbanBoard";
import { assets } from "./assets/assets";

export default function App() {
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
            <div className="nav-links">
              {["Board", "Analytics", "Team", "Settings"].map((item) => (
                <button
                  key={item}
                  className={`nav-link ${item === "Board" ? "active" : ""}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="nav-right">
            <div className="search-box">
              <assets.SearchIcon />
              <span>Search tasks...</span>
            </div>
            <div className="user-avatar">JD</div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="main">
        {/* Page header */}
        <div className="page-header">
          <div>
            <p className="breadcrumb">
              PROJECTS /{" "}
              <span className="breadcrumb-active">ZENITH CORE PLATFORM</span>
            </p>
            <h1 className="page-title">Project Sprint Kanban</h1>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">
              <assets.ClockIcon />
              History
            </button>
            <button className="btn-primary">
              <assets.AddIcon />
              New Column
            </button>
          </div>
        </div>

        {/* Board */}
        <KanbanBoard />
      </main>

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
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}
