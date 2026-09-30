import Link from "next/link";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { h: string; p: string }[];
}) {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-memoria-pink-50/60 to-white">
      <div aria-hidden className="polka polka-fade pointer-events-none absolute inset-x-0 top-0 h-80 opacity-70" />
      <div className="relative mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
        <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-800">← V-Memoria トップへ</Link>
        <h1 className="mt-8 font-display text-3xl font-black text-slate-800">{title}</h1>
        <p className="mt-2 font-mono text-xs text-slate-400">最終更新 {updated}</p>
        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-bold text-slate-700">{s.h}</h2>
              <p className="mt-2 text-sm leading-loose text-slate-500">{s.p}</p>
            </section>
          ))}
        </div>
        <p className="mt-16 text-xs text-slate-400">V-Memoria は架空のサービスのコンセプトページです。</p>
      </div>
    </main>
  );
}
