export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white/60 px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-xl">
        ✦
      </div>
      <h3 className="text-base font-medium text-stone-800">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-stone-500">{description}</p>
    </div>
  );
}
