import type { Metadata } from "next";
import { DemoApp } from "./demo-app";

export const metadata: Metadata = {
  title: "デモ空間",
  description: "V-Memoria をブラウザの中だけで体験できるデモ空間。入力内容はこのブラウザにだけ保存されます。",
  robots: { index: false },
};

export default function DemoPage() {
  return <DemoApp />;
}
