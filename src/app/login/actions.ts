"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { loginSchema } from "@/lib/validations";

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect(
      `/login?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid input")}`,
    );
  }

  const { username, password } = parsed.data;
  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!user) {
    redirect(
      `/login?error=${encodeURIComponent("Invalid username or password")}`,
    );
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    redirect(
      `/login?error=${encodeURIComponent("Invalid username or password")}`,
    );
  }

  const session = await getSession();
  session.user = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
  };
  await session.save();

  redirect("/");
}
