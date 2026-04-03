import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { assets } from "../assets/assets";
const PRIORITY_STYLES = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
};

export default function TaskCard({ task, isRollingBack, searchQuery }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isRollingBack
      ? "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
      : transition,
  };

  const isMatch =
    !searchQuery ||
    task.title.toLowerCase().includes(searchQuery.toLowerCase());

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={[
        "task-card",
        isDragging ? "dragging" : "",
        isRollingBack ? "rolling-back" : "",
        searchQuery && !isMatch ? "dimmed" : "",
        searchQuery && isMatch ? "search-highlight" : "",
      ].join(" ")}
    >
      {isRollingBack && <div className="rollback-overlay" />}

      <div className="card-header">
        <span className={`priority-badge ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
        {/* <button className="card-menu">···</button> */}
      </div>

      <p className="card-title">{task.title}</p>

      <div className="card-footer">
        <div className="card-meta">
          <span className="meta-item">
            <assets.CalendarIcon />
            {task.date}
          </span>
          <span className="meta-item">
            <assets.CommentIcon />
            {task.comments}
          </span>
        </div>
        <div className="avatar">{task.avatar}</div>
      </div>
    </div>
  );
}
