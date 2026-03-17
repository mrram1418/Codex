import Link from "next/link";

const features = [
  "Template-driven generation engine",
  "Project history and artifact previews",
  "Usage quotas and Stripe billing",
  "Admin analytics and template controls"
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 flex items-center justify-between">
          <h1 className="text-2xl font-bold">PromptForge</h1>
          <nav className="space-x-4 text-sm">
            <Link href="#pricing">Pricing</Link>
            <Link href="#faq">FAQ</Link>
            <Link className="rounded-md bg-brand-500 px-4 py-2 font-semibold" href="/dashboard">
              Open dashboard
            </Link>
          </nav>
        </header>
        <section className="mb-16 rounded-2xl border border-slate-800 bg-slate-900/50 p-12">
          <p className="mb-4 text-brand-500">Build products at startup speed</p>
          <h2 className="mb-5 text-5xl font-bold leading-tight">Describe your app. Ship a working starter in minutes.</h2>
          <p className="max-w-2xl text-slate-300">
            PromptForge turns plain-English product ideas into deployable, production-ready codebases with templates, artifacts, docs, and billing-aware usage controls.
          </p>
        </section>
        <section className="mb-16 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className="card">{feature}</div>
          ))}
        </section>
        <section id="pricing" className="mb-16 grid gap-4 md:grid-cols-3">
          {[
            ["Free", "3 generations/month", "$0"],
            ["Pro", "50 generations/month + premium templates", "$29"],
            ["Team", "250 generations/month + team-ready architecture", "$99"]
          ].map(([name, desc, price]) => (
            <article key={name} className="card">
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="my-2 text-slate-300">{desc}</p>
              <p className="text-3xl font-bold">{price}</p>
            </article>
          ))}
        </section>
        <section id="faq" className="space-y-3">
          <div className="card"><strong>Can I download generated files?</strong><p>Yes, every generation includes export and setup instructions.</p></div>
          <div className="card"><strong>Do you support Stripe subscriptions?</strong><p>Yes, Free/Pro/Team plans with customer portal management.</p></div>
        </section>
      </div>
    </main>
  );
}
