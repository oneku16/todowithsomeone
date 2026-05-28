"use client";

import type { Category, TaskStatus } from "@/generated/prisma/client";
import { CATEGORY_LABELS, CATEGORIES, STATUSES, STATUS_LABELS } from "@/lib/constants";

export type Filters = {
  category: Category | "ALL";
  status: TaskStatus | "ALL";
};

export function TaskFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
}) {
  return (
    <div className="space-y-3">
      <FilterRow
        label="Status"
        options={[
          { value: "ALL", label: "All" },
          ...STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
        ]}
        value={filters.status}
        onChange={(status) =>
          onChange({ ...filters, status: status as Filters["status"] })
        }
      />
      <FilterRow
        label="Category"
        options={[
          { value: "ALL", label: "All" },
          ...CATEGORIES.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
        ]}
        value={filters.category}
        onChange={(category) =>
          onChange({ ...filters, category: category as Filters["category"] })
        }
      />
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-stone-500">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                active
                  ? "bg-stone-900 text-white shadow-sm"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
