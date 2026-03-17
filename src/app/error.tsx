"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="card max-w-lg text-center">
          <h2 className="mb-2 text-2xl font-semibold">Something went wrong</h2>
          <p className="mb-4 text-sm text-slate-300">{error.message}</p>
          <button className="rounded bg-brand-500 px-4 py-2 font-semibold" onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}
