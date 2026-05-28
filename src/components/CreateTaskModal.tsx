"use client";

import { useState } from "react";
import type { Category } from "@/generated/prisma/client";
import { CATEGORY_LABELS, CATEGORIES } from "@/lib/constants";

type UserOption = { id: string; displayName: string; username: string };

export function CreateTaskModal({
  open,
  onClose,
  users,
  currentUserId,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  users: UserOption[];
  currentUserId: string;
  onCreated: () => void;
}) {
  if (!open) return null;

  return (
    <CreateTaskForm
      users={users}
      currentUserId={currentUserId}
      onClose={onClose}
      onCreated={onCreated}
    />
  );
}

function CreateTaskForm({
  onClose,
  users,
  currentUserId,
  onCreated,
}: {
  onClose: () => void;
  users: UserOption[];
  currentUserId: string;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("DO");
  const [assignedToId, setAssignedToId] = useState(currentUserId);
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        category,
        assignedToId,
        dueDate: dueDate || undefined,
      }),
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Could not create task");
      return;
    }

    setTitle("");
    setDescription("");
    setCategory("DO");
    setDueDate("");
    onCreated();
    onClose();
  }

  const otherUser = users.find((u) => u.id !== currentUserId);

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-t-3xl border border-stone-200 bg-[#fffdf9] p-6 shadow-xl sm:rounded-3xl">
        <h2 className="text-lg font-semibold text-stone-900">New task</h2>
        <p className="mt-1 text-sm text-stone-500">
          Share something to watch, go to, or do together.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              placeholder="Watch a movie, visit a cafe..."
              className={inputClass}
            />
          </Field>

          <Field label="Note (optional)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={2000}
              placeholder="Any details worth remembering"
              className={`${inputClass} resize-none`}
            />
          </Field>

          <Field label="Category">
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition ${
                    category === value
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                  }`}
                >
                  {CATEGORY_LABELS[value]}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Assign to">
            <div className="grid grid-cols-2 gap-2">
              <AssignButton
                active={assignedToId === currentUserId}
                label="Me"
                onClick={() => setAssignedToId(currentUserId)}
              />
              {otherUser ? (
                <AssignButton
                  active={assignedToId === otherUser.id}
                  label={otherUser.displayName}
                  onClick={() => setAssignedToId(otherUser.id)}
                />
              ) : null}
            </div>
          </Field>

          <Field label="Due date (optional)">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </Field>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-stone-200 bg-white py-2.5 text-sm font-medium text-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-stone-900 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-stone-700">{label}</span>
      {children}
    </label>
  );
}

function AssignButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-700"
      }`}
    >
      {label}
    </button>
  );
}

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200";
