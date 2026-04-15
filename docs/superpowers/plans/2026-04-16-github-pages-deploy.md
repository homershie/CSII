# GitHub Pages 自動部署 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 設定 GitHub Actions，讓每次 push 到 `main` branch 時自動 build 並部署到 `https://homershie.github.io/CSII/`。

**Architecture:** 使用 Vite `base` 設定確保靜態資源路徑正確；React Router `basename` 讓 SPA 在子路徑下正常運作；`public/404.html` + `index.html` 內嵌 script 處理 GitHub Pages 的 SPA routing 問題；GitHub Actions 官方 Pages artifact 機制完成部署。

**Tech Stack:** Vite 5、React Router v6（`createBrowserRouter`）、GitHub Actions（`actions/upload-pages-artifact`、`actions/deploy-pages`）

---

## File Map

| 動作   | 路徑                           | 負責                          |
| ------ | ------------------------------ | ----------------------------- |
| Modify | `vite.config.ts`               | 加入 `base: '/CSII/'`         |
| Modify | `src/app/router.tsx`           | 加入 `{ basename: '/CSII' }`  |
| Modify | `index.html`                   | 加入 SPA redirect 還原 script |
| Create | `public/404.html`              | GitHub Pages 404 redirect     |
| Create | `.github/workflows/deploy.yml` | CI/CD workflow                |

---

### Task 1: Vite base 路徑

**Files:**

- Modify: `vite.config.ts`

- [ ] **Step 1: 修改 vite.config.ts**

將 `base: '/CSII/'` 加入 config：

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  base: '/CSII/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
```

- [ ] **Step 2: 驗證 dev server 仍可正常啟動**

```bash
npm run dev
```

Expected: 瀏覽器開 `http://localhost:5173/CSII/` 可以看到首頁（注意路徑變成 `/CSII/`）。

- [ ] **Step 3: Commit**

```bash
git add vite.config.ts
git commit -m "feat: set vite base to /CSII/ for GitHub Pages"
```

---

### Task 2: React Router basename

**Files:**

- Modify: `src/app/router.tsx`

- [ ] **Step 1: 修改 router.tsx**

在 `createBrowserRouter` 的第二個參數加入 `basename`：

```ts
import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from './HomePage';
import { ExperimentRoute } from './ExperimentRoute';
import { NotFound } from './NotFound';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: ':category/:slug', element: <ExperimentRoute /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: '/CSII' },
);
```

- [ ] **Step 2: 驗證路由正常**

```bash
npm run dev
```

Expected: 開 `http://localhost:5173/CSII/`，點擊實驗連結，URL 應為 `/CSII/css-techniques/border-image`，頁面正確顯示。

- [ ] **Step 3: Commit**

```bash
git add src/app/router.tsx
git commit -m "feat: add basename /CSII to React Router for GitHub Pages"
```

---

### Task 3: SPA routing — 404.html redirect

GitHub Pages 遇到未知路徑（如直接輸入 `/CSII/css-techniques/border-image`）會回傳 404。
解法：讓 404.html 把路徑資訊 encode 成 query string，redirect 回 `/CSII/`，再由 `index.html` 還原。

**Files:**

- Create: `public/404.html`

- [ ] **Step 1: 建立 public/404.html**

```html
<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <title>CSII · UI Lab</title>
    <script>
      // spa-github-pages redirect technique
      // https://github.com/rafgraph/spa-github-pages
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol +
          '//' +
          l.hostname +
          (l.port ? ':' + l.port : '') +
          l.pathname
            .split('/')
            .slice(0, 1 + pathSegmentsToKeep)
            .join('/') +
          '/?/' +
          l.pathname
            .slice(1)
            .split('/')
            .slice(pathSegmentsToKeep)
            .join('/')
            .replace(/&/g, '~and~') +
          (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
          l.hash,
      );
    </script>
  </head>
  <body></body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add public/404.html
git commit -m "feat: add 404.html SPA redirect for GitHub Pages"
```

---

### Task 4: SPA routing — index.html 還原 script

**Files:**

- Modify: `index.html`

- [ ] **Step 1: 在 index.html `<head>` 內加入還原 script**

在 `<meta name="viewport" ...>` 後面、`<title>` 前面插入這段 script：

```html
<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>
      // spa-github-pages: restore URL from 404.html redirect
      (function (l) {
        if (l.search[1] === '/') {
          var decoded = l.search
            .slice(1)
            .split('&')
            .map(function (s) {
              return s.replace(/~and~/g, '&');
            })
            .join('?');
          window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
        }
      })(window.location);
    </script>
    <title>CSII · UI Lab</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add SPA URL restore script to index.html for GitHub Pages"
```

---

### Task 5: GitHub Actions deploy workflow

**Files:**

- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 建立 .github/workflows/deploy.yml**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: 寫入 deploy.yml**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: 驗證 workflow 語法**

```bash
npm run build
```

Expected: build 成功，`dist/` 產出，確認 `dist/index.html` 內有 `base href` 或資源路徑帶 `/CSII/`。

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions workflow for GitHub Pages deployment"
```

---

### Task 6: 在 GitHub 啟用 Pages 並驗證部署

- [ ] **Step 1: Push 到 main**

```bash
git push origin main
```

- [ ] **Step 2: 在 GitHub repo 設定 Pages source**

1. 開啟 `https://github.com/homershie/CSII`
2. Settings → Pages
3. Source 選 **GitHub Actions**
4. 儲存

- [ ] **Step 3: 確認 workflow 成功**

1. 開啟 repo 的 Actions tab
2. 確認 "Deploy to GitHub Pages" workflow 狀態為 ✅
3. 確認部署 URL 顯示為 `https://homershie.github.io/CSII/`

- [ ] **Step 4: 驗證首頁**

開啟 `https://homershie.github.io/CSII/`，確認頁面正確顯示。

- [ ] **Step 5: 驗證直接輸入 URL 的路由**

直接在瀏覽器輸入 `https://homershie.github.io/CSII/css-techniques/border-image`（不透過點擊），確認頁面正確顯示（測試 404.html redirect 機制）。
