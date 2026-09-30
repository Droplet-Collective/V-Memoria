# V-Memoria

バーチャルの世界で出会ったふたりのための、招待制の二人専用スペース **V-Memoria** の公式ランディングページと、ブラウザ内で操作できるデモ画面です。

- 公開 URL: https://droplet-collective.github.io/V-Memoria/
- デモ画面: https://droplet-collective.github.io/V-Memoria/demo/

> V-Memoria は架空のサービスのコンセプトページです。実際のアカウント登録・決済は行えません。

## 構成

| ルート | 内容 |
| --- | --- |
| `/` | ランディングページ（Sync / Record / Promise / Fade の紹介、はじめかた、お知らせ、FAQ） |
| `/demo/` | クライアントサイドだけで動くデモ空間。入力内容は `localStorage` に保存 |
| `/terms/` `/privacy/` | 利用規約・プライバシーポリシー（プレースホルダー） |

Next.js（App Router）+ Tailwind CSS。`output: "export"` による静的エクスポートで、GitHub Pages に配信します。

## ローカルで動かす

```bash
npm ci
npm run dev      # http://localhost:3000/ （basePath なし）
npm run lint
npm run build    # out/ に静的ファイルを出力（basePath は /V-Memoria）
```

本番ビルドでは `next.config.mjs` が `basePath` / `assetPrefix` に `/V-Memoria` を付けます。`public/` 配下の画像を参照するときは `lib/asset.ts` の `asset()` を通してください。

## デプロイ

`main` への push で `.github/workflows/pages.yml` が `out/` を GitHub Pages にデプロイします。
初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** を「**GitHub Actions**」に切り替えてください。
