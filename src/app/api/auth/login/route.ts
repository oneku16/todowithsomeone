import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { loginSchema } from "@/lib/validations";
import { jsonError, jsonOk } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid input");
    }

    const { username, password } = parsed.data;
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!user) {
      return jsonError("Invalid username or password", 401);
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return jsonError("Invalid username or password", 401);
    }

    const session = await getSession();
    session.user = {
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
    };
    await session.save();

    return jsonOk({
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
      },
    });
  } catch {
    return jsonError("Something went wrong", 500);
  }
}
