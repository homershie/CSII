import scenery from './assets/sample.png';
import styles from './styles.module.css';

const SNIPPET = `/* 圖區域：container-type 讓下面的 cqw 依「圖寬」計算 */
.stage {
  position: relative;
  aspect-ratio: 3 / 4;
  container-type: inline-size;
}
.bubble {
  position: absolute;
  right: -10px;                       /* 凸出圖右緣 */
  bottom: -28px;                      /* 凸出圖下緣 */
  /* 不分段：clamp 隨圖平滑縮放，下/上限＝手機/PC 兩個 Figma 尺寸 */
  width: clamp(272px, 87cqw, 508px);
  display: flex; flex-direction: column; gap: 8px;
  padding: 16px 24px;
  background: #fff;
  border-radius: 32px;
  font-size: 24px;
  /* 三角＋角色＋圓框共用一道陰影（filter 連 ::before/::after 一起罩） */
  filter: drop-shadow(1px 4px 8px rgba(14,63,110,.25));
}
.bubble::before {                     /* 三角話尾，尖端朝左指向角色 */
  content: '';
  position: absolute;
  left: -12px; top: 30px;
  width: 14px; height: 25px;
  background: url(triangle.svg) center / contain;
}
.bubble::after {                      /* 角色：固定 80×80，疊在框左下外側 */
  content: '';
  position: absolute;
  left: -96px; top: 0;
  width: 80px; height: 80px;
  background: url(chr.png) center / 100%;
}`;

function Bubble() {
  return (
    <div className={styles.bubble}>屹耳（Eeyore）是《小熊維尼》系列中一隻帶著憂鬱氣質的毛驢。</div>
  );
}

export default function CharacterSpeechBubbleDemo() {
  return (
    <div className={styles.page}>
      <section>
        <div className={styles.sectionLabel}>
          對話框絕對定位壓在圖右下角，可拖曳右下角縮放預覽 → bubble 用 clamp
          隨圖寬平滑縮放（不分段、無斷點）
        </div>
        <div className={styles.resizeWrap}>
          <div className={styles.stage}>
            <img src={scenery} alt="景點" className={styles.photo} />
            <Bubble />
          </div>
          <div className={styles.resizeHint}>
            ← 拖曳右下角調整圖寬，觀察對話框隨圖平滑縮放（角色與字級固定 px），且不被裁切
          </div>
        </div>
      </section>

      <section>
        <div className={styles.sectionLabel}>手機 375 寬預覽（同一套變數）</div>
        <div className={styles.resizeWrap} style={{ width: 375 }}>
          <div className={styles.stage}>
            <img src={scenery} alt="景點" className={styles.photo} />
            <Bubble />
          </div>
          <div className={styles.resizeHint}>← 預設手機 375 寬，對話框觸底約 272px</div>
        </div>
      </section>

      <section>
        <div className={styles.sectionLabel}>核心寫法</div>
        <pre className={styles.code}>{SNIPPET}</pre>
      </section>
    </div>
  );
}
