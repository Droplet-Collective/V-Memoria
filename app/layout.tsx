import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://droplet-collective.github.io/V-Memoria/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "V-Memoria | ふたりの記憶に、帰る場所を。",
    template: "%s | V-Memoria",
  },
  description:
    "バーチャルの世界で出会ったふたりのための、招待制の二人専用スペース。交わした言葉、撮った写真、大切な日と約束を、ふたりだけの閉じた空間に静かに残します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "V-Memoria",
    title: "V-Memoria | ふたりの記憶に、帰る場所を。",
    description:
      "バーチャルの世界で出会ったふたりのための、招待制の二人専用スペース。Sync / Record / Promise / Fade。",
    url: SITE_URL,
    images: [{ url: "og.png", width: 1200, height: 630, alt: "V-Memoria" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "V-Memoria | ふたりの記憶に、帰る場所を。",
    description: "招待制の、ふたりだけの記憶の場所。",
    images: ["og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- ルートレイアウトなので全ページに効く */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Zen+Maru+Gothic:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans text-slate-700 antialiased">{children}</body>
    </html>
  );
}
