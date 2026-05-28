import { redirect } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";
import { prisma } from "@/lib/prisma";
import { serializeTask, taskInclude } from "@/lib/tasks";
import { requireUser } from "@/lib/session";

export default async function HomePage() {
  const sessionUser = await requireUser();
  if (!sessionUser) {
    redirect("/login");
  }

  const users = await prisma.user.findMany({
    select: { id: true, username: true, displayName: true },
    orderBy: { displayName: "asc" },
  });

  const currentUser = users.find((u) => u.id === sessionUser.userId);
  if (!currentUser) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    include: taskInclude,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <Dashboard
      currentUser={currentUser}
      users={users}
      initialTasks={tasks.map(serializeTask)}
    />
  );
}
