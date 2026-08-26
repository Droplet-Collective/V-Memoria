import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "V-Memoria | 二人だけの、思い出の場所",
  description:
    "バーチャルな関係を育む二人のための、二人専用SNS「V-Memoria」。チャット記録・写真アルバム・記念日を、二人だけの閉じた空間に。招待制で始める、あたたかい思い出づくり。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className="font-sans text-slate-700 antialiased">{children}</body>
    </html>
  );
}
