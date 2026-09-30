"use client";

import { useEffect, useRef, useState } from "react";

/** 招待コード入力モーダル。架空サービスのため、送信先はなく「近日公開」状態を表示する。 */
export function InviteButton({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "soon">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState("checking");
    setTimeout(() => setState("soon"), 900);
  };

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-title"
            className="polka-fade-none animate-pop w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-memoria-pink-400">INVITATION</p>
                <h2 id="invite-title" className="mt-1 font-display text-xl font-black text-slate-800">
                  招待コードをお持ちの方
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="閉じる"
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              パートナーから届いた 8 桁の招待コードを入力してください。空間はふたりだけのものになります。
            </p>
            {state === "soon" ? (
              <div className="mt-6 rounded-2xl border border-memoria-blue-100 bg-memoria-blue-50 p-5 text-center">
                <p className="text-2xl">🎀</p>
                <p className="mt-2 font-bold text-slate-700">近日公開</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  招待の受付はまもなく開始します。
                  <br />
                  それまでは <a href="./demo/" className="font-bold text-memoria-blue-500 underline underline-offset-2">デモ画面</a> でお試しください。
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6">
                <label htmlFor="invite-code" className="text-xs font-bold text-slate-500">
                  招待コード
                </label>
                <input
                  id="invite-code"
                  ref={inputRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 9))}
                  placeholder="XXXX-XXXX"
                  autoComplete="off"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-mono text-lg tracking-[0.3em] text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-memoria-pink-300 focus:bg-white focus:ring-4 focus:ring-memoria-pink-100"
                />
                <button
                  type="submit"
                  disabled={code.replace("-", "").length < 4 || state === "checking"}
                  className="mt-4 w-full rounded-full bg-slate-800 py-3 font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {state === "checking" ? "確認しています…" : "空間に入る"}
                </button>
                <p className="mt-3 text-center text-[11px] text-slate-400">
                  招待コードは、パートナーの空間の「招待」から発行できます。
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
