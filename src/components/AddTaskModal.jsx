import { useState, useEffect } from "react";
import { COLUMNS } from "../lib/data";
import { assets } from "../assets/assets";
export default function AddTaskModal({ defaultColumn, onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [column, setColumn] = useState(defaultColumn || "todo");

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), priority, column });
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Task</h2>
          <button className="modal-close" onClick={onClose}>
            <assets.CloseIcon />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Task Title</label>
            <textarea
              autoFocus
              rows={3}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="form-group">
              <label>Column</label>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value)}
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="modal-submit"
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
