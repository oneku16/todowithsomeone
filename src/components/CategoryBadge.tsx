import type { Category } from "@/generated/prisma/client";
import { CATEGORY_LABELS, CATEGORY_STYLES } from "@/lib/constants";

export function CategoryBadge({ category }: { category: Category }) {
  const styles = CATEGORY_STYLES[category];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {CATEGORY_LABELS[category]}
    </span>
  );
}
