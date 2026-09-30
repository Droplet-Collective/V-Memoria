/** basePath（GitHub Pages では /V-Memoria）を付けた public 配下のパスを返す */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}

export const PHOTOS = [
  { src: "/images/photo-01.webp", world: "夜明けの展望台", date: "2026.08.14", dark: false },
  { src: "/images/photo-02.webp", world: "水底のプラネタリウム", date: "2026.07.02", dark: true },
  { src: "/images/photo-03.webp", world: "春待ちの屋上庭園", date: "2026.05.23", dark: false },
  { src: "/images/photo-04.webp", world: "終電のない駅", date: "2026.03.09", dark: true },
];
