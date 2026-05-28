import type { Category, TaskStatus } from "@/generated/prisma/client";

export const CATEGORY_LABELS: Record<Category, string> = {
  WATCH: "To Watch",
  GO: "To Go",
  DO: "To Do",
};

export const CATEGORY_STYLES: Record<
  Category,
  { badge: string; dot: string; ring: string }
> = {
  WATCH: {
    badge: "bg-violet-100 text-violet-800 border-violet-200",
    dot: "bg-violet-400",
    ring: "ring-violet-200",
  },
  GO: {
    badge: "bg-teal-100 text-teal-800 border-teal-200",
    dot: "bg-teal-400",
    ring: "ring-teal-200",
  },
  DO: {
    badge: "bg-amber-100 text-amber-900 border-amber-200",
    dot: "bg-amber-400",
    ring: "ring-amber-200",
  },
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  PENDING: "Pending",
  DONE: "Done",
};

export const CATEGORIES: Category[] = ["WATCH", "GO", "DO"];
export const STATUSES: TaskStatus[] = ["PENDING", "DONE"];
