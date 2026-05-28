import type { Prisma } from "@/generated/prisma/client";

export const taskInclude = {
  assignedBy: { select: { id: true, displayName: true, username: true } },
  assignedTo: { select: { id: true, displayName: true, username: true } },
} satisfies Prisma.TaskInclude;

export type TaskWithUsers = Prisma.TaskGetPayload<{
  include: typeof taskInclude;
}>;

export function serializeTask(task: TaskWithUsers) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.category,
    status: task.status,
    dueDate: task.dueDate?.toISOString() ?? null,
    createdAt: task.createdAt.toISOString(),
    completedAt: task.completedAt?.toISOString() ?? null,
    assignedBy: task.assignedBy,
    assignedTo: task.assignedTo,
  };
}
