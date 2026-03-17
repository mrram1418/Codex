import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-3xl font-bold">Sign in</h1>
      <p className="text-slate-300">Use seeded demo credentials from README.</p>
      <form action="/api/auth/signin/credentials" method="post" className="space-y-3 card">
        <input name="email" type="email" placeholder="Email" className="w-full rounded-md bg-slate-800 p-2" required />
        <input name="password" type="password" placeholder="Password" className="w-full rounded-md bg-slate-800 p-2" required />
        <button className="w-full rounded-md bg-brand-500 p-2 font-semibold" type="submit">Sign in</button>
      </form>
      <Link href="/register" className="text-sm text-brand-500">Create account</Link>
    </main>
  );
}
