# GitHub Pages 自動部署設計

**日期：** 2026-04-16
**狀態：** 已核准

## 目標

設定 GitHub Actions workflow，讓每次 push 到 `main` branch 時自動 build 並部署到 GitHub Pages。

**目標 URL：** `https://homershie.github.io/CSII/`

## 技術棧

- Vite 5 + React 18 + TypeScript + React Router v6
- GitHub Actions + 官方 Pages artifact 機制（不需要 `gh-pages` 分支）

## 方案選擇

選用 **BrowserRouter + 404.html redirect**（方案 A）：

- URL 乾淨（`/CSII/css-techniques/border-image`）
- 使用 spa-github-pages 標準技巧處理直接輸入 URL 的情況

## 變更項目

### 1. `vite.config.ts`

加入 `base: '/CSII/'`，確保 production build 的靜態資源路徑正確。

```ts
export default defineConfig({
  base: '/CSII/',
  // ...其他設定不變
});
```

### 2. React Router `basename`

找到 `BrowserRouter`（或 `createBrowserRouter`）的初始化位置，加上 `basename="/CSII"`。

### 3. `public/404.html`

GitHub Pages 遇到未知路徑時回傳此頁面。利用 redirect 把路徑資訊帶回 `index.html`：

- 將當前路徑 encode 後附加到 query string，redirect 到根路徑
- `index.html` 的 `<head>` 內加一段 script，在頁面載入時把 query string 還原成正確路徑並推入 history

這是 [spa-github-pages](https://github.com/rafgraph/spa-github-pages) 的標準做法。

### 4. `.github/workflows/deploy.yml`

**觸發條件：** push 到 `main` branch

**步驟：**

1. `actions/checkout@v4`
2. `actions/setup-node@v4`（Node 22，啟用 npm cache）
3. `npm ci`
4. `npm run build`（包含 tsc 型別檢查 + vite build）
5. `actions/upload-pages-artifact@v3`（上傳 `dist/`）
6. `actions/deploy-pages@v4`（部署到 GitHub Pages）

**Permissions：** `pages: write`、`id-token: write`（官方 Pages action 需要）

**Concurrency：** 同時只允許一個部署進行，避免 race condition。

## GitHub 上的手動設定

部署 workflow 跑完之前，需要先在 GitHub repo 設定中啟用 Pages：

- Settings → Pages → Source 選 **GitHub Actions**

## 不在此範圍內

- 自訂 domain
- Preview deployments（PR 環境）
- 其他 branch 的部署
