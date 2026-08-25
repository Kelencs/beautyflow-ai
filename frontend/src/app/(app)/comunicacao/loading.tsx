export default function ComunicacaoLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="h-7 w-40 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-80 animate-pulse rounded bg-zinc-100" />
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {[0, 1, 2].map((slot) => (
          <div key={slot} className="h-16 animate-pulse rounded-xl border border-zinc-200 bg-zinc-100" />
        ))}
      </div>

      <div className="h-96 animate-pulse rounded-xl border border-dashed border-zinc-200 bg-zinc-50" />
    </div>
  );
}
