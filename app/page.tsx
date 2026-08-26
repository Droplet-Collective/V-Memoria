const features = [
  {
    key: "sync",
    name: "Sync",
    ja: "シンプルなチャット",
    desc: "二人だけのシンプルなチャット機能。交わした言葉はそのまま残るから、ふと読み返したくなる、二人だけのやり取りに。",
    iconBg: "bg-memoria-pink-100",
    iconColor: "text-memoria-pink-400",
    icon: (
      <path d="M8 12h16M8 18h10M13 6h11a3 3 0 013 3v10a3 3 0 01-3 3H15l-5 4v-4H10a3 3 0 01-3-3V9a3 3 0 013-3z" />
    ),
  },
  {
    key: "record",
    name: "Record",
    ja: "写真アルバム",
    desc: "お気に入りのワールドで撮ったツーショットや、二人で過ごした瞬間を写真として記録します。",
    iconBg: "bg-memoria-blue-100",
    iconColor: "text-memoria-blue-400",
    icon: (
      <path d="M9 8l1.7-2.5A2 2 0 0112.4 4.5h3.2a2 2 0 011.7 1L19 8h3a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V10a2 2 0 012-2h3zM16 19a4 4 0 100-8 4 4 0 000 8z" />
    ),
  },
  {
    key: "promise",
    name: "Promise",
    ja: "記念日・約束",
    desc: "出会った日、関係が始まった日──二人にとって大切な日を登録して、いつでも「あれから何日」を確かめられる。これからの約束も書き込んで、未来への記録とします。",
    iconBg: "bg-memoria-pink-100",
    iconColor: "text-memoria-pink-400",
    icon: (
      <path d="M8 3v4M24 3v4M6 9h20a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V11a2 2 0 012-2zM4 15h24M11 20l2.5 2.5L17 18" />
    ),
  },
  {
    key: "fade",
    name: "Fade",
    ja: "空間を閉じる",
    desc: "楽しかった関係も、いつかは終わってしまうかもしれないもの。空間にそっと蓋をするように、静かに保存をします。",
    iconBg: "bg-memoria-blue-100",
    iconColor: "text-memoria-blue-400",
    icon: (
      <path d="M6 22c2-3 5-3 7-1s5 2 7-1 5-3 7-1M6 15c2-3 5-3 7-1s5 2 7-1 5-3 7-1M16 4v7" />
    ),
  },
];

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-memoria-pink-100/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-tight text-slate-800">
              V<span className="text-memoria-pink-400">-</span>Memoria
            </span>
          </div>
          <a
            href="#invite"
            className="rounded-full bg-slate-800 px-5 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
          >
            招待を受ける
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="polka-dots relative flex min-h-screen items-center justify-center bg-gradient-to-b from-memoria-pink-50 via-white to-memoria-blue-50 pt-20">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="mb-5 inline-block whitespace-nowrap rounded-full border border-memoria-pink-200 bg-white/70 px-4 py-1.5 text-xs font-bold tracking-widest text-memoria-pink-400">
            MADE SPACE FOR TWO
          </p>
          <h1 className="text-balance text-4xl font-black leading-tight text-slate-800 sm:text-6xl">
            二人だけの、
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-memoria-pink-400 to-memoria-blue-400 bg-clip-text text-transparent">
              思い出
            </span>
            の場所。
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance leading-relaxed text-slate-500">
            会話も、写真も、記念日も。
            <br />
            そっと思い出を積み重ねていく、二人だけの閉じた空間です。
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#invite"
              className="w-full rounded-full bg-gradient-to-r from-memoria-pink-400 to-memoria-blue-400 px-8 py-3.5 text-center font-bold text-white shadow-lg shadow-memoria-pink-200/60 transition hover:opacity-90 sm:w-auto"
            >
              招待を受けて始める
            </a>
            <a
              href="#features"
              className="w-full rounded-full border border-slate-200 bg-white px-8 py-3.5 text-center font-bold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
            >
              機能を見る
            </a>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">
          大人数のためのSNSじゃない。
        </h2>
        <p className="mt-6 leading-loose text-slate-500">
          V-Memoriaは、バーチャル空間での特別な二人組のための、
          <br className="hidden sm:block" />
          <strong className="font-bold text-slate-700">二人専用</strong>
          のWebアプリです。
        </p>
      </section>

      {/* Features */}
      <section
        id="features"
        className="polka-dots bg-gradient-to-b from-white via-memoria-blue-50/40 to-white py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold tracking-widest text-memoria-blue-400">
              FEATURES — MEMORY
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-800">
              4つの機能で、記憶を紡ぐ
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.key}
                className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-sm shadow-slate-100 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-memoria-pink-100"
              >
                <div
                  className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${f.iconBg}`}
                >
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-7 w-7 ${f.iconColor}`}
                  >
                    {f.icon}
                  </svg>
                </div>
                <div className="mb-1 flex items-baseline gap-2">
                  <h3 className="text-xl font-black text-slate-800">
                    {f.name}
                  </h3>
                  <span className="text-sm font-bold text-slate-400">
                    {f.ja}
                  </span>
                </div>
                <p className="leading-relaxed text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Invite flow */}
      <section
        id="invite"
        className="polka-dots bg-gradient-to-b from-memoria-blue-50/50 to-white py-24"
      >
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-bold tracking-widest text-memoria-pink-400">
            HOW TO START
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-800">
            始まりは、招待から。
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-loose text-slate-500">
            V-Memoriaは、誰でも自由に登録できるオープンなSNSではありません。
            <br />
            片方がパートナーを招待することで、初めて二人だけの空間が生まれます。
          </p>

          <div className="mt-14 grid grid-cols-1 gap-8 text-left sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "招待を送る",
                desc: "あなたが、パートナーを招待します。",
              },
              {
                step: "02",
                title: "空間が生まれる",
                desc: "招待が受け入れられると、二人だけの空間が作られます。",
              },
              {
                step: "03",
                title: "思い出を重ねる",
                desc: "Sync・Record・Promiseで、日々の記憶を積み重ねていきます。",
              },
            ].map((s) => (
              <div key={s.step}>
                <span className="text-3xl font-black text-memoria-pink-200">
                  {s.step}
                </span>
                <h3 className="mt-2 font-bold text-slate-800">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <a
              href="#"
              className="inline-block w-full rounded-full bg-gradient-to-r from-memoria-pink-400 to-memoria-blue-400 px-10 py-4 text-center font-bold text-white shadow-lg shadow-memoria-pink-200/60 transition hover:opacity-90 sm:w-auto"
            >
              招待を受けて始める
            </a>
            <p className="mt-4 text-xs text-slate-400">
              ※現在招待制でご利用いただけます。近日公開予定です。
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 sm:flex-row">
          <span className="font-black text-slate-600">V-Memoria</span>
          <span>V = Virtual, Memoria = 記憶・思い出</span>
        </div>
      </footer>
    </main>
  );
}
