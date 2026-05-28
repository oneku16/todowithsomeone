"use client";

import { useRouter } from "next/navigation";

export function Header({
  displayName,
  onNewTask,
}: {
  displayName: string;
  onNewTask: () => void;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#faf7f2]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
            Meer Task
          </p>
          <h1 className="text-lg font-semibold text-stone-900">
            Hi, {displayName}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewTask}
            className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700 active:scale-[0.98]"
          >
            New task
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600 transition hover:border-stone-300 hover:text-stone-900"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
