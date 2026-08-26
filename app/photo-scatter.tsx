import Image from "next/image";

export type ScatterItem = {
  src: string;
  /** 位置・サイズ・回転・不透明度をまとめて指定する */
  className: string;
};

/**
 * セクション背景に写真をまばらに散らす装飾レイヤー。
 * 親セクションに relative を付け、このコンポーネントを最初の子に置く。
 */
export function PhotoScatter({ items }: { items: ScatterItem[] }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
    >
      {items.map((item) => (
        <div key={item.src + item.className} className={`absolute ${item.className}`}>
          <Image
            src={item.src}
            alt=""
            fill
            sizes="(max-width: 640px) 45vw, 340px"
            className="rounded-[2rem] object-cover saturate-50"
          />
        </div>
      ))}
    </div>
  );
}
