# Border Image

## 目的

學會 CSS `border-image` 的四個關鍵屬性（source / slice / width / outset）
與 repeat 模式（stretch / repeat / round / space）如何互動。

## Demo 內容

同一張 54×54 的 9-slice SVG 邊框圖（由使用者 4 個 18×18 圓角切片組合，
中間加上紅色點作裝飾邊條），切成 18 像素的 9-slice，套用到三個相同尺寸的
容器上，分別使用 `stretch` / `repeat` / `round` 模式。肉眼可直接對比差異。

## 關鍵發現

- `border-image-slice` 的數字沒有單位 = 像素；加 `%` 則是百分比
- 四個角永遠不會重複或縮放；差異在上下左右四條邊
- `stretch`：邊條被拉伸填滿，中間的點會被拉長成橢圓
- `repeat`：邊條原尺寸重複，邊緣可能被切斷
- `round`：自動微調 tile 寬度讓整條邊剛好放整數個 tile，不切斷
- 要讓 border-image 顯示，容器必須同時有 `border-style`（即使是 transparent）

## 瀏覽器支援

Chrome / Edge / Firefox / Safari 全支援，近 10 年版本皆可。

## 相關連結

- MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/border-image
- Can I Use: https://caniuse.com/border-image

## 踩雷紀錄

（隨實驗過程補充）

## 下一步

- v2：加 slider 互動控制 width / slice / outset
- v3：切換多組 source 圖片
