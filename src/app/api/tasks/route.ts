import type { Category, TaskStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { createTaskSchema } from "@/lib/validations";
import { jsonError, jsonOk } from "@/lib/api";
import { serializeTask, taskInclude } from "@/lib/tasks";

export async function GET(request: Request) {
  const currentUser = await requireUser();
  if (!currentUser) {
    return jsonError("Unauthorized", 401);
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as Category | null;
  const status = searchParams.get("status") as TaskStatus | null;

  const where: {
    category?: Category;
    status?: TaskStatus;
  } = {};

  if (category && ["WATCH", "GO", "DO"].includes(category)) {
    where.category = category;
  }
  if (status && ["PENDING", "DONE"].includes(status)) {
    where.status = status;
  }

  const tasks = await prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return jsonOk({ tasks: tasks.map(serializeTask) });
}

export async function POST(request: Request) {
  const currentUser = await requireUser();
  if (!currentUser) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const { title, description, category, assignedToId, dueDate } = parsed.data;

    const assignee = await prisma.user.findUnique({ where: { id: assignedToId } });
    if (!assignee) {
      return jsonError("Invalid assignee");
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        category,
        assignedById: currentUser.userId,
        assignedToId,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: taskInclude,
    });

    return jsonOk({ task: serializeTask(task) }, 201);
  } catch {
    return jsonError("Something went wrong", 500);
  }
}
