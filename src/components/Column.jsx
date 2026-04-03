import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { assets } from "../assets/assets";
const ICONS = {
  list: <assets.ListIcon />,
  clock: <assets.ClockIcon width={15} height={15} />,
  check: <assets.CheckIcon />,
};

export default function Column({
  column,
  tasks,
  rollingBackIds,
  onAddTask,
  onDeleteColumn,
  searchQuery,
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className={`column column-${column.id}`}>
      {/* Header */}
      <div className="column-header">
        <div className="column-title">
          <span className="column-dot" />
          <span className="column-icon">{ICONS[column.icon]}</span>
          <span className="column-name">{column.label}</span>
          <span className="column-count">{tasks.length}</span>
        </div>
        <div className="column-actions">
          <button
            className="column-add-btn"
            onClick={() => onAddTask(column.id)}
          >
            <assets.AddIcon />
          </button>
          <button
            className="column-delete-btn"
            onClick={() => onDeleteColumn(column.id)}
          >
            {/* <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <polyline points="3 6 5 6 21 6" strokeWidth={2} strokeLinecap="round" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <line x1="10" y1="11" x2="10" y2="17" strokeWidth={2} strokeLinecap="round" />
              <line x1="14" y1="11" x2="14" y2="17" strokeWidth={2} strokeLinecap="round" />
            </svg> */}
            <assets.DeleteIcon />
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`column-body ${isOver ? "drag-over" : ""}`}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <p className="empty-hint">Drop tasks here</p>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isRollingBack={rollingBackIds.has(task.id)}
                searchQuery={searchQuery}
              />
            ))
          )}
        </SortableContext>

        <button className="add-task-btn" onClick={() => onAddTask(column.id)}>
          <assets.AddIcon />
          Add New Task
        </button>
      </div>
    </div>
  );
}
