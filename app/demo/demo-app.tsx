"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Photo } from "../photo";
import { PHOTOS } from "@/lib/asset";

const KEY = "v-memoria-demo:v1";
type Tab = "sync" | "record" | "promise" | "fade";

type Msg = { id: string; me: boolean; text: string; at: number; read?: boolean };
type PhotoItem = { id: string; src: string; world: string; date: string; dark?: boolean };
type Anniv = { id: string; title: string; date: string };
type PromiseItem = { id: string; title: string; date?: string; done: boolean };
type State = {
  messages: Msg[];
  photos: PhotoItem[];
  anniversaries: Anniv[];
  promises: PromiseItem[];
  sealedAt: string | null;
};

const uid = () => Math.random().toString(36).slice(2, 9);
const day = 86400000;
const at = (daysAgo: number, h: number, m: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(h, m, 0, 0);
  return d.getTime();
};

function seed(): State {
  return {
    messages: [
      { id: uid(), me: false, text: "おつかれ〜。今日はログインできそう？", at: at(1, 20, 41), read: true },
      { id: uid(), me: true, text: "できる！21時ごろには入れるよ", at: at(1, 20, 43), read: true },
      { id: uid(), me: false, text: "じゃあ展望台で待ってるね。夕焼けの時間帯にしておく", at: at(1, 20, 44), read: true },
      { id: uid(), me: true, text: "楽しみ。あそこの空、好き", at: at(1, 20, 45), read: true },
      { id: uid(), me: false, text: "撮った写真、Record に入れておいたよ", at: at(1, 22, 30), read: true },
      { id: uid(), me: true, text: "見た。2枚目のやつ、光の入り方きれいだった", at: at(1, 22, 34), read: true },
      { id: uid(), me: false, text: "おはよ。昨日の展望台、また行きたいね", at: at(0, 9, 12), read: true },
      { id: uid(), me: true, text: "次の満月の夜にしよう。Promise に書いた", at: at(0, 9, 20), read: true },
      { id: uid(), me: false, text: "見た！楽しみにしてる🌙", at: at(0, 9, 21), read: true },
      { id: uid(), me: false, text: "今夜も少しだけ話せる？", at: at(0, 18, 2), read: true },
    ],
    photos: PHOTOS.map((p) => ({ id: uid(), ...p })),
    anniversaries: [
      { id: uid(), title: "出会った日", date: "2025-08-15" },
      { id: uid(), title: "空間が生まれた日", date: "2025-10-02" },
    ],
    promises: [
      { id: uid(), title: "次の満月の夜、また展望台へ", done: false },
      { id: uid(), title: "ふたりでワールドを作る", done: false },
      { id: uid(), title: "海のワールドで日の出を見る", date: "2026-06-21", done: true },
    ],
    sealedAt: null,
  };
}

const REPLIES = [
  "うん、それいいね",
  "ふふ、覚えててくれたんだ",
  "今度いっしょに行こうね",
  "その話、もっと聞きたい",
  "こっちも同じこと考えてた",
  "写真撮っておこう、忘れないように",
  "ゆっくりでいいよ。待ってる",
  "おやすみの前に、もう一回だけ話そ",
];

const FOLLOWUPS = ["あ、あとね", "写真も撮ろうね", "今夜、少しだけ話せる？", "…ありがとう", "楽しみにしてる"];

const fmtTime = (t: number) =>
  new Date(t).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (t: number) =>
  new Date(t).toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" });
const daysSince = (iso: string) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / day));
const sinceLabel = (iso: string) => {
  const n = daysSince(iso);
  return n === 0 ? (
    <span className="font-display text-xl text-memoria-pink-500">今日</span>
  ) : (
    <>
      あれから <span className="font-display text-2xl text-memoria-pink-500">{n}</span> 日
    </>
  );
};
const fmtIso = (iso: string) => iso.replaceAll("-", ".");
/** ローカル日付を YYYY-MM-DD で返す（UTC の toISOString だと日本時間の朝に日付がずれる） */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/** 端末の写真をそのまま保存すると localStorage に収まらないため、長辺 1280px の JPEG に縮小する */
function shrinkImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 1280;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

const PERSIST_ERROR = "保存容量がいっぱいのため、直前の変更を保存できませんでした。写真を減らすと、また保存できるようになります。";

const icons: Record<Tab, React.ReactNode> = {
  sync: <path d="M4 5h16a1 1 0 011 1v9a1 1 0 01-1 1H9l-4 3v-3H4a1 1 0 01-1-1V6a1 1 0 011-1z" />,
  record: <path d="M4 8h3l2-3h6l2 3h3v11H4V8zm8 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />,
  promise: <path d="M5 5h14v15H5V5zm0 5h14M8 3v4m8-4v4m-7 7l2 2 4-4" />,
  fade: <path d="M4 12c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 4 0M4 17c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 4 0M12 4v4" />,
};
const tabs: { key: Tab; label: string; ja: string }[] = [
  { key: "sync", label: "Sync", ja: "チャット" },
  { key: "record", label: "Record", ja: "アルバム" },
  { key: "promise", label: "Promise", ja: "記念日・約束" },
  { key: "fade", label: "Fade", ja: "空間を閉じる" },
];

function Avatar({ tone, size = "h-7 w-7" }: { tone: "pink" | "blue"; size?: string }) {
  return (
    <span
      className={`${size} inline-flex shrink-0 rounded-full ring-2 ring-white ${
        tone === "pink" ? "bg-gradient-to-br from-memoria-pink-200 to-memoria-pink-400" : "bg-gradient-to-br from-memoria-blue-200 to-memoria-blue-400"
      }`}
    />
  );
}

export function DemoApp() {
  const [state, setState] = useState<State | null>(null);
  const [tab, setTab] = useState<Tab>("sync");
  const [toast, setToast] = useState<string | null>(null);
  const [persistError, setPersistError] = useState(false);
  // 最後に保存できた状態。保存に失敗したらここへ巻き戻す
  const lastSaved = useRef<State | null>(null);
  const stateRef = useRef<State | null>(null);
  // 返信などの保留中タイマーと、リセット／閉じるで無効化する世代番号
  const timers = useRef<number[]>([]);
  const [generation, setGeneration] = useState(0);
  const genRef = useRef(0);

  /* eslint-disable react-hooks/set-state-in-effect -- localStorage は初回描画後にしか読めない */
  useEffect(() => {
    let initial: State;
    try {
      const raw = localStorage.getItem(KEY);
      initial = raw ? (JSON.parse(raw) as State) : seed();
    } catch {
      initial = seed();
    }
    lastSaved.current = initial;
    setState(initial);
  }, []);
  useEffect(() => {
    stateRef.current = state;
    if (!state || state === lastSaved.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      lastSaved.current = state;
      setPersistError(false);
    } catch {
      setPersistError(true);
      setState(lastSaved.current);
    }
  }, [state]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    genRef.current += 1;
    setGeneration(genRef.current);
  }, []);
  /** リセット／閉じる後には発火しない setTimeout。閉じられた空間には何も書き込まない */
  const schedule = useCallback((fn: (safeUpdate: (f: (s: State) => State) => void) => void, ms: number) => {
    const g = genRef.current;
    const id = window.setTimeout(() => {
      timers.current = timers.current.filter((t) => t !== id);
      if (g !== genRef.current) return;
      fn((f) => setState((s) => (s && s.sealedAt === null ? f(s) : s)));
    }, ms);
    timers.current.push(id);
  }, []);
  /** 先に保存を試し、成功したときだけ状態を進める（写真の追加など大きな書き込み用） */
  const commit = useCallback((fn: (s: State) => State): boolean => {
    const cur = stateRef.current;
    if (!cur) return false;
    const next = fn(cur);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      setPersistError(true);
      return false;
    }
    lastSaved.current = next;
    setPersistError(false);
    setState(next);
    return true;
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const update = useCallback((fn: (s: State) => State) => setState((s) => (s ? fn(s) : s)), []);
  const reset = () => {
    if (!confirm("デモの入力内容をすべて消して、最初の状態に戻します。よろしいですか？")) return;
    clearTimers();
    localStorage.removeItem(KEY);
    const fresh = seed();
    lastSaved.current = null;
    setState(fresh);
    setPersistError(false);
    setTab("sync");
    setToast("デモをリセットしました");
  };
  const seal = useCallback(() => {
    clearTimers();
    setState((s) => (s ? { ...s, sealedAt: today() } : s));
  }, [clearTimers]);

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbf8fa] text-sm text-slate-400">
        空間を開いています…
      </div>
    );
  }
  const sealed = state.sealedAt !== null;

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf8fa]">
      <div className="flex items-center justify-between gap-3 bg-slate-800 px-4 py-2 text-xs text-white">
        <span className="truncate">
          <span className="mr-2 rounded bg-white/15 px-1.5 py-0.5 font-bold">デモモード</span>
          入力内容はこのブラウザにだけ保存されます
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <button type="button" onClick={reset} className="font-bold text-slate-300 hover:text-white">デモをリセット</button>
          <Link href="/" className="font-bold underline underline-offset-2">LP に戻る</Link>
        </span>
      </div>

      {persistError && (
        <div role="alert" className="flex items-center justify-center gap-2 bg-amber-50 px-4 py-2 text-center text-xs text-amber-800 ring-1 ring-amber-200">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
          {PERSIST_ERROR}
        </div>
      )}

      <div className={`mx-auto flex w-full max-w-6xl flex-1 flex-col md:flex-row ${sealed ? "sealed" : ""}`}>
        <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-100 bg-white/60 p-4 md:flex">
          <div className="flex items-center gap-2 px-2 py-2">
            <span className="relative h-6 w-6">
              <span className="absolute left-0 top-0.5 h-4 w-4 rounded-full bg-memoria-pink-300" />
              <span className="absolute right-0 top-1 h-4 w-4 rounded-full bg-memoria-blue-300 mix-blend-multiply" />
            </span>
            <span className="font-display font-black text-slate-800">V-Memoria</span>
          </div>
          <nav className="mt-4 flex flex-col gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-memoria-pink-100 ${
                  tab === t.key ? "bg-white shadow-card ring-1 ring-slate-100" : "hover:bg-white/70"
                }`}
              >
                <svg viewBox="0 0 24 24" className={`h-5 w-5 ${tab === t.key ? "text-memoria-pink-400" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {icons[t.key]}
                </svg>
                <span>
                  <span className="block font-display text-sm font-bold text-slate-700">{t.label}</span>
                  <span className="block text-[11px] text-slate-400">{t.ja}</span>
                </span>
              </button>
            ))}
          </nav>
          <div className="mt-6 rounded-2xl bg-white/70 p-4 ring-1 ring-slate-100">
            <p className="text-[10px] font-bold tracking-widest text-slate-400">この空間</p>
            <dl className="mt-2 space-y-1.5 text-xs text-slate-500">
              <div className="flex justify-between gap-2">
                <dt className="whitespace-nowrap">生まれた日</dt>
                <dd className="font-mono text-slate-600">2025.10.02</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>あれから</dt>
                <dd className="font-bold text-memoria-pink-500">{daysSince("2025-10-02")}日</dd>
              </div>
              <div className="flex justify-between gap-2"><dt>メンバー</dt><dd className="text-slate-600">2</dd></div>
              <div className="flex justify-between gap-2"><dt>写真</dt><dd className="text-slate-600">{state.photos.length}枚</dd></div>
              <div className="flex justify-between gap-2"><dt>約束</dt><dd className="text-slate-600">{state.promises.length}件</dd></div>
            </dl>
          </div>
          <p className="mt-auto px-2 pt-6 text-[11px] leading-relaxed text-slate-400">
            v1.4 · デモ空間<br />ふたりだけの記憶の場所
          </p>
        </aside>

        <main className="flex min-h-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-slate-100 bg-white/70 px-4 py-3 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
              <span className="flex -space-x-2">
                <Avatar tone="pink" />
                <Avatar tone="blue" />
              </span>
              <div>
                <p className="font-bold text-slate-800">ゆき &amp; こはる の空間</p>
                <p className="text-[11px] text-slate-400">
                  {sealed ? `${fmtIso(state.sealedAt!)} に閉じられました` : "あなたは ゆき として操作しています"}
                </p>
              </div>
            </div>
            {!sealed && (
              <span className="hidden items-center gap-1.5 text-xs font-bold text-emerald-500 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> こはる オンライン
              </span>
            )}
          </header>

          <div className="flex-1 pb-24 md:pb-0">
            {tab === "sync" && <Sync key={generation} state={state} update={update} sealed={sealed} schedule={schedule} />}
            {tab === "record" && <Record state={state} update={update} sealed={sealed} toast={setToast} commit={commit} onSync={() => setTab("sync")} />}
            {tab === "promise" && <PromiseView state={state} update={update} sealed={sealed} />}
            {tab === "fade" && <Fade state={state} update={update} sealed={sealed} onSeal={seal} />}
          </div>
        </main>
      </div>

      <nav className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-100 bg-white/90 backdrop-blur transition-opacity md:hidden ${sealed ? "opacity-60" : ""}`}>
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold ${tab === t.key ? "text-memoria-pink-500" : "text-slate-400"}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              {icons[t.key]}
            </svg>
            {t.label}
          </button>
        ))}
      </nav>

      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 animate-pop rounded-full bg-slate-800 px-5 py-2.5 text-sm text-white shadow-lg md:bottom-8">
          {toast}
        </div>
      )}
    </div>
  );
}

type ViewProps = { state: State; update: (fn: (s: State) => State) => void; sealed: boolean };

type Schedule = (fn: (safeUpdate: (f: (s: State) => State) => void) => void, ms: number) => void;

function Sync({ state, update, sealed, schedule }: ViewProps & { schedule: Schedule }) {
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const replyIdx = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [state.messages.length, typing]);

  const send = () => {
    const t = text.trim();
    if (!t || sealed) return;
    const id = uid();
    update((s) => ({ ...s, messages: [...s.messages, { id, me: true, text: t, at: Date.now() }] }));
    setText("");
    schedule((safe) => {
      safe((s) => ({ ...s, messages: s.messages.map((m) => (m.id === id ? { ...m, read: true } : m)) }));
      setTyping(true);
    }, 500);
    const delay = 800 + Math.random() * 1200;
    schedule((safe) => {
      setTyping(false);
      const reply = REPLIES[replyIdx.current++ % REPLIES.length];
      safe((s) => ({ ...s, messages: [...s.messages, { id: uid(), me: false, text: reply, at: Date.now(), read: true }] }));
      if (Math.random() < 1 / 3) {
        schedule(() => setTyping(true), 400);
        schedule((safe2) => {
          setTyping(false);
          const second = FOLLOWUPS[Math.floor(Math.random() * FOLLOWUPS.length)];
          safe2((s) => ({ ...s, messages: [...s.messages, { id: uid(), me: false, text: second, at: Date.now(), read: true }] }));
        }, 400 + 900 + Math.random() * 800);
      }
    }, 500 + delay);
  };

  const q = query.trim();
  const rows = useMemo(() => {
    const out: (Msg | { sep: string })[] = [];
    let last = "";
    const source = q ? state.messages.filter((m) => m.text.includes(q)) : state.messages;
    for (const m of source) {
      const d = fmtDate(m.at);
      if (d !== last) {
        out.push({ sep: d });
        last = d;
      }
      out.push(m);
    }
    return out;
  }, [state.messages, q]);

  const highlight = (text: string) => {
    if (!q) return text;
    const parts = text.split(q);
    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 && <mark className="rounded bg-amber-200/80 px-0.5 text-inherit">{q}</mark>}
      </span>
    ));
  };

  return (
    <div className="flex h-[calc(100dvh-8.5rem)] flex-col md:h-[calc(100dvh-7rem)]">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-white/60 px-4 py-2 sm:px-6">
        <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="9" r="5.5" /><path d="M13 13l4 4" /></svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="会話を検索"
          aria-label="会話を検索"
          className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
        />
        {q && (
          <>
            <span className="text-[11px] text-slate-400">{rows.filter((r) => !("sep" in r)).length} 件</span>
            <button type="button" onClick={() => setQuery("")} aria-label="検索を消す" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
            </button>
          </>
        )}
      </div>
      <div className="scrollbar-thin flex-1 space-y-2.5 overflow-y-auto px-4 py-5 sm:px-6">
        {q && rows.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-400">「{q}」を含む会話はありません。</p>
        )}
        {rows.map((r) =>
          "sep" in r ? (
            <div key={r.sep} className="flex items-center gap-3 py-2">
              <span className="h-px flex-1 bg-slate-200/70" />
              <span className="text-[11px] font-bold text-slate-400">{r.sep}</span>
              <span className="h-px flex-1 bg-slate-200/70" />
            </div>
          ) : (
            <div key={r.id} className={`flex items-end gap-2 animate-pop ${r.me ? "flex-row-reverse" : ""}`}>
              {!r.me && <Avatar tone="blue" size="h-7 w-7" />}
              <div
                className={`max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                  r.me ? "rounded-br-md bg-gradient-to-br from-memoria-pink-300 to-memoria-pink-400 text-white" : "rounded-bl-md bg-white text-slate-700 ring-1 ring-slate-100"
                }`}
              >
                {highlight(r.text)}
              </div>
              <div className="flex flex-col items-end text-[10px] leading-tight text-slate-400">
                {r.me && r.read && <span>既読</span>}
                <span>{fmtTime(r.at)}</span>
              </div>
            </div>
          ),
        )}
        {typing && (
          <div className="flex items-end gap-2 animate-pop">
            <Avatar tone="blue" size="h-7 w-7" />
            <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 ring-1 ring-slate-100">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 animate-blink rounded-full bg-slate-400" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <span className="text-[10px] text-slate-400">こはる が入力中…</span>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="border-t border-slate-100 bg-white/80 p-3 sm:p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2 rounded-full bg-slate-50 py-1.5 pl-5 pr-1.5 ring-1 ring-slate-200 focus-within:ring-memoria-pink-300"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sealed}
            placeholder={sealed ? "この空間は閉じられています" : "こはる にメッセージを送る"}
            aria-label="メッセージ"
            className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={sealed || !text.trim()}
            aria-label="送信"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-memoria-pink-400 text-white transition hover:bg-memoria-pink-500 disabled:opacity-30"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 10h13M11 5l5 5-5 5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

function Record({
  state,
  update,
  sealed,
  toast,
  commit,
  onSync,
}: ViewProps & { toast: (t: string) => void; commit: (fn: (s: State) => State) => boolean; onSync: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const [order, setOrder] = useState<"new" | "old">("new");
  const [pending, setPending] = useState<{ src: string } | null>(null);
  const [reading, setReading] = useState(false);
  const photos = useMemo(
    () => [...state.photos].sort((a, b) => (order === "new" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date))),
    [state.photos, order],
  );
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState(today());
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, photos.length]);

  const pick = async (f: File | undefined) => {
    // 同じファイルをもう一度選んでも onChange が鳴るように、読み取ったらすぐ値を空にする
    if (fileRef.current) fileRef.current.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast("画像ファイルをお選びください");
      return;
    }
    setReading(true);
    try {
      const src = await shrinkImage(f);
      if (src.length > 1.5 * 1024 * 1024) {
        toast("縮小しても 1.5MB を超えてしまいました。別の写真をお試しください");
        return;
      }
      setPending({ src });
    } catch {
      toast("この画像は読み込めませんでした");
    } finally {
      setReading(false);
    }
  };
  const dismiss = () => {
    setPending(null);
    if (fileRef.current) fileRef.current.value = "";
  };
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending) return;
    const ok = commit((s) => ({
      ...s,
      photos: [{ id: uid(), src: pending.src, world: caption.trim() || "名もない場所", date: fmtIso(date) }, ...s.photos],
    }));
    if (!ok) {
      toast("保存容量がいっぱいで、この写真は追加できませんでした");
      return;
    }
    dismiss();
    setCaption("");
    toast("写真を追加しました");
  };
  const remove = (id: string) => {
    update((s) => ({ ...s, photos: s.photos.filter((p) => p.id !== id) }));
    setOpen(null);
  };

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-memoria-blue-400">RECORD</p>
          <h2 className="font-display text-xl font-black text-slate-800">アルバム</h2>
        </div>
        {!sealed && (
          <>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
            <button
              type="button"
              disabled={reading}
              onClick={() => fileRef.current?.click()}
              className="rounded-full bg-slate-800 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700 disabled:opacity-50"
            >
              {reading ? "読み込み中…" : "＋ 写真を追加"}
            </button>
          </>
        )}
      </div>

      {pending && (
        <form onSubmit={add} className="mb-6 grid gap-4 rounded-3xl bg-white p-4 shadow-card ring-1 ring-slate-100 sm:grid-cols-[160px_1fr]">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
            <Photo src={pending.src} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-500">
              どこで撮った？
              <input
                autoFocus
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="例: 夜明けの展望台"
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-memoria-blue-300 focus:ring-4 focus:ring-memoria-blue-100"
              />
            </label>
            <label className="text-xs font-bold text-slate-500">
              撮った日
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-memoria-blue-300" />
            </label>
            <div className="mt-auto flex gap-2">
              <button type="submit" className="rounded-full bg-memoria-blue-400 px-5 py-2 text-sm font-bold text-white hover:bg-memoria-blue-500">アルバムに入れる</button>
              <button type="button" onClick={dismiss} className="rounded-full px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100">やめる</button>
            </div>
          </div>
        </form>
      )}

      {state.photos.length > 0 && (
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
          <span>{state.photos.length} 枚</span>
          <div className="flex rounded-full bg-white p-0.5 ring-1 ring-slate-100" role="group" aria-label="並び順">
            {(["new", "old"] as const).map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={order === o}
                onClick={() => {
                  setOrder(o);
                  setOpen(null);
                }}
                className={`rounded-full px-3 py-1 font-bold transition ${order === o ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-700"}`}
              >
                {o === "new" ? "新しい順" : "古い順"}
              </button>
            ))}
          </div>
        </div>
      )}

      {state.photos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-sm text-slate-400">
          まだ写真がありません。<br />ふたりの一枚を、最初の記録に。
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setOpen(i)}
              className="group overflow-hidden rounded-2xl bg-white p-1.5 text-left shadow-card ring-1 ring-slate-100 transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-4 focus-visible:ring-memoria-blue-100"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                <Photo src={p.src} dark={p.dark} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="px-1.5 pb-1 pt-2">
                <p className="truncate text-xs font-bold text-slate-700">{p.world}</p>
                <p className="font-mono text-[10px] text-slate-400">{p.date}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {open !== null && photos[open] && createPortal(
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/85 p-4 backdrop-blur-sm" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <button type="button" aria-label="前の写真" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + photos.length) % photos.length); }} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-8">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 4l-6 6 6 6" /></svg>
          </button>
          <figure className="max-w-4xl animate-pop" onClick={(e) => e.stopPropagation()}>
            <div className="overflow-hidden rounded-2xl bg-black">
              <Photo src={photos[open].src} dark={photos[open].dark} className="max-h-[70vh] w-auto object-contain" />
            </div>
            <figcaption className="mt-3 flex items-center justify-between text-white">
              <div>
                <p className="font-bold">{photos[open].world}</p>
                <p className="font-mono text-xs text-slate-300">{photos[open].date} · {open + 1} / {photos.length}</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                {!sealed && (
                  <button type="button" onClick={onSync} className="rounded-full bg-white/10 px-3 py-1.5 font-bold text-white hover:bg-white/20">Sync で話す →</button>
                )}
                {!sealed && (
                  <button type="button" onClick={() => remove(photos[open].id)} className="text-slate-300 underline-offset-2 hover:underline">削除</button>
                )}
              </div>
            </figcaption>
          </figure>
          <button type="button" aria-label="次の写真" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % photos.length); }} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-8">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 4l6 6-6 6" /></svg>
          </button>
          <button type="button" aria-label="閉じる" onClick={() => setOpen(null)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
        </div>,
        document.body,
      )}
    </div>
  );
}

function PromiseView({ state, update, sealed }: ViewProps) {
  const [aTitle, setATitle] = useState("");
  const [aDate, setADate] = useState(today());
  const [pTitle, setPTitle] = useState("");
  const [pDate, setPDate] = useState("");

  const addA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aTitle.trim()) return;
    update((s) => ({ ...s, anniversaries: [...s.anniversaries, { id: uid(), title: aTitle.trim(), date: aDate }] }));
    setATitle("");
  };
  const addP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim()) return;
    update((s) => ({ ...s, promises: [...s.promises, { id: uid(), title: pTitle.trim(), date: pDate || undefined, done: false }] }));
    setPTitle("");
    setPDate("");
  };
  const inputCls =
    "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-memoria-pink-300 focus:ring-4 focus:ring-memoria-pink-100 disabled:bg-slate-50";

  return (
    <div className="grid gap-8 px-4 py-6 sm:px-6 lg:grid-cols-2">
      <section>
        <p className="text-[10px] font-bold tracking-widest text-memoria-pink-400">ANNIVERSARY</p>
        <h2 className="font-display text-xl font-black text-slate-800">記念日</h2>
        <ul className="mt-4 space-y-2">
          {state.anniversaries.map((a) => (
            <li key={a.id} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-card ring-1 ring-slate-100">
              <div>
                <p className="font-bold text-slate-700">{a.title}</p>
                <p className="font-mono text-[11px] text-slate-400">{fmtIso(a.date)}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs font-bold text-slate-500">{sinceLabel(a.date)}</p>
                {!sealed && (
                  <button type="button" aria-label="削除" onClick={() => update((s) => ({ ...s, anniversaries: s.anniversaries.filter((x) => x.id !== a.id) }))} className="text-slate-300 hover:text-slate-500">
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        {!sealed && (
          <form onSubmit={addA} className="mt-4 flex flex-col gap-2 rounded-2xl border border-dashed border-memoria-pink-200 p-4 sm:flex-row">
            <input value={aTitle} onChange={(e) => setATitle(e.target.value)} placeholder="大切な日の名前" aria-label="記念日の名前" className={`${inputCls} flex-1`} />
            <input type="date" value={aDate} max={today()} onChange={(e) => setADate(e.target.value)} aria-label="日付" className={inputCls} />
            <button type="submit" disabled={!aTitle.trim()} className="whitespace-nowrap rounded-xl bg-memoria-pink-400 px-4 py-2 text-sm font-bold text-white hover:bg-memoria-pink-500 disabled:opacity-40">追加</button>
          </form>
        )}
      </section>

      <section>
        <p className="text-[10px] font-bold tracking-widest text-memoria-blue-400">PROMISE</p>
        <h2 className="font-display text-xl font-black text-slate-800">約束</h2>
        <ul className="mt-4 space-y-2">
          {state.promises.length === 0 && (
            <li className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">まだ約束がありません。</li>
          )}
          {state.promises.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-card ring-1 ring-slate-100">
              <button
                type="button"
                disabled={sealed}
                aria-label={p.done ? "まだにする" : "叶ったにする"}
                onClick={() => update((s) => ({ ...s, promises: s.promises.map((x) => (x.id === p.id ? { ...x, done: !x.done } : x)) }))}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${p.done ? "border-memoria-blue-400 bg-memoria-blue-400 text-white" : "border-slate-300 hover:border-memoria-blue-300"}`}
              >
                {p.done && (
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2.5 6.5l2.5 2.5 4.5-5" /></svg>
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`truncate ${p.done ? "text-slate-400 line-through" : "text-slate-700"}`}>{p.title}</p>
                {p.date && <p className="font-mono text-[11px] text-slate-400">{fmtIso(p.date)}</p>}
              </div>
              <span className={`text-[11px] font-bold ${p.done ? "text-memoria-blue-400" : "text-slate-300"}`}>{p.done ? "叶った" : "まだ"}</span>
              {!sealed && (
                <button type="button" aria-label="削除" onClick={() => update((s) => ({ ...s, promises: s.promises.filter((x) => x.id !== p.id) }))} className="text-slate-300 hover:text-slate-500">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 5l10 10M15 5L5 15" /></svg>
                </button>
              )}
            </li>
          ))}
        </ul>
        {!sealed && (
          <form onSubmit={addP} className="mt-4 flex flex-col gap-2 rounded-2xl border border-dashed border-memoria-blue-200 p-4 sm:flex-row">
            <input value={pTitle} onChange={(e) => setPTitle(e.target.value)} placeholder="これからの約束" aria-label="約束" className={`${inputCls} flex-1`} />
            <input type="date" value={pDate} onChange={(e) => setPDate(e.target.value)} aria-label="日付（任意）" className={inputCls} />
            <button type="submit" disabled={!pTitle.trim()} className="whitespace-nowrap rounded-xl bg-memoria-blue-400 px-4 py-2 text-sm font-bold text-white hover:bg-memoria-blue-500 disabled:opacity-40">追加</button>
          </form>
        )}
      </section>
    </div>
  );
}

function Fade({ state, update, sealed, onSeal }: ViewProps & { onSeal: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const seal = () => {
    onSeal();
    setConfirming(false);
  };
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <p className="text-[10px] font-bold tracking-widest text-slate-400">FADE</p>
      <h2 className="font-display text-2xl font-bold text-slate-700">空間を閉じる</h2>
      {sealed ? (
        <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-card ring-1 ring-slate-200">
          <div className="mx-auto h-1.5 w-24 rounded-full bg-gradient-to-r from-memoria-pink-200 to-memoria-blue-200" />
          <p className="mt-6 font-display text-lg font-bold text-slate-600">この空間は、そっと閉じられています。</p>
          <p className="mt-2 text-sm text-slate-500">{fmtIso(state.sealedAt!)} に閉じられました</p>
          <p className="mt-4 text-xs leading-loose text-slate-400">
            会話も、写真も、約束も、そのまま残っています。<br />読み返すことはいつでもできます。
          </p>
          <button type="button" onClick={() => update((s) => ({ ...s, sealedAt: null }))} className="mt-6 text-sm font-bold text-slate-500 underline underline-offset-4 hover:text-slate-800">
            もう一度開く
          </button>
        </div>
      ) : (
        <>
          <p className="mt-6 leading-loose text-slate-500">
            楽しかった関係も、いつかは終わってしまうかもしれない。そのとき、思い出まで消してしまう必要はありません。
          </p>
          <p className="mt-3 leading-loose text-slate-500">
            Fade は、この空間にそっと蓋をします。新しい書き込みはできなくなりますが、ふたりの会話・写真・約束はすべてそのまま、静かに保存されます。
          </p>
          <ul className="mt-6 space-y-2 text-sm text-slate-500">
            {["すべての記録はそのまま残ります", "新しい書き込みはできなくなります", "相手にも、閉じられたことが伝わります", "いつでも、もう一度開けます"].map((t) => (
              <li key={t} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300" />{t}</li>
            ))}
          </ul>
          <button type="button" onClick={() => setConfirming(true)} className="mt-8 w-full rounded-full border border-slate-300 bg-white py-3.5 font-bold text-slate-600 transition hover:bg-slate-50">
            この空間を閉じる
          </button>
        </>
      )}

      {confirming && (
        <div className="fixed inset-0 z-[95] flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center" onClick={() => setConfirming(false)} role="dialog" aria-modal="true">
          <div className="w-full max-w-md animate-pop rounded-3xl bg-white p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto h-1.5 w-16 rounded-full bg-slate-200" />
            <h3 className="mt-6 text-center font-display text-xl font-bold text-slate-700">閉じても、消えません。</h3>
            <p className="mt-3 text-center text-sm leading-loose text-slate-500">
              ゆき &amp; こはる の空間に蓋をします。<br />記録はすべてそのまま残り、いつでも読み返せます。
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <button type="button" onClick={seal} className="rounded-full bg-slate-800 py-3 font-bold text-white hover:bg-slate-700">そっと閉じる</button>
              <button type="button" onClick={() => setConfirming(false)} className="rounded-full py-3 font-bold text-slate-500 hover:bg-slate-100">まだ開けておく</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
