# CSII · UI Lab 設計文件

**日期：** 2026-04-15
**作者：** homershie@gmail.com
**狀態：** Draft → 待使用者審閱

---

## 1. 目的與定位

建立一個個人 UI 實驗場，定位為 **「先個人練習，熟了再整理成公司共享範例」**。
初期用途兩類：

1. 純 CSS 技巧實驗（border-image、clip-path、container queries…）
2. 公司設計稿的實際切版練習

未來整包或單一實驗可抽取移植回公司的 Next + React + Tailwind 專案。

## 2. 技術棧

| 項目 | 選擇 | 理由 |
|------|------|------|
| 建置工具 | Vite 5 | 啟動快、HMR 即時、適合實驗迭代 |
| UI 框架 | React 18 | 對齊公司主線，未來移植成本低 |
| 語言 | TypeScript（`strict: true`） | 對齊公司嚴格度、抓真實 bug |
| 樣式主力 | Tailwind CSS v3 | 公司主力工具，練手感 |
| 樣式輔助 | CSS Modules | 複雜 CSS 技巧（border-image、keyframes、`@property`）寫原生 |
| 路由 | React Router v6 | 心智模型貼近 Next App Router |
| 測試 | Vitest | 僅測 Registry 核心邏輯 |
| 程式碼品質 | ESLint + Prettier + Husky + lint-staged | 全開嚴格模式 |

## 3. 架構總覽

三層分工、單一耦合點：

1. **Shell**（`src/app/`）：Router、Layout、首頁、分類 tabs
2. **Registry**（`src/registry/`）：build time 掃描 `experiments/**/meta.ts`，組出路由表與索引
3. **Experiments**（`src/experiments/`）：每個實驗一個資料夾，完全自足

**關鍵原則**：Shell 不認識任何具體實驗，實驗之間也互不認識。新增實驗 = 新增資料夾 + `meta.ts`，其他檔案零改動。

## 4. 資料夾結構

```
d:/git/CSII/
├─ .husky/
│  └─ pre-commit                  # lint-staged
├─ .vscode/
│  └─ settings.json               # format on save、tailwind intellisense
├─ public/
├─ src/
│  ├─ main.tsx                    # entry
│  ├─ app/
│  │  ├─ App.tsx                  # <RouterProvider>
│  │  ├─ router.tsx               # 從 registry 組出 routes
│  │  ├─ Layout.tsx               # header + sidebar + <Outlet>
│  │  ├─ HomePage.tsx             # 首頁：tabs + 卡片網格
│  │  └─ NotFound.tsx
│  ├─ registry/
│  │  ├─ types.ts                 # ExperimentMeta、Category、Status
│  │  ├─ loadExperiments.ts       # import.meta.glob 邏輯
│  │  ├─ loadExperiments.test.ts  # Vitest 單元測試
│  │  └─ index.ts                 # export experiments, routes, byCategory
│  ├─ components/                 # Shell 用的共用元件
│  │  ├─ ExperimentCard.tsx
│  │  ├─ StatusBadge.tsx
│  │  └─ CategoryTabs.tsx
│  ├─ experiments/
│  │  ├─ css-techniques/
│  │  │  └─ border-image/
│  │  │     ├─ meta.ts
│  │  │     ├─ index.tsx          # 主 demo（三變體對照）
│  │  │     ├─ styles.module.css
│  │  │     ├─ assets/            # 邊框圖片
│  │  │     └─ README.md
│  │  ├─ layouts/
│  │  │  └─ .gitkeep
│  │  └─ components/
│  │     └─ .gitkeep
│  └─ styles/
│     ├─ globals.css              # Tailwind directives + reset
│     └─ theme.css                # CSS 變數
├─ docs/
│  └─ superpowers/
│     └─ specs/                   # 本設計文件所在
├─ .eslintrc.cjs
├─ .prettierrc
├─ tailwind.config.ts
├─ tsconfig.json                  # strict: true
├─ vite.config.ts
├─ package.json
└─ README.md                      # 專案總覽 + 「如何新增實驗」
```

## 5. Registry 規格

### 型別（`src/registry/types.ts`）

```ts
import type { LazyExoticComponent, ComponentType } from 'react';

export type Category = 'css-techniques' | 'layouts' | 'components';
export type Status = 'wip' | 'done' | 'archived';

export interface ExperimentMeta {
  slug: string;              // 從資料夾名推導，例：'border-image'
  category: Category;        // 從路徑推導
  title: string;
  description: string;
  status: Status;
  tags: string[];
  createdAt: string;         // 'YYYY-MM-DD'
  Component: LazyExoticComponent<ComponentType>;
}
```

### 每個實驗的 `meta.ts`

```ts
import { lazy } from 'react';
import type { ExperimentMeta } from '@/registry/types';

const meta: Omit<ExperimentMeta, 'slug' | 'category'> = {
  title: 'Border Image',
  description: 'CSS border-image 的 slice / repeat / space 三種模式對照',
  status: 'wip',
  tags: ['css', 'border', 'svg'],
  createdAt: '2026-04-15',
  Component: lazy(() => import('./index')),
};

export default meta;
```

### 載入邏輯（`src/registry/loadExperiments.ts`）

```ts
const modules = import.meta.glob<{
  default: Omit<ExperimentMeta, 'slug' | 'category'>;
}>('/src/experiments/*/*/meta.ts', { eager: true });

export const experiments: ExperimentMeta[] = Object.entries(modules).map(
  ([path, mod]) => {
    const parts = path.split('/');
    const category = parts[parts.length - 3] as Category;
    const slug = parts[parts.length - 2];
    return { ...mod.default, slug, category };
  }
);

export const byCategory = (cat: Category) =>
  experiments.filter((e) => e.category === cat);
```

### 路由組裝

每個實驗自動掛到 `/:category/:slug`，Layout 外層包 `<Suspense>` 處理 lazy load。

## 6. UI 設計

### Layout

- **Header**：永遠顯示，點 logo/標題回首頁
- **Sidebar**：僅實驗內頁顯示，列出同分類其他實驗方便切換
- **內容區**：`<Outlet />` 放首頁或實驗頁

### HomePage

- 標題 + 副標
- `CategoryTabs`（CSS Techniques / Layouts / Components，預設第一個）
- 卡片網格（`ExperimentCard`）
- 空分類顯示占位訊息

### ExperimentCard

欄位：標題、狀態 badge、一句描述、tags。
互動：hover 微浮起 + 邊框變色，點擊導航到 `/:category/:slug`。

### CategoryTabs

網址同步：`/` → CSS Techniques；`/?cat=layouts` → Layouts。

## 7. 樣式分工

- **Tailwind 為主**：版面、間距、色彩、字體、基本互動狀態
- **CSS Modules 為輔**：border-image、複雜 keyframes、`@property`、clip-path 這類用 arbitrary value 會醜的屬性
- **第一版先全 Tailwind**，遇到痛點再搬到 Module

## 8. 第一個實驗：border-image

### MVP 範圍

三個靜態變體並排：`stretch` / `repeat` / `round`。
用途：驗證 Registry / Router / Layout 是否運作，兼當第一個教學單元。

### 內容

- `index.tsx`：三個 demo box，每個綁不同的 border-image-repeat 模式
- `styles.module.css`：border-image 相關 CSS
- `assets/`：至少一張示範用邊框圖片（SVG 或 PNG）
- `README.md`：目的、關鍵發現（slice 單位、round 行為、outset 效果…）、瀏覽器支援、相關連結、踩雷紀錄

### 非 MVP（明確排除）

- 互動 slider（width / slice / outset 即時調整）—— 留給 v2
- 多組 source 切換 —— 留給 v3

## 9. 測試策略

| 層級 | 做法 |
|------|------|
| Registry 邏輯 | Vitest 單元測試，mock `import.meta.glob`，驗證 slug/category 解析 |
| TypeScript | `tsc --noEmit` 當 smoke test，build 時跑 |
| 實驗 demo | 不自動測，人眼 + DevTools |
| 視覺回歸 | 不做 |

### package.json scripts

```json
{
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext ts,tsx",
  "format": "prettier --write .",
  "test": "vitest"
}
```

## 10. MVP 範圍（第一輪 ship）

**必做：**

- [ ] 專案 scaffold：Vite + React + TS strict + Tailwind + ESLint + Prettier + Husky + React Router
- [ ] Registry 三件套：`types.ts` + `loadExperiments.ts` + `index.ts`
- [ ] Shell：`Layout` + `HomePage` + `CategoryTabs` + `ExperimentCard` + `StatusBadge`
- [ ] 第一個實驗：border-image 靜態三變體 + README + 示範邊框圖
- [ ] `layouts/` 與 `components/` 空資料夾（`.gitkeep`）
- [ ] Registry Vitest 單元測試（3-4 個 case）
- [ ] 頂層 `README.md`：專案總覽 + 「如何新增實驗」步驟

**不做（留給未來）：**

- border-image 互動 slider
- 部署（Vercel / GitHub Pages）
- 截圖縮圖
- 搜尋 / 篩選 / 分頁
- tags 篩選（等累積 3+ 實驗）
- 響應式預覽框（等開始做公司切版）

## 11. 未來擴充路線

| 觸發時機 | 加什麼 |
|----------|--------|
| 實驗 >= 3 個 | 首頁 tags 篩選 |
| 開始做公司切版 | `layouts/` 加 `breakpoints` meta + 響應式預覽框 |
| 同事開始看 | 部署到 Vercel；card 加截圖縮圖 |
| 實驗 > 15 個 | 加搜尋框 |
| 要抽元件回公司 | README 加「如何抽取到 Next 專案」段落 |

## 12. 設計原則摘要

- **單一耦合點**：Registry 是 Shell 與 Experiments 的唯一橋樑
- **實驗自足**：每個實驗目錄自帶所有依賴（assets、styles、README），好抽取
- **YAGNI**：MVP 不做互動、不做部署、不做搜尋
- **對齊公司**：技術棧貼近公司 Next + React + Tailwind，成果可移植
- **嚴格模式全開**：TS strict、ESLint、Prettier、Husky pre-commit
