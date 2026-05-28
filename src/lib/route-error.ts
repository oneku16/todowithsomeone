import { jsonError } from "@/lib/api";

function getPrismaCode(error: unknown): string | null {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return null;
  }
  return String((error as { code: unknown }).code);
}

export function handleRouteError(scope: string, error: unknown) {
  console.error(scope, error);

  const code = getPrismaCode(error);
  if (code === "P2003") {
    return jsonError(
      "Invalid assignee or your session is out of date. Log out and sign in again.",
      400,
    );
  }
  if (code === "P2021" || code === "P2010") {
    return jsonError(
      "Database schema is missing on Turso. Apply prisma/migrations/* to your Turso database.",
      500,
    );
  }
  if (code === "SQLITE_CANTOPEN") {
    return jsonError(
      "Database is not configured for Vercel. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.",
      500,
    );
  }

  return jsonError("Something went wrong", 500);
}
