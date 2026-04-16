# Known Issues

Development 過程中發現的問題與解法紀錄。

---

## 1. SVG border-image-slice 在缺少固有尺寸時切割位置偏移

**日期：** 2026-04-16

**影響範圍：** `src/experiments/css-techniques/border-image/`

**症狀：**
使用 `border-image-slice: 32` 搭配 82x82 的 SVG 時，repeat / round 模式下角落的圖案會跑進邊緣 tile 裡一起重複，看起來像是 slice 切割位置不正確。

**根因：**
SVG 檔案只有 `viewBox="0 0 82 82"` 但沒有設定 `width` / `height` 屬性。瀏覽器在將 SVG 作為 `border-image-source` 光柵化時，因為缺少 intrinsic dimensions（固有尺寸），會以非 82x82 的大小渲染，導致 `border-image-slice: 32`（以像素/座標為單位）對應到錯誤的 SVG 座標位置。角落區域被切得太小，角落圖案因此被包含在邊緣 tile 中。

**解法：**
在 SVG 根元素加上明確的 `width` 和 `height`：

```xml
<!-- 修正前 -->
<svg viewBox="0 0 82 82" ...>

<!-- 修正後 -->
<svg width="82" height="82" viewBox="0 0 82 82" ...>
```

**替代方案：**
改用百分比 slice 值，不依賴像素單位：

```css
/* 32 / 82 ≈ 39.02% */
border-image-slice: 39.02%;
border-image-slice: 39.02% fill; /* 需要 fill 時 */
```

**受影響檔案：**

- `assets/frame02.svg`
- `assets/frame02-fill.svg`
- `assets/frame02-fill-without-border.svg`

**學到的原則：**
用於 CSS `border-image-source` 的 SVG 一定要設定 `width` / `height`，確保瀏覽器能正確解析 `border-image-slice` 的座標值。
