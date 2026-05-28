"use client";

import { format, isPast, isToday, parseISO } from "date-fns";
import type { Category, TaskStatus } from "@/generated/prisma/client";
import { CategoryBadge } from "./CategoryBadge";
import { CATEGORY_STYLES } from "@/lib/constants";

export type TaskItem = {
  id: string;
  title: string;
  description: string | null;
  category: Category;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
  assignedBy: { id: string; displayName: string; username: string };
  assignedTo: { id: string; displayName: string; username: string };
};

export function TaskCard({
  task,
  currentUserId,
  onToggle,
  onDelete,
  busy,
}: {
  task: TaskItem;
  currentUserId: string;
  onToggle: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  busy?: boolean;
}) {
  const isDone = task.status === "DONE";
  const ring = CATEGORY_STYLES[task.category].ring;
  const dueLabel = task.dueDate ? formatDue(task.dueDate, isDone) : null;
  const assignedLabel =
    task.assignedTo.id === currentUserId
      ? task.assignedBy.id === currentUserId
        ? "Assigned to you (self)"
        : `From ${task.assignedBy.displayName}`
      : `For ${task.assignedTo.displayName}`;

  return (
    <article
      className={`group rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
        isDone ? "border-stone-200 opacity-80" : `border-stone-200 ring-1 ${ring}`
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => onToggle(task)}
          aria-label={isDone ? "Reopen task" : "Mark as done"}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
            isDone
              ? "border-stone-400 bg-stone-400 text-white"
              : "border-stone-300 hover:border-stone-900"
          }`}
        >
          {isDone ? (
            <svg viewBox="0 0 12 12" className="h-3 w-3 fill-none stroke-current stroke-2">
              <path d="M2 6l3 3 5-5" />
            </svg>
          ) : null}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={task.category} />
            {dueLabel ? (
              <span
                className={`text-xs ${
                  dueLabel.urgent && !isDone ? "font-medium text-rose-600" : "text-stone-500"
                }`}
              >
                {dueLabel.text}
              </span>
            ) : null}
          </div>

          <h3
            className={`mt-2 text-base font-medium text-stone-900 ${
              isDone ? "line-through decoration-stone-400" : ""
            }`}
          >
            {task.title}
          </h3>

          {task.description ? (
            <p className="mt-1 text-sm leading-relaxed text-stone-600">{task.description}</p>
          ) : null}

          <p className="mt-3 text-xs text-stone-500">{assignedLabel}</p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => onDelete(task)}
          className="rounded-lg px-2 py-1 text-xs text-stone-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function formatDue(dueDate: string, isDone: boolean) {
  const date = parseISO(dueDate);
  const text = isToday(date)
    ? "Due today"
    : isPast(date)
      ? `Overdue · ${format(date, "MMM d")}`
      : `Due ${format(date, "MMM d")}`;

  return { text, urgent: !isDone && (isPast(date) || isToday(date)) };
}
