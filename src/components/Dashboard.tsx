"use client";

import { useMemo, useState } from "react";
import { CreateTaskModal } from "./CreateTaskModal";
import { EmptyState } from "./EmptyState";
import { Header } from "./Header";
import { TaskCard, type TaskItem } from "./TaskCard";
import { TaskFilters, type Filters } from "./TaskFilters";

type UserOption = { id: string; displayName: string; username: string };

export function Dashboard({
  currentUser,
  users,
  initialTasks,
}: {
  currentUser: UserOption;
  users: UserOption[];
  initialTasks: TaskItem[];
}) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [filters, setFilters] = useState<Filters>({ category: "ALL", status: "ALL" });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadTasks(nextFilters: Filters = filters) {
    setLoading(true);
    const params = new URLSearchParams();
    if (nextFilters.category !== "ALL") params.set("category", nextFilters.category);
    if (nextFilters.status !== "ALL") params.set("status", nextFilters.status);

    const response = await fetch(`/api/tasks?${params}`);
    const data = await response.json();
    setTasks(data.tasks ?? []);
    setLoading(false);
  }

  function handleFiltersChange(next: Filters) {
    setFilters(next);
    void loadTasks(next);
  }

  const counts = useMemo(() => {
    const pending = tasks.filter((t) => t.status === "PENDING").length;
    const done = tasks.filter((t) => t.status === "DONE").length;
    return { pending, done };
  }, [tasks]);

  async function handleToggle(task: TaskItem) {
    setBusyId(task.id);
    const nextStatus = task.status === "DONE" ? "PENDING" : "DONE";
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    await loadTasks();
    setBusyId(null);
  }

  async function handleDelete(task: TaskItem) {
    if (!confirm(`Delete "${task.title}"?`)) return;
    setBusyId(task.id);
    await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    await loadTasks();
    setBusyId(null);
  }

  return (
    <>
      <Header displayName={currentUser.displayName} onNewTask={() => setModalOpen(true)} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        <section className="mb-6 grid grid-cols-2 gap-3">
          <StatCard label="Pending" value={counts.pending} />
          <StatCard label="Completed" value={counts.done} />
        </section>

        <section className="mb-6 rounded-2xl border border-stone-200 bg-white/70 p-4">
          <TaskFilters filters={filters} onChange={handleFiltersChange} />
        </section>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-stone-200/60"
              />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            description="Create a task for something to watch, a place to go, or a small thing to do."
          />
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  currentUserId={currentUser.id}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  busy={busyId === task.id}
                />
              </li>
            ))}
          </ul>
        )}
      </main>

      <CreateTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        users={users}
        currentUserId={currentUser.id}
        onCreated={loadTasks}
      />
    </>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}
