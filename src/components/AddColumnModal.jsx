import { useState, useEffect } from "react";
import { assets } from "../assets/assets";

export default function AddColumnModal({ onAdd, onClose }) {
  const [name, setName] = useState("");

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd(name.trim());
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Column</h2>
          <button className="modal-close" onClick={onClose}>
            <assets.CloseIcon />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Column Name</label>
            <textarea
              autoFocus
              rows={1}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSubmit())}
              placeholder="e.g. In Review, QA Testing..."
            />
          </div>

          <button
            className="modal-submit"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
  );
}
