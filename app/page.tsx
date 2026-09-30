import Link from "next/link";
import { InviteButton } from "./invite-modal";
import { Photo } from "./photo";
import { PHOTOS } from "@/lib/asset";

const nav = [
  { href: "#features", label: "機能" },
  { href: "#start", label: "はじめかた" },
  { href: "#demo", label: "デモ" },
  { href: "#faq", label: "よくある質問" },
];

const releases = [
  { date: "2026.09.30", tag: "v1.4", title: "Fade を公開しました", body: "空間にそっと蓋をして、静かに保存できるようになりました。" },
  { date: "2026.08.21", tag: "v1.3", title: "Record にワールド名のメモを追加", body: "写真ごとに、撮った場所の名前と日付を残せます。" },
  { date: "2026.07.10", tag: "v1.2", title: "Sync の既読表示を調整", body: "相手が読んだタイミングが、より自然に分かるようになりました。" },
];

const faqs = [
  {
    q: "招待コードはどこで手に入りますか？",
    a: "すでに空間を持っているパートナーが、自分の空間の「招待」から 8 桁のコードを発行できます。コードを受け取った方が「招待を受ける」から入力すると、ふたりの空間が生まれます。",
  },
  {
    q: "料金はかかりますか？",
    a: "現在は無料でご利用いただけます。写真の保存容量など、有料プランの予定が決まりましたら、お知らせで先にご案内します。",
  },
  {
    q: "相手が来なくなってしまったら？",
    a: "Fade を使って、空間を静かに閉じることができます。消えるのではなく、ふたりの記録はそのまま読み返せる状態で保存されます。もう一度開くこともできます。",
  },
  {
    q: "データを完全に削除したいときは？",
    a: "設定から、空間ごとにすべての記録を削除できます。片方が削除を申請すると、もう片方にも確認が届き、ふたりの同意で削除が完了します。",
  },
  {
    q: "スマートフォンでも使えますか？",
    a: "はい。ブラウザで動くので、インストールは不要です。ホーム画面に追加すると、アプリのように開けます。",
  },
];

function Dots({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`polka pointer-events-none absolute inset-0 ${className}`} />;
}

function Avatar({ tone, size = "h-6 w-6" }: { tone: "pink" | "blue"; size?: string }) {
  return (
    <span
      className={`${size} inline-flex shrink-0 rounded-full ring-2 ring-white ${
        tone === "pink"
          ? "bg-gradient-to-br from-memoria-pink-200 to-memoria-pink-400"
          : "bg-gradient-to-br from-memoria-blue-200 to-memoria-blue-400"
      }`}
    />
  );
}

/* ---------- Mock UIs ---------- */

function SyncMock({ compact = false }: { compact?: boolean }) {
  const msgs = [
    { me: false, text: "今日の展望台、夕焼けきれいだったね", time: "21:04" },
    { me: true, text: "うん。写真、Record に入れておいた", time: "21:05" },
    { me: false, text: "見た！次はあの音楽のワールド行こ", time: "21:07" },
    { me: true, text: "いいね。週末の夜、空けとく", time: "21:07", read: true },
  ];
  return (
    <div className="flex flex-col gap-2.5 text-[13px]">
      {!compact && (
        <div className="flex items-center gap-3 py-1">
          <span className="h-px flex-1 bg-slate-100" />
          <span className="text-[10px] font-bold text-slate-400">9月28日（月）</span>
          <span className="h-px flex-1 bg-slate-100" />
        </div>
      )}
      {msgs.map((m, i) => (
        <div key={i} className={`flex items-end gap-2 ${m.me ? "flex-row-reverse" : ""}`}>
          {!m.me && <Avatar tone="blue" />}
          <div
            className={`max-w-[78%] rounded-2xl px-3.5 py-2 leading-relaxed shadow-sm ${
              m.me
                ? "rounded-br-md bg-gradient-to-br from-memoria-pink-300 to-memoria-pink-400 text-white"
                : "rounded-bl-md bg-white text-slate-700 ring-1 ring-slate-100"
            }`}
          >
            {m.text}
          </div>
          <div className="flex flex-col items-end text-[9px] leading-tight text-slate-400">
            {m.read && <span>既読</span>}
            <span>{m.time}</span>
          </div>
        </div>
      ))}
      {!compact && (
        <div className="mt-1 flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 ring-1 ring-slate-100">
          <span className="flex-1 text-slate-400">メッセージを入力</span>
          <span className="h-6 w-6 rounded-full bg-memoria-pink-400" />
        </div>
      )}
    </div>
  );
}

function RecordStrip() {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {PHOTOS.map((p) => (
        <div key={p.src} className="aspect-[4/3] overflow-hidden rounded-lg">
          <Photo src={p.src} dark={p.dark} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[28px] border border-white/60 bg-white/70 p-2 shadow-soft backdrop-blur">
      <div className="overflow-hidden rounded-[22px] bg-[#fbf8fa] ring-1 ring-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 bg-white/80 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex -space-x-1.5">
              <Avatar tone="pink" size="h-5 w-5" />
              <Avatar tone="blue" size="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-slate-700">ゆき &amp; こはる の空間</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> こはる オンライン
          </span>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

function PromiseMock() {
  return (
    <div className="space-y-3 text-sm">
      <div>
        <p className="mb-2 text-[10px] font-bold tracking-widest text-memoria-pink-400">ANNIVERSARY</p>
        {[
          { t: "出会った日", d: "2025.08.15", n: 412 },
          { t: "空間が生まれた日", d: "2025.10.03", n: 363 },
        ].map((a) => (
          <div key={a.t} className="mb-2 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
            <div>
              <p className="font-bold text-slate-700">{a.t}</p>
              <p className="text-[11px] text-slate-400">{a.d}</p>
            </div>
            <p className="font-display text-xs font-bold text-slate-500">
              あれから <span className="text-xl text-memoria-pink-500">{a.n}</span> 日
            </p>
          </div>
        ))}
      </div>
      <div>
        <p className="mb-2 text-[10px] font-bold tracking-widest text-memoria-blue-400">PROMISE</p>
        {[
          { t: "次の満月の夜、また展望台へ", done: false },
          { t: "ふたりでワールドを作る", done: false },
          { t: "海のワールドで日の出を見る", done: true },
        ].map((p) => (
          <div key={p.t} className="mb-2 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                p.done ? "border-memoria-blue-400 bg-memoria-blue-400 text-white" : "border-slate-200"
              }`}
            >
              {p.done && (
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                </svg>
              )}
            </span>
            <span className={p.done ? "text-slate-400 line-through" : "text-slate-700"}>{p.t}</span>
            <span className={`ml-auto text-[10px] font-bold ${p.done ? "text-memoria-blue-400" : "text-slate-300"}`}>
              {p.done ? "叶った" : "まだ"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FadeMock() {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="sealed rounded-[26px] bg-white p-5 shadow-card ring-1 ring-slate-200/70">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex -space-x-1.5">
            <Avatar tone="pink" size="h-5 w-5" />
            <Avatar tone="blue" size="h-5 w-5" />
          </span>
          <span className="text-xs font-bold text-slate-500">ゆき &amp; こはる の空間</span>
        </div>
        <SyncMock compact />
        <div className="mt-4">
          <RecordStrip />
        </div>
      </div>
      <div className="absolute -top-5 left-1/2 w-[104%] -translate-x-1/2 rounded-full border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-6 py-3 text-center shadow-card">
        <p className="text-[10px] font-bold tracking-widest text-slate-400">SEALED</p>
        <p className="text-xs font-bold text-slate-600">2026.09.30 に閉じられました</p>
      </div>
      <div className="absolute -right-3 top-10 h-16 w-3 rounded-full bg-gradient-to-b from-memoria-pink-200 to-memoria-pink-300 opacity-70" />
    </div>
  );
}

/* ---------- Page ---------- */

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/75 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <a href="#top" className="flex items-center gap-2">
            <span className="relative h-7 w-7">
              <span className="absolute left-0 top-1 h-5 w-5 rounded-full bg-memoria-pink-300" />
              <span className="absolute right-0 top-1.5 h-5 w-5 rounded-full bg-memoria-blue-300 mix-blend-multiply" />
            </span>
            <span className="font-display text-lg font-black tracking-tight text-slate-800">V-Memoria</span>
          </a>
          <nav className="hidden items-center gap-7 text-sm font-bold text-slate-500 md:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="transition hover:text-slate-800">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className="hidden rounded-full px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 sm:inline-block"
            >
              デモ
            </Link>
            <InviteButton className="rounded-full bg-slate-800 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700 sm:px-5">
              招待を受ける
            </InviteButton>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden bg-gradient-to-b from-memoria-pink-50 via-white to-memoria-blue-50/60">
        <div aria-hidden className="polka-lg polka-fade pointer-events-none absolute inset-0" />
        <div aria-hidden className="blob absolute -left-24 top-10 h-72 w-72 rounded-full bg-memoria-pink-200 animate-float-slow" />
        <div aria-hidden className="blob absolute -right-20 top-40 h-80 w-80 rounded-full bg-memoria-blue-200 animate-float" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-memoria-pink-200 bg-white/80 px-4 py-1.5 text-[11px] font-bold tracking-[0.22em] text-memoria-pink-500 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-memoria-pink-400" />
              MADE SPACE FOR TWO
            </p>
            <h1 className="mt-6 font-display text-[2.6rem] font-black leading-[1.15] tracking-tight text-slate-800 sm:text-6xl">
              ふたりの記憶に、
              <br />
              <span className="text-gradient">帰る場所</span>を。
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-loose text-slate-500 sm:text-base">
              バーチャルの世界で出会ったふたりのための、招待制の二人専用スペース。
              <br className="hidden sm:block" />
              交わした言葉も、撮った写真も、交わした約束も、ここにだけ、静かに残ります。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <InviteButton className="rounded-full bg-gradient-to-r from-memoria-pink-400 to-memoria-blue-400 px-8 py-3.5 text-center font-bold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
                招待を受けて始める
              </InviteButton>
              <Link
                href="/demo"
                className="rounded-full border border-slate-200 bg-white px-8 py-3.5 text-center font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                デモを触ってみる →
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
              <span>インストール不要・ブラウザで動きます</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 font-bold text-slate-500 ring-1 ring-slate-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> v1.4 公開中
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div aria-hidden className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-memoria-pink-100/70 via-white/0 to-memoria-blue-100/70" />
            <DeviceFrame>
              <SyncMock />
              <div className="mt-4 border-t border-slate-100 pt-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest text-memoria-blue-400">RECORD</span>
                  <span className="text-[10px] text-slate-400">最近の 4 枚</span>
                </div>
                <RecordStrip />
              </div>
            </DeviceFrame>
            <div className="absolute -bottom-5 -left-3 hidden rounded-2xl bg-white px-4 py-3 shadow-card ring-1 ring-slate-100 sm:block">
              <p className="text-[10px] font-bold tracking-widest text-memoria-pink-400">PROMISE</p>
              <p className="text-sm font-bold text-slate-700">
                出会った日から <span className="font-display text-lg text-memoria-pink-500">412</span> 日
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Release notes strip */}
      <section className="border-y border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:px-8 md:flex-row md:items-center">
          <span className="shrink-0 text-[11px] font-bold tracking-[0.2em] text-slate-400">RELEASE NOTES</span>
          <div className="flex flex-col gap-2 md:flex-row md:gap-6">
            {releases.map((r) => (
              <a key={r.date} href="#news" className="group flex items-center gap-2 text-sm">
                <span className="font-mono text-xs text-slate-400">{r.date}</span>
                <span className="rounded-md bg-memoria-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-memoria-blue-500">{r.tag}</span>
                <span className="font-bold text-slate-600 group-hover:text-slate-900">{r.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 sm:py-32">
        <Dots className="opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold tracking-[0.22em] text-memoria-blue-400">FEATURES</p>
            <h2 className="mt-3 font-display text-3xl font-black text-slate-800 sm:text-4xl">
              ふたりに必要なものだけ、4 つ。
            </h2>
            <p className="mt-4 leading-loose text-slate-500">
              タイムラインも、いいねも、フォロワーもありません。
              <br className="hidden sm:block" />
              ここにあるのは、ふたりの言葉と、写真と、大切な日と、そして終わりの迎え方だけ。
            </p>
          </div>

          <div className="mt-20 space-y-24">
            {/* Sync */}
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-memoria-pink-100 px-3 py-1 text-xs font-bold text-memoria-pink-500">
                  01 <span className="font-display">Sync</span>
                </span>
                <h3 className="mt-4 font-display text-2xl font-black text-slate-800 sm:text-3xl">
                  交わした言葉が、
                  <br />
                  そのまま残る。
                </h3>
                <p className="mt-4 leading-loose text-slate-500">
                  ふたりだけのシンプルなチャット。通知に追われることも、流れて消えることもありません。ふと読み返したくなった夜に、あの日の会話がそのままの温度で残っています。
                </p>
                <ul className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                  {["既読表示", "日付で区切って表示", "検索"].map((t) => (
                    <li key={t} className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-100">{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[30px] bg-gradient-to-br from-memoria-pink-50 to-white p-6 ring-1 ring-memoria-pink-100 sm:p-8">
                <div className="rounded-3xl bg-white p-4 shadow-card">
                  <SyncMock />
                </div>
              </div>
            </div>

            {/* Record */}
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="order-2 lg:order-1 rounded-[30px] bg-gradient-to-br from-memoria-blue-50 to-white p-6 ring-1 ring-memoria-blue-100 sm:p-8">
                <div className="grid grid-cols-2 gap-3">
                  {PHOTOS.map((p, i) => (
                    <figure
                      key={p.src}
                      className={`overflow-hidden rounded-2xl bg-white p-2 shadow-card ${i % 3 === 0 ? "-rotate-1" : "rotate-1"}`}
                    >
                      <div className="aspect-[16/10] overflow-hidden rounded-xl">
                        <Photo src={p.src} dark={p.dark} className="h-full w-full object-cover" />
                      </div>
                      <figcaption className="flex items-baseline justify-between px-1 pb-0.5 pt-2">
                        <span className="text-xs font-bold text-slate-700">{p.world}</span>
                        <span className="font-mono text-[10px] text-slate-400">{p.date}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-memoria-blue-100 px-3 py-1 text-xs font-bold text-memoria-blue-500">
                  02 <span className="font-display">Record</span>
                </span>
                <h3 className="mt-4 font-display text-2xl font-black text-slate-800 sm:text-3xl">
                  あの場所で撮った、
                  <br />
                  ふたりの一枚を。
                </h3>
                <p className="mt-4 leading-loose text-slate-500">
                  お気に入りのワールドで撮ったツーショットを、撮った場所の名前と日付といっしょに。並べてみると、ふたりが歩いてきた道がそのままアルバムになります。
                </p>
                <ul className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                  {["ワールド名メモ", "日付で並び替え", "ふたりだけに公開"].map((t) => (
                    <li key={t} className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-100">{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Promise */}
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-memoria-pink-100 px-3 py-1 text-xs font-bold text-memoria-pink-500">
                  03 <span className="font-display">Promise</span>
                </span>
                <h3 className="mt-4 font-display text-2xl font-black text-slate-800 sm:text-3xl">
                  あれから何日。
                  <br />
                  これからの約束。
                </h3>
                <p className="mt-4 leading-loose text-slate-500">
                  出会った日、空間が生まれた日。大切な日を登録すると、「あれから何日」をいつでも確かめられます。そして、これからの約束も書き込んで。叶ったら、そっと印をつけましょう。
                </p>
                <ul className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                  {["記念日の日数表示", "約束リスト", "叶った印"].map((t) => (
                    <li key={t} className="rounded-full bg-white px-3 py-1.5 ring-1 ring-slate-100">{t}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[30px] bg-gradient-to-br from-memoria-pink-50 via-white to-memoria-blue-50 p-6 ring-1 ring-memoria-pink-100 sm:p-8">
                <PromiseMock />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fade */}
      <section id="fade" className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/80 py-28 sm:py-36">
        <div aria-hidden className="polka-quiet pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1 pt-6">
            <FadeMock />
          </div>
          <div className="order-1 lg:order-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-200/70 px-3 py-1 text-xs font-bold text-slate-500">
              04 <span className="font-display">Fade</span>
            </span>
            <h3 className="mt-5 font-display text-2xl font-bold leading-snug text-slate-700 sm:text-3xl">
              いつか終わる日が来ても、
              <br />
              消さなくていい。
            </h3>
            <p className="mt-5 leading-[2] text-slate-500">
              楽しかった関係も、いつかは終わってしまうかもしれない。V-Memoria はその前提から作られています。
            </p>
            <p className="mt-3 leading-[2] text-slate-500">
              Fade は、空間にそっと蓋をする機能です。削除ではなく、封をする。ふたりの会話も写真も約束も、そのまま静かな場所に保存され、いつでも読み返せます。もう一度開くことだって、できます。
            </p>
            <p className="mt-6 font-display text-sm font-bold text-slate-400">
              「閉じても、消えません。」
            </p>
          </div>
        </div>
      </section>

      {/* How to start */}
      <section id="start" className="relative py-24 sm:py-32">
        <Dots className="opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_40%)]" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold tracking-[0.22em] text-memoria-pink-400">HOW TO START</p>
            <h2 className="mt-3 font-display text-3xl font-black text-slate-800 sm:text-4xl">始まりは、招待から。</h2>
            <p className="mt-4 leading-loose text-slate-500">
              V-Memoria に、誰でも入れる入口はありません。
              <br />
              ひとりがもうひとりを招くことで、はじめてふたりの空間が生まれます。
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1fr_1fr]">
            {[
              {
                n: "01",
                title: "招待を送る",
                body: "あなたが招待コードを発行して、パートナーに渡します。渡し方は、ふたりのいつもの場所で。",
                tone: "pink",
              },
              {
                n: "02",
                title: "空間が生まれる",
                body: "招待が受け入れられた瞬間、ふたりだけの空間が生まれます。名前をつけて、扉を閉めましょう。",
                tone: "blue",
              },
              {
                n: "03",
                title: "記憶を重ねる",
                body: "Sync で話し、Record に残し、Promise に書く。積み重なった日々が、帰る場所になります。",
                tone: "pink",
              },
            ].map((s) => (
              <div key={s.n} className="relative rounded-3xl bg-white p-7 shadow-card ring-1 ring-slate-100">
                <span className={`font-display text-4xl font-black ${s.tone === "pink" ? "text-memoria-pink-200" : "text-memoria-blue-200"}`}>
                  {s.n}
                </span>
                <h3 className="mt-2 text-lg font-black text-slate-800">{s.title}</h3>
                <p className="mt-2 text-sm leading-loose text-slate-500">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Invitation card mock */}
          <div className="mx-auto mt-12 max-w-lg">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-memoria-pink-50 via-white to-memoria-blue-50 p-1 shadow-soft">
              <div className="polka rounded-[22px] bg-white/80 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold tracking-[0.22em] text-memoria-pink-400">INVITATION</p>
                  <span className="text-[10px] text-slate-400">72 時間 有効</span>
                </div>
                <p className="mt-3 text-sm text-slate-500">ゆき さんから、あなたへ</p>
                <p className="mt-4 rounded-2xl bg-slate-800 py-4 text-center font-mono text-2xl tracking-[0.35em] text-white shadow-inner">
                  MEMO-7A2K
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <InviteButton className="flex-1 rounded-full bg-gradient-to-r from-memoria-pink-400 to-memoria-blue-400 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5">
                    招待を受ける
                  </InviteButton>
                  <Link
                    href="/demo"
                    className="flex-1 rounded-full border border-slate-200 bg-white py-3 text-center text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                  >
                    まずデモを見る
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section id="demo" className="relative">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="relative overflow-hidden rounded-[36px] bg-slate-800 px-6 py-14 text-center text-white sm:px-12 sm:py-20">
            <div aria-hidden className="absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,white_0_3px,transparent_4px)] [background-size:44px_44px]" />
            <div aria-hidden className="blob absolute -left-20 -top-20 h-64 w-64 rounded-full bg-memoria-pink-400" />
            <div aria-hidden className="blob absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-memoria-blue-400" />
            <div className="relative">
              <p className="text-[11px] font-bold tracking-[0.22em] text-memoria-blue-200">INTERACTIVE DEMO</p>
              <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">招待が届く前に、触ってみる。</h2>
              <p className="mx-auto mt-4 max-w-xl leading-loose text-slate-300">
                ブラウザの中だけで動くデモ空間を用意しました。メッセージを送ると相手から返事が届き、写真を追加し、記念日を登録し、そして空間を閉じるところまで体験できます。
              </p>
              <Link
                href="/demo"
                className="mt-8 inline-block rounded-full bg-white px-9 py-3.5 font-bold text-slate-800 shadow-lg transition hover:-translate-y-0.5"
              >
                デモ空間を開く →
              </Link>
              <p className="mt-3 text-xs text-slate-400">入力内容はあなたのブラウザにだけ保存されます</p>
            </div>
          </div>
        </div>
      </section>

      {/* News + FAQ */}
      <section id="faq" className="py-24 sm:py-32">
        <div className="mx-auto grid max-w-6xl gap-16 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div id="news">
            <p className="text-[11px] font-bold tracking-[0.22em] text-memoria-blue-400">NEWS</p>
            <h2 className="mt-3 font-display text-2xl font-black text-slate-800">お知らせ</h2>
            <ol className="mt-6 space-y-5 border-l border-slate-100 pl-5">
              {releases.map((r) => (
                <li key={r.date} className="relative">
                  <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-memoria-pink-300 ring-4 ring-white" />
                  <p className="flex items-center gap-2 font-mono text-xs text-slate-400">
                    {r.date}
                    <span className="rounded-md bg-memoria-blue-50 px-1.5 py-0.5 font-sans text-[10px] font-bold text-memoria-blue-500">{r.tag}</span>
                  </p>
                  <p className="mt-1 font-bold text-slate-700">{r.title}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{r.body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-100">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="font-bold text-slate-600">Everything is quiet</span>
              <span className="ml-auto text-xs text-slate-400">すべてのシステムが正常です</span>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold tracking-[0.22em] text-memoria-pink-400">FAQ</p>
            <h2 className="mt-3 font-display text-2xl font-black text-slate-800">よくある質問</h2>
            <div className="mt-6 divide-y divide-slate-100 rounded-3xl bg-white shadow-card ring-1 ring-slate-100">
              {faqs.map((f) => (
                <details key={f.q} className="group px-6 py-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold text-slate-700 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <svg viewBox="0 0 20 20" className="faq-chevron h-5 w-5 shrink-0 text-slate-400 transition" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 8l5 5 5-5" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-sm leading-loose text-slate-500">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-display text-lg font-black text-slate-800">V-Memoria</p>
              <p className="mt-2 text-sm text-slate-500">ふたりの記憶に、帰る場所を。</p>
              <p className="mt-3 text-xs text-slate-400">@vmemoria_app</p>
            </div>
            <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-slate-500 sm:grid-cols-3">
              {nav.map((n) => (
                <a key={n.href} href={n.href} className="hover:text-slate-800">{n.label}</a>
              ))}
              <Link href="/demo" className="hover:text-slate-800">デモ</Link>
              <Link href="/terms" className="hover:text-slate-800">利用規約</Link>
              <Link href="/privacy" className="hover:text-slate-800">プライバシーポリシー</Link>
            </nav>
          </div>
          <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 V-Memoria</span>
            <span>V-Memoria は架空のサービスのコンセプトページです。</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
