export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 rounded bg-slate-800" />
        <div className="h-28 rounded bg-slate-900" />
        <div className="h-28 rounded bg-slate-900" />
      </div>
    </main>
  );
}
