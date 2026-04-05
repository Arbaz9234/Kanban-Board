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

      <div className="card-header flex items-center justify-between mb-[10px]">
        <span className={`priority-badge ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
        {/* <button className="card-menu">···</button> */}
      </div>

      <p className="card-title text-[13px] font-medium text-white/90 leading-[1.5] mb-[14px]">
        {task.title}
      </p>

      <div className="card-footer flex items-center justify-between">
        <div className="card-meta flex items-center gap-3">
          <span className="meta-item flex items-center gap-1 text-white/30 text-[11px]">
            <assets.CalendarIcon />
            {task.date}
          </span>
          <span className="meta-item flex items-center gap-1 text-white/30 text-[11px]">
            <assets.CommentIcon />
            {task.comments}
          </span>
        </div>
        <div className="avatar w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] flex items-center justify-center text-[9px] font-bold text-white">
          {task.avatar}
        </div>
      </div>
    </div>
  );
}
