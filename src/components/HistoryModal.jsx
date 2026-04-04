import { useEffect } from "react";
import { assets } from "../assets/assets";

export default function HistoryModal({ tasks, columns, onClose }) {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const getColumnLabel = (task) =>
    task.deleted
      ? task.deletedColumnLabel || task.column
      : columns.find((c) => c.id === task.column)?.label || task.column;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal history-modal">
        <div className="modal-header">
          <h2>Task History</h2>
          <button className="modal-close" onClick={onClose}>
            <assets.CloseIcon />
          </button>
        </div>

        <div className="history-list">
          {tasks.length === 0 ? (
            <p className="history-empty">No tasks created yet.</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className={`history-item${task.deleted ? " history-deleted" : ""}`}>
                <div className="history-item-left">
                  <span className="history-avatar">{task.avatar}</span>
                  <div className="history-item-info">
                    <span className="history-title">{task.title}</span>
                    <span className="history-date">{task.date}</span>
                  </div>
                </div>
                <span className={`history-column history-col-${task.column}`}>
                  {getColumnLabel(task)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
