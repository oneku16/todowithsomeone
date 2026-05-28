import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  const currentUser = await requireUser();
  if (!currentUser) {
    return jsonError("Unauthorized", 401);
  }

  const users = await prisma.user.findMany({
    select: { id: true, username: true, displayName: true },
    orderBy: { displayName: "asc" },
  });

  return jsonOk({
    currentUser: users.find((u) => u.id === currentUser.userId) ?? currentUser,
    users,
  });
}
