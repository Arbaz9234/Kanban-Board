import { useState, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { toast } from "sonner";
import Column from "./Column";
import TaskCard from "./TaskCard";
import AddTaskModal from "./AddTaskModal";
import AddColumnModal from "./AddColumnModal";
import ConfirmModal from "./ConfirmModal";
import HistoryModal from "./HistoryModal";
import { COLUMNS, INITIAL_TASKS } from "../lib/data";
import { updateTaskStatus } from "../lib/mockApi";
import { assets } from "../assets/assets";
const measuring = {
  droppable: {
    strategy: MeasuringStrategy.BeforeDragging,
  },
};

export default function KanbanBoard({
  searchQuery,
  showAddColumn,
  onCloseAddColumn,
  showHistory,
  onCloseHistory,
}) {
  const [columns, setColumns] = useState(COLUMNS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState(null);
  const [rollingBackIds, setRollingBackIds] = useState(new Set());
  const [modalColumn, setModalColumn] = useState(null);
  const [deleteColumnId, setDeleteColumnId] = useState(null);

  // Ref so handleDragEnd always reads latest tasks without being in deps
  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  // Throttle rapid dragOver calls to prevent React 19 + dnd-kit measuring loop
  const dragOverThrottleRef = useRef(0);

  // Track original column from when drag started (not current task.column)
  const originalColumnRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const getTasksByColumn = (colId) =>
    tasks.filter((t) => t.column === colId && !t.deleted);

  // ── Drag Start ────────────────────────────────────────────
  function handleDragStart({ active }) {
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
    originalColumnRef.current = task?.column || null;
  }

  // ── Drag Over: live column switch while dragging ───────────
  function handleDragOver({ active, over }) {
    if (!over) return;

    // Throttle: max one state update per 50ms to prevent measuring loop
    const now = Date.now();
    if (now - dragOverThrottleRef.current < 50) return;
    dragOverThrottleRef.current = now;

    const current = tasksRef.current;
    const draggedTask = current.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const overColumn = columns.find((c) => c.id === over.id)
      ? over.id
      : current.find((t) => t.id === over.id)?.column;

    if (!overColumn || draggedTask.column === overColumn) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, column: overColumn } : t)),
    );
  }

  // ── Drag End: optimistic update + rollback ─────────────────
  async function handleDragEnd({ active, over }) {
    setActiveTask(null);
    const originalColumn = originalColumnRef.current;
    originalColumnRef.current = null;

    if (!over || !originalColumn) return;

    const overColumn = columns.find((c) => c.id === over.id)
      ? over.id
      : tasksRef.current.find((t) => t.id === over.id)?.column;

    if (!overColumn) return;

    // Same column — just reorder
    if (overColumn === originalColumn) {
      if (active.id !== over.id) {
        setTasks((prev) => {
          const colTasks = prev.filter((t) => t.column === originalColumn);
          const others = prev.filter((t) => t.column !== originalColumn);
          const oldIdx = colTasks.findIndex((t) => t.id === active.id);
          const newIdx = colTasks.findIndex((t) => t.id === over.id);
          return [...others, ...arrayMove(colTasks, oldIdx, newIdx)];
        });
      }
      return;
    }

    // Cross-column drop — ensure optimistic update is applied
    // (handleDragOver may have already done this, setTasks is idempotent here)
    setTasks((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, column: overColumn } : t)),
    );

    // Call mock API — rollback on failure
    try {
      await updateTaskStatus(active.id, overColumn);
      toast.success("Task moved successfully!");
    } catch {
      toast.error("Failed to move task — change reverted.", {
        description: "The server encountered an error. Please try again.",
      });

      // Rollback to the original column saved at drag start
      setRollingBackIds((prev) => new Set(prev).add(active.id));
      setTasks((prev) =>
        prev.map((t) =>
          t.id === active.id ? { ...t, column: originalColumn } : t,
        ),
      );

      setTimeout(() => {
        setRollingBackIds((prev) => {
          const next = new Set(prev);
          next.delete(active.id);
          return next;
        });
      }, 600);
    }
  }

  // ── Add Task ───────────────────────────────────────────────
  function handleAddTask({ title, priority, column }) {
    const newTask = {
      id: `task-${Date.now()}`,
      title,
      column,
      priority,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      comments: 0,
      avatar: title.slice(0, 2).toUpperCase(),
    };
    setTasks((prev) => [...prev, newTask]);
    toast.success("Task added!");
  }

  // ── Add Column ──────────────────────────────────────────────
  function handleAddColumn(name) {
    const id = name.toLowerCase().replace(/\s+/g, "-");
    if (columns.find((c) => c.id === id)) {
      toast.error("A column with that name already exists.");
      return;
    }
    setColumns((prev) => [...prev, { id, label: name, icon: "list" }]);
    toast.success("Column added!");
    onCloseAddColumn();
  }

  // ── Delete Column ───────────────────────────────────────────
  function handleConfirmDelete() {
    const colLabel =
      columns.find((c) => c.id === deleteColumnId)?.label || deleteColumnId;
    setTasks((prev) =>
      prev.map((t) =>
        t.column === deleteColumnId
          ? { ...t, deleted: true, deletedColumnLabel: colLabel }
          : t,
      ),
    );
    setColumns((prev) => prev.filter((c) => c.id !== deleteColumnId));
    setDeleteColumnId(null);
    toast.success("Column deleted!");
  }

  return (
    <>
      {/* Add task bar */}
      <div className="add-bar">
        <input
          type="text"
          placeholder={
            columns.length === 0
              ? "Please add a column first!"
              : "What needs to be done?"
          }
          readOnly
          onClick={() =>
            setModalColumn({ columnId: columns[0]?.id, fixed: false })
          }
          className="add-input"
          disabled={columns.length === 0}
        />
        <button
          className="add-btn"
          onClick={() =>
            setModalColumn({ columnId: columns[0]?.id, fixed: false })
          }
          disabled={columns.length === 0}
        >
          <assets.AddIcon />
          Add Task
        </button>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        measuring={measuring}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div
          className="board"
          style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
        >
          {columns.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={getTasksByColumn(col.id)}
              rollingBackIds={rollingBackIds}
              onAddTask={(colId) =>
                setModalColumn({ columnId: colId, fixed: true })
              }
              onDeleteColumn={setDeleteColumnId}
              searchQuery={searchQuery}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask && (
            <div style={{ transform: "scale(1.05)", opacity: 0.95 }}>
              <TaskCard task={activeTask} isRollingBack={false} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {modalColumn && (
        <AddTaskModal
          columns={columns}
          defaultColumn={modalColumn.columnId}
          fixedColumn={modalColumn.fixed}
          onAdd={handleAddTask}
          onClose={() => setModalColumn(null)}
        />
      )}

      {showAddColumn && (
        <AddColumnModal onAdd={handleAddColumn} onClose={onCloseAddColumn} />
      )}

      {showHistory && (
        <HistoryModal
          tasks={tasks}
          columns={columns}
          onClose={onCloseHistory}
        />
      )}

      {deleteColumnId &&
        (() => {
          const col = columns.find((c) => c.id === deleteColumnId);
          const taskCount = tasks.filter(
            (t) => t.column === deleteColumnId,
          ).length;
          return (
            <ConfirmModal
              title={`Delete "${col?.label}" column?`}
              message={
                taskCount > 0
                  ? `This column has ${taskCount} task${taskCount > 1 ? "s" : ""}. All tasks in this column will be permanently deleted.`
                  : "This column is empty and will be removed."
              }
              confirmLabel="Delete"
              onConfirm={handleConfirmDelete}
              onCancel={() => setDeleteColumnId(null)}
            />
          );
        })()}
    </>
  );
}
