import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { updateTaskSchema } from "@/lib/validations";
import { jsonError, jsonOk } from "@/lib/api";
import { serializeTask, taskInclude } from "@/lib/tasks";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const currentUser = await requireUser();
  if (!currentUser) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return jsonError("Task not found", 404);
    }

    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const data = parsed.data;

    if (data.assignedToId) {
      const assignee = await prisma.user.findUnique({
        where: { id: data.assignedToId },
      });
      if (!assignee) {
        return jsonError("Invalid assignee");
      }
    }

    const nextStatus = data.status ?? existing.status;
    const completedAt =
      nextStatus === "DONE"
        ? existing.status === "DONE"
          ? existing.completedAt
          : new Date()
        : null;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        assignedToId: data.assignedToId,
        status: data.status,
        dueDate:
          data.dueDate === undefined
            ? undefined
            : data.dueDate
              ? new Date(data.dueDate)
              : null,
        completedAt,
      },
      include: taskInclude,
    });

    return jsonOk({ task: serializeTask(task) });
  } catch {
    return jsonError("Something went wrong", 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const currentUser = await requireUser();
  if (!currentUser) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return jsonError("Task not found", 404);
    }

    await prisma.task.delete({ where: { id } });
    return jsonOk({ ok: true });
  } catch {
    return jsonError("Something went wrong", 500);
  }
}
