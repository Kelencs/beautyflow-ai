export default function ConfiguracoesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="h-7 w-40 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-80 animate-pulse rounded bg-zinc-100" />
      </div>

      <div className="h-9 w-80 animate-pulse rounded-lg bg-zinc-100" />

      <div className="h-56 animate-pulse rounded-xl border border-dashed border-zinc-200 bg-zinc-50" />
    </div>
  );
}
