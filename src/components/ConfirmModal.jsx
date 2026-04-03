import { useEffect } from "react";
import { assets } from "../assets/assets";

export default function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="modal confirm-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onCancel}>
            <assets.CloseIcon />
          </button>
        </div>

        <div className="modal-body">
          <p className="confirm-message">{message}</p>

          <div className="confirm-actions">
            <button className="btn-secondary confirm-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn-danger" onClick={onConfirm}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
