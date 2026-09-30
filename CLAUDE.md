@AGENTS.md

# V-Memoria

バーチャル空間での特別な関係にある二人組向けの、招待制の二人専用SNS。詳細な仕様は [SPEC.md](./SPEC.md) を参照。

- LP上では「VRChat」「お砂糖」など具体的な言葉を使わず、ぼかした表現にする
- コア機能: シンプルなチャット（Sync）／写真アルバム（Record）／記念日・約束（Promise）／空間を閉じる（Fade）
- カウントダウン機能は未実装。実装済みの機能のみをLPで訴求する
- ルート: `/`（LP）、`/demo`（ブラウザ内だけで動くデモ空間、localStorage 保存）、`/terms`・`/privacy`（プレースホルダー）
- 配信: `output: "export"` の静的エクスポートを GitHub Pages（`/V-Memoria` basePath）にデプロイ。`public/` の画像は `lib/asset.ts` の `asset()` 経由で参照する
- 架空サービスのため、登録・決済に見える操作は「招待コード」モーダルや「近日公開」表示にとどめ、どこにも送信しない
