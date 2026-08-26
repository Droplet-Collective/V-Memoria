import Image from "next/image";

export type ScatterItem = {
  src: string;
  /** 位置・サイズ・回転 */
  className: string;
  /** 不透明度やぼかしなど、写真本体だけに効かせる装飾 */
  imageClassName: string;
};

/**
 * セクション背景に写真をまばらに散らす装飾レイヤー。
 * 親セクションに relative を付け、このコンポーネントを最初の子に置く。
 * 白い縁取りは写真の不透明度に引きずられないよう、外側の余白として持たせている。
 */
export function PhotoScatter({ items }: { items: ScatterItem[] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
    >
      {items.map((item) => (
        <div
          key={item.src + item.className}
          className={`absolute rounded-lg bg-white/70 p-1.5 ${item.className}`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-sm">
            <Image
              src={item.src}
              alt=""
              fill
              sizes="(max-width: 640px) 45vw, 340px"
              className={`object-cover saturate-50 ${item.imageClassName}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
