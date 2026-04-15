# CSII · UI Lab

個人 UI 實驗場。CSS 技巧、元件實驗、公司設計稿切版練習。

## 開發

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| 指令              | 用途                  |
| ----------------- | --------------------- |
| `npm run dev`     | 啟動開發伺服器        |
| `npm run build`   | 型別檢查 + 產出 dist/ |
| `npm run preview` | 預覽 build 產物       |
| `npm run lint`    | ESLint                |
| `npm run format`  | Prettier 格式化       |
| `npm test`        | Vitest 單元測試       |

## 專案結構

```
src/
├─ app/          Shell：Router / Layout / HomePage / NotFound
├─ registry/     自動載入 experiments/ 下的所有實驗
├─ components/   Shell 用的共用元件
├─ experiments/  所有實驗（分三類）
│  ├─ css-techniques/
│  ├─ layouts/
│  └─ components/
└─ styles/       globals.css + theme.css
```

## 如何新增一個實驗

1. 在 `src/experiments/<category>/<slug>/` 建資料夾，其中：
   - `<category>` 是 `css-techniques` / `layouts` / `components` 其中之一
   - `<slug>` 是路由 URL 用的英數小寫連字符，例：`border-image`
2. 至少放這三個檔案：
   - `meta.ts` — 匯出 `ExperimentMeta`（參考 [border-image 範例](src/experiments/css-techniques/border-image/meta.ts)）
   - `index.tsx` — 預設匯出 React 元件，就是這個實驗的 demo
   - `README.md` — 目的、關鍵發現、踩雷紀錄
3. 需要 CSS Modules 就加 `styles.module.css`，圖片放 `assets/`
4. 儲存即可：Registry 會在下次 build / dev reload 自動掃到

無需改動路由表或索引。

## 技術棧

Vite 5 · React 18 · TypeScript (strict) · Tailwind v3 · CSS Modules · React Router v6 · Vitest · ESLint · Prettier · Husky

## 設計文件

[docs/superpowers/specs/2026-04-15-ui-lab-design.md](docs/superpowers/specs/2026-04-15-ui-lab-design.md)
