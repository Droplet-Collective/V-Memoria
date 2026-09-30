import { asset } from "@/lib/asset";

/** public/images の写真。静的エクスポート用に basePath を付けたプレーンな img。 */
export function Photo({
  src,
  alt = "",
  className = "",
  dark = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 静的エクスポートのためプレーンな img を使う
    <img
      src={src.startsWith("data:") ? src : asset(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`${className} ${dark ? "brightness-[1.45] contrast-[0.95]" : ""}`}
    />
  );
}
