import { useDroppable, useDndContext } from "@dnd-kit/core";
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
  const { over } = useDndContext();

  const isOverTaskInColumn = tasks.some((t) => t.id === over?.id);
  const isDragOver = isOver || isOverTaskInColumn;

  return (
    <div className={`column flex flex-col gap-3 column-${column.id}`}>
      {/* Header */}
      <div className="column-header flex items-center justify-between px-1">
        <div className="column-title flex items-center gap-2">
          <span className="column-dot w-2 h-2 rounded-full shrink-0 bg-white/40" />
          <span className="column-icon text-white/40">
            {ICONS[column.icon]}
          </span>
          <span className="column-name text-[13px] font-semibold text-white/90">
            {column.label}
          </span>
          <span className="column-count text-[11px] font-bold px-2 py-[2px] rounded-full bg-white/10 text-white/50 border border-white/10">
            {tasks.length}
          </span>
        </div>
        <div className="column-actions flex items-center gap-[2px]">
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
            <assets.DeleteIcon />
          </button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`column-body ${isDragOver ? "drag-over" : ""}`}
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

