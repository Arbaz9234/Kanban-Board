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

export default function Column({ column, tasks, rollingBackIds, onAddTask }) {
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
        <button className="column-add-btn" onClick={() => onAddTask(column.id)}>
          <assets.AddIcon />
        </button>
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
