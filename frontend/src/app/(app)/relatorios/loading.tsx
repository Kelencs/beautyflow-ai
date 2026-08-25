export default function RelatoriosLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="h-7 w-32 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-96 animate-pulse rounded bg-zinc-100" />
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {[0, 1, 2, 3].map((slot) => (
          <div key={slot} className="h-16 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[0, 1, 2, 3].map((slot) => (
          <div key={slot} className="h-14 animate-pulse rounded-lg border border-zinc-100 bg-zinc-50" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-56 animate-pulse rounded-xl border border-dashed border-zinc-200 bg-zinc-50" />
        <div className="h-56 animate-pulse rounded-xl border border-dashed border-zinc-200 bg-zinc-50" />
      </div>

      <div className="h-40 animate-pulse rounded-xl border border-dashed border-zinc-200 bg-zinc-50" />
    </div>
  );
}
