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
import { COLUMNS, INITIAL_TASKS } from "../lib/data";
import { updateTaskStatus } from "../lib/mockApi";
import { assets } from "../assets/assets";
const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState(null);
  const [rollingBackIds, setRollingBackIds] = useState(new Set());
  const [modalColumn, setModalColumn] = useState(null);

  // Ref so handleDragEnd always reads latest tasks without being in deps
  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const getTasksByColumn = (colId) => tasks.filter((t) => t.column === colId);

  // ── Drag Start ────────────────────────────────────────────
  function handleDragStart({ active }) {
    setActiveTask(tasks.find((t) => t.id === active.id) || null);
  }

  // ── Drag Over: live column switch while dragging ───────────
  function handleDragOver({ active, over }) {
    if (!over) return;

    const current = tasksRef.current;
    const draggedTask = current.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const overColumn = COLUMNS.find((c) => c.id === over.id)
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
    if (!over) return;

    const current = tasksRef.current;
    const draggedTask = current.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const overColumn = COLUMNS.find((c) => c.id === over.id)
      ? over.id
      : current.find((t) => t.id === over.id)?.column;

    if (!overColumn) return;

    // Same column reorder
    if (overColumn === draggedTask.column) {
      if (active.id !== over.id) {
        setTasks((prev) => {
          const colTasks = prev.filter((t) => t.column === draggedTask.column);
          const others = prev.filter((t) => t.column !== draggedTask.column);
          const oldIdx = colTasks.findIndex((t) => t.id === active.id);
          const newIdx = colTasks.findIndex((t) => t.id === over.id);
          return [...others, ...arrayMove(colTasks, oldIdx, newIdx)];
        });
      }
      return;
    }

    // Cross-column drop
    // Optimistic update already happened in dragOver
    // Save snapshot & original for rollback
    const snapshotTasks = [...current];
    const originalColumn = draggedTask.column;

    try {
      await updateTaskStatus(active.id, overColumn);
      toast.success("Task moved successfully!");
    } catch {
      toast.error("Failed to move task — change reverted.", {
        description: "The server encountered an error. Please try again.",
      });

      // Rollback
      setRollingBackIds((prev) => new Set(prev).add(active.id));
      setTasks(
        snapshotTasks.map((t) =>
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

  return (
    <>
      {/* Add task bar */}
      <div className="add-bar">
        <input
          type="text"
          placeholder="What needs to be done?"
          readOnly
          onClick={() => setModalColumn("todo")}
          className="add-input"
        />
        <button className="add-btn" onClick={() => setModalColumn("todo")}>
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
        <div className="board">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={getTasksByColumn(col.id)}
              rollingBackIds={rollingBackIds}
              onAddTask={setModalColumn}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div
              style={{ transform: "rotate(2deg) scale(1.05)", opacity: 0.95 }}
            >
              <TaskCard task={activeTask} isRollingBack={false} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {modalColumn && (
        <AddTaskModal
          defaultColumn={modalColumn}
          onAdd={handleAddTask}
          onClose={() => setModalColumn(null)}
        />
      )}
    </>
  );
}
