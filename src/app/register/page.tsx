"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [message, setMessage] = useState("");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-3xl font-bold">Create account</h1>
      <form
        className="space-y-3 card"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const res = await fetch("/api/register", { method: "POST", body: formData });
          const json = await res.json();
          setMessage(json.message ?? json.error);
        }}
      >
        <input name="name" placeholder="Name" className="w-full rounded-md bg-slate-800 p-2" required />
        <input name="email" type="email" placeholder="Email" className="w-full rounded-md bg-slate-800 p-2" required />
        <input name="password" type="password" placeholder="Password" className="w-full rounded-md bg-slate-800 p-2" required />
        <button className="w-full rounded-md bg-brand-500 p-2 font-semibold" type="submit">Create account</button>
      </form>
      {message ? <p className="text-sm text-slate-300">{message}</p> : null}
    </main>
  );
}
