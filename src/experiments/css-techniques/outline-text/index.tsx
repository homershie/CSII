import styles from './styles.module.css';

const TITLE_PREFIX = '山水';
const TITLE_OUTLINE = '之間';
const TITLE_SUFFIX = '，遇見大龍門';

export default function OutlineTextDemo() {
  return (
    <div className={styles.page}>
      {/* feMorphology 共用 filter（藏起來不顯示） */}
      <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="pixel-outline-dark">
            <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="THICKNESS" />
            <feFlood floodColor="#0a0a0a" result="COLOR" />
            <feComposite in="COLOR" in2="THICKNESS" operator="in" result="COLORED_OUTLINE" />
            <feComposite in="COLORED_OUTLINE" in2="SourceAlpha" operator="out" />
          </filter>
          <filter id="pixel-outline-light">
            <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="THICKNESS" />
            <feFlood floodColor="#ffffff" result="COLOR" />
            <feComposite in="COLOR" in2="THICKNESS" operator="in" result="COLORED_OUTLINE" />
            <feComposite in="COLORED_OUTLINE" in2="SourceAlpha" operator="out" />
          </filter>
          <filter id="pixel-outline-thick">
            <feMorphology in="SourceAlpha" operator="dilate" radius="4" result="THICKNESS" />
            <feFlood floodColor="#0a0a0a" result="COLOR" />
            <feComposite in="COLOR" in2="THICKNESS" operator="in" result="COLORED_OUTLINE" />
            <feComposite in="COLORED_OUTLINE" in2="SourceAlpha" operator="out" />
          </filter>
        </defs>
      </svg>
      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          ⓪ 宋體 + 內部透明：為什麼邊緣會出現多個形狀疊在一起
        </div>
        <p className={styles.code} style={{ background: 'transparent', border: 'none' }}>
          {`宋體 glyph 路徑帶有大量起筆 / 頓筆 / 撇捺三角形細節，-webkit-text-stroke 是「忠實描出字型給的整條路徑」，
所以這些細節全部會被畫成邊線 → 視覺上像很多形狀疊在一起。SVG <text stroke> 其實有完全一樣的問題，
只是通常 stroke-width 較細 + stroke-linejoin: round 才看起來乾淨。

非 SVG 的三種緩解方法（下方對照）：
  A. 細描邊（1~2px）— 細節擠在一起的視覺面積小
  B. 換黑體 — 筆畫均勻、輪廓乾淨
  C. 假透明 — fill 設成容器背景色，純色底看起來像空心（漸層底會破功）`}
        </p>
        <div className={styles.grid}>
          <div>
            <div className={styles.label}>A. 宋體 + 細描邊 1.2px（內部真透明）</div>
            <div className={styles.stage}>
              <h2 className={`${styles.title} ${styles.fontSerif}`}>
                {TITLE_PREFIX}
                <span className={styles.outlineStrokeThin}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>
              {`font-family: 'Noto Serif TC';
color: transparent;
-webkit-text-stroke: 1.2px var(--color-ink);`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>B. 黑體 + 描邊 2px（內部真透明）</div>
            <div className={styles.stage}>
              <h2 className={`${styles.title} ${styles.fontSans}`}>
                {TITLE_PREFIX}
                <span className={styles.outlineStroke}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>
              {`font-family: 'Noto Sans TC';
color: transparent;
-webkit-text-stroke: 2px var(--color-ink);`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>C. 宋體 + 假透明（純色底，視覺像空心）</div>
            <div className={styles.stage}>
              <h2 className={`${styles.title} ${styles.fontSerif}`}>
                {TITLE_PREFIX}
                <span className={styles.outlineFakeTransparent}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>
              {`color: var(--color-surface);   /* = 容器背景色 */
-webkit-text-stroke: 3px var(--color-ink);
paint-order: stroke fill;
/* 漸層 / 圖片底下會破功 */`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>C-fail. 同 C 但放漸層底 → 露餡</div>
            <div className={`${styles.stage} ${styles.stageGradient}`}>
              <h2 className={`${styles.title} ${styles.fontSerif}`} style={{ color: '#fff' }}>
                {TITLE_PREFIX}
                <span className={styles.outlineFakeTransparent}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>
              {`/* 內裡填的是 --color-surface，
   遇到漸層底就明顯看出是「色塊」而非透明 */`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>C-fail-2. 同 C 但放圖片底 → 露餡更明顯</div>
            <div className={`${styles.stage} ${styles.stageImage}`}>
              <h2 className={`${styles.title} ${styles.fontSerif}`} style={{ color: '#fff' }}>
                {TITLE_PREFIX}
                <span className={styles.outlineFakeTransparent}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>
              {`/* 圖片底下，內裡的純色塊整個攤在陽光下，
   完全沒有「外框字」的感覺 → 這個方法 fail */`}
            </pre>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          ① -webkit-text-stroke（最常用，Chrome / Safari / Firefox 都支援）
        </div>
        <div className={styles.grid}>
          <div>
            <div className={styles.label}>淺色背景 / 黑色外框</div>
            <div className={styles.stage}>
              <h2 className={styles.title}>
                {TITLE_PREFIX}
                <span className={styles.outlineStroke}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>
              {`color: transparent;
-webkit-text-stroke: 2px var(--color-ink);`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>深色背景 / 白色外框</div>
            <div className={`${styles.stage} ${styles.stageDark}`}>
              <h2 className={styles.title} style={{ color: '#fff' }}>
                {TITLE_PREFIX}
                <span className={styles.outlineStrokeLight}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>
              {`color: transparent;
-webkit-text-stroke: 2px #fff;`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>較粗的外框（4px）</div>
            <div className={styles.stage}>
              <h2 className={styles.title}>
                {TITLE_PREFIX}
                <span className={styles.outlineStrokeThick}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>
              {`color: transparent;
-webkit-text-stroke: 4px var(--color-ink);`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>漸層底 + 白外框 + drop-shadow</div>
            <div className={`${styles.stage} ${styles.stageGradient}`}>
              <h2 className={styles.title} style={{ color: '#fff' }}>
                {TITLE_PREFIX}
                <span className={styles.outlineDuo}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>
              {`color: transparent;
-webkit-text-stroke: 2px #fff;
filter: drop-shadow(2px 4px 0 rgba(0,0,0,.4));`}
            </pre>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          ② paint-order: stroke fill（外框 + 內部填色，常見的「描邊字」）
        </div>
        <div className={styles.stage}>
          <h2 className={styles.title}>
            {TITLE_PREFIX}
            <span className={styles.outlinePaintOrder}>{TITLE_OUTLINE}</span>
            {TITLE_SUFFIX}
          </h2>
        </div>
        <pre className={styles.code}>
          {`color: var(--color-ink);
-webkit-text-stroke: 4px #0be394;
paint-order: stroke fill;  /* 先描邊再填色，外框不會吃掉字身 */`}
        </pre>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>③ text-shadow 模擬外框（純 CSS 兼容寫法）</div>
        <div className={styles.stage}>
          <h2 className={styles.title}>
            {TITLE_PREFIX}
            <span className={styles.outlineShadow}>{TITLE_OUTLINE}</span>
            {TITLE_SUFFIX}
          </h2>
        </div>
        <pre className={styles.code}>
          {`color: transparent;
text-shadow:
  -2px -2px 0 var(--color-ink),
   2px -2px 0 var(--color-ink),
  -2px  2px 0 var(--color-ink),
   2px  2px 0 var(--color-ink),
   0   -2px 0 var(--color-ink),
   0    2px 0 var(--color-ink),
  -2px  0   0 var(--color-ink),
   2px  0   0 var(--color-ink);
/* CJK 筆畫密集，offset 至少 2px 才不會把字內間隙填滿 */`}
        </pre>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>④ SVG &lt;text&gt; stroke（最精確，可調線段樣式）</div>
        <div className={styles.grid}>
          <div>
            <div className={styles.label}>細外框（stroke-width: 1.5）</div>
            <div className={styles.stage}>
              <svg viewBox="0 0 1200 150" className={styles.svg} aria-label="outline text">
                <text x="600" y="105" textAnchor="middle" className={styles.svgText}>
                  <tspan>{TITLE_PREFIX}</tspan>
                  <tspan className={styles.svgTextOutline}>{TITLE_OUTLINE}</tspan>
                  <tspan>{TITLE_SUFFIX}</tspan>
                </text>
              </svg>
            </div>
            <pre className={styles.code}>
              {`<text>
  <tspan>山水</tspan>
  <tspan fill="none" stroke="#000" stroke-width="2">之間</tspan>
  <tspan>，遇見大龍門</tspan>
</text>`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>粗外框 + linejoin round</div>
            <div className={styles.stage}>
              <svg viewBox="0 0 1200 150" className={styles.svg} aria-label="outline text thick">
                <text x="600" y="105" textAnchor="middle" className={styles.svgText}>
                  <tspan>{TITLE_PREFIX}</tspan>
                  <tspan className={styles.svgTextOutlineThick}>{TITLE_OUTLINE}</tspan>
                  <tspan>{TITLE_SUFFIX}</tspan>
                </text>
              </svg>
            </div>
            <pre className={styles.code}>
              {`stroke-width: 4;
stroke-linejoin: round;`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>虛線外框（stroke-dasharray）</div>
            <div className={styles.stage}>
              <svg viewBox="0 0 1200 150" className={styles.svg} aria-label="outline text dashed">
                <text x="600" y="105" textAnchor="middle" className={styles.svgText}>
                  <tspan>{TITLE_PREFIX}</tspan>
                  <tspan className={styles.svgTextOutlineDashed}>{TITLE_OUTLINE}</tspan>
                  <tspan>{TITLE_SUFFIX}</tspan>
                </text>
              </svg>
            </div>
            <pre className={styles.code}>
              {`fill: none;
stroke: var(--color-ink);
stroke-width: 2;
stroke-dasharray: 6 4;`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>深色背景 / 白外框</div>
            <div className={`${styles.stage} ${styles.stageDark}`}>
              <svg viewBox="0 0 1200 150" className={styles.svg} aria-label="outline text on dark">
                <text x="600" y="105" textAnchor="middle" className={styles.svgText} fill="#fff">
                  <tspan>{TITLE_PREFIX}</tspan>
                  <tspan className={styles.svgTextOutlineDark}>{TITLE_OUTLINE}</tspan>
                  <tspan>{TITLE_SUFFIX}</tspan>
                </text>
              </svg>
            </div>
            <pre className={styles.code}>
              {`fill: none;
stroke: #fff;
stroke-width: 2;`}
            </pre>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          ⑤ Codex 方案一：SVG &lt;mask&gt; 把 stroke 內半部切掉（最完美）
        </div>
        <p className={styles.code} style={{ background: 'transparent', border: 'none' }}>
          {`原理：用粗 stroke（8px）+ stroke-linejoin: round 畫字，再用 mask 把「字形內部區域」變成黑色（隱藏）。
結果只剩 stroke 的「外半部」(~4px) 顯示出來 → 乾淨外框 + 真透明 + 沒有宋體細節雜訊。`}
        </p>
        <div className={styles.grid}>
          <div>
            <div className={styles.label}>純色底（深）</div>
            <div className={`${styles.stage} ${styles.stageDark}`}>
              <svg viewBox="0 0 1200 150" className={styles.svg} aria-label="mask outline dark">
                <defs>
                  <mask id="hollow-mask-dark" maskUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="1200" height="150" fill="white" />
                    <text x="600" y="105" textAnchor="middle" className={styles.svgText}>
                      <tspan fill="white">{TITLE_PREFIX}</tspan>
                      <tspan fill="black">{TITLE_OUTLINE}</tspan>
                      <tspan fill="white">{TITLE_SUFFIX}</tspan>
                    </text>
                  </mask>
                </defs>
                <text
                  x="600"
                  y="105"
                  textAnchor="middle"
                  className={styles.svgText}
                  fill="#fff"
                  mask="url(#hollow-mask-dark)"
                >
                  <tspan>{TITLE_PREFIX}</tspan>
                  <tspan className={styles.svgMaskOutlineLight}>{TITLE_OUTLINE}</tspan>
                  <tspan>{TITLE_SUFFIX}</tspan>
                </text>
              </svg>
            </div>
            <pre className={styles.code}>
              {`<mask id="hollow">
  <rect fill="white"/>
  <text>
    <tspan fill="white">山水</tspan>
    <tspan fill="black">之間</tspan>
    <tspan fill="white">，遇見大龍門</tspan>
  </text>
</mask>

<text mask="url(#hollow)">
  <tspan>山水</tspan>
  <tspan fill="none" stroke="#fff"
         stroke-width="8" stroke-linejoin="round">之間</tspan>
  <tspan>，遇見大龍門</tspan>
</text>`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>漸層底（內部真穿透）</div>
            <div className={`${styles.stage} ${styles.stageGradient}`}>
              <svg viewBox="0 0 1200 150" className={styles.svg} aria-label="mask outline gradient">
                <defs>
                  <mask id="hollow-mask-grad" maskUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="1200" height="150" fill="white" />
                    <text x="600" y="105" textAnchor="middle" className={styles.svgText}>
                      <tspan fill="white">{TITLE_PREFIX}</tspan>
                      <tspan fill="black">{TITLE_OUTLINE}</tspan>
                      <tspan fill="white">{TITLE_SUFFIX}</tspan>
                    </text>
                  </mask>
                </defs>
                <text
                  x="600"
                  y="105"
                  textAnchor="middle"
                  className={styles.svgText}
                  fill="#fff"
                  mask="url(#hollow-mask-grad)"
                >
                  <tspan>{TITLE_PREFIX}</tspan>
                  <tspan className={styles.svgMaskOutlineLight}>{TITLE_OUTLINE}</tspan>
                  <tspan>{TITLE_SUFFIX}</tspan>
                </text>
              </svg>
            </div>
            <pre className={styles.code}>{`/* 漸層完整穿透「之間」內部，確認是真透明 */`}</pre>
          </div>

          <div>
            <div className={styles.label}>圖片底（sample.png）</div>
            <div className={`${styles.stage} ${styles.stageImage}`}>
              <svg viewBox="0 0 1200 150" className={styles.svg} aria-label="mask outline image">
                <defs>
                  <mask id="hollow-mask-img" maskUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="1200" height="150" fill="white" />
                    <text x="600" y="105" textAnchor="middle" className={styles.svgText}>
                      <tspan fill="white">{TITLE_PREFIX}</tspan>
                      <tspan fill="black">{TITLE_OUTLINE}</tspan>
                      <tspan fill="white">{TITLE_SUFFIX}</tspan>
                    </text>
                  </mask>
                </defs>
                <text
                  x="600"
                  y="105"
                  textAnchor="middle"
                  className={styles.svgText}
                  fill="#fff"
                  mask="url(#hollow-mask-img)"
                >
                  <tspan>{TITLE_PREFIX}</tspan>
                  <tspan className={styles.svgMaskOutlineLight}>{TITLE_OUTLINE}</tspan>
                  <tspan>{TITLE_SUFFIX}</tspan>
                </text>
              </svg>
            </div>
            <pre className={styles.code}>
              {`/* 圖片完整穿透「之間」內部，
   外框邊緣乾淨無宋體細節殘留 */`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>圖片底 + 黑外框（對比）</div>
            <div className={`${styles.stage} ${styles.stageImage}`}>
              <svg
                viewBox="0 0 1200 150"
                className={styles.svg}
                aria-label="mask outline image dark"
              >
                <defs>
                  <mask id="hollow-mask-img2" maskUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="1200" height="150" fill="white" />
                    <text x="600" y="105" textAnchor="middle" className={styles.svgText}>
                      <tspan fill="white">{TITLE_PREFIX}</tspan>
                      <tspan fill="black">{TITLE_OUTLINE}</tspan>
                      <tspan fill="white">{TITLE_SUFFIX}</tspan>
                    </text>
                  </mask>
                </defs>
                <text
                  x="600"
                  y="105"
                  textAnchor="middle"
                  className={styles.svgText}
                  fill="#fff"
                  mask="url(#hollow-mask-img2)"
                >
                  <tspan>{TITLE_PREFIX}</tspan>
                  <tspan className={styles.svgMaskOutline}>{TITLE_OUTLINE}</tspan>
                  <tspan>{TITLE_SUFFIX}</tspan>
                </text>
              </svg>
            </div>
            <pre className={styles.code}>{`stroke: var(--color-ink);`}</pre>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          ⑥ Codex 方案二：feMorphology + feComposite 像素級膨脹（HTML span）
        </div>
        <p className={styles.code} style={{ background: 'transparent', border: 'none' }}>
          {`原理：filter 把文字的 alpha 通道往外膨脹 (dilate)，再扣掉原始形狀 → 像素級的外框。
優點：HTML 結構維持 <span>，可以自由混排；不需要把字打散到 SVG 裡。
缺點：feMorphology 用方形 kernel，radius 越大轉角越方；radius=2 仍很可接受。`}
        </p>
        <div className={styles.grid}>
          <div>
            <div className={styles.label}>純色底 + 黑外框（radius: 2）</div>
            <div className={styles.stage}>
              <h2 className={`${styles.title} ${styles.fontSerif}`}>
                {TITLE_PREFIX}
                <span className={styles.outlineMorphologyDark}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>
              {`<filter id="pixel-outline">
  <feMorphology in="SourceAlpha"
                operator="dilate" radius="2"
                result="THICKNESS"/>
  <feFlood flood-color="#0a0a0a" result="COLOR"/>
  <feComposite in="COLOR" in2="THICKNESS"
               operator="in" result="C_OUT"/>
  <feComposite in="C_OUT" in2="SourceAlpha"
               operator="out"/>
</filter>

.outline { filter: url(#pixel-outline); }`}
            </pre>
          </div>

          <div>
            <div className={styles.label}>漸層底 + 白外框（radius: 2）</div>
            <div className={`${styles.stage} ${styles.stageGradient}`}>
              <h2 className={`${styles.title} ${styles.fontSerif}`} style={{ color: '#fff' }}>
                {TITLE_PREFIX}
                <span className={styles.outlineMorphologyLight}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>{`<feFlood flood-color="#ffffff"/>`}</pre>
          </div>

          <div>
            <div className={styles.label}>圖片底 + 白外框（radius: 2）</div>
            <div className={`${styles.stage} ${styles.stageImage}`}>
              <h2 className={`${styles.title} ${styles.fontSerif}`} style={{ color: '#fff' }}>
                {TITLE_PREFIX}
                <span className={styles.outlineMorphologyLight}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>{`/* 圖片穿透內部，外框乾淨且無宋體刺角 */`}</pre>
          </div>

          <div>
            <div className={styles.label}>圖片底 + 黑外框 radius: 4（方角感）</div>
            <div className={`${styles.stage} ${styles.stageImage}`}>
              <h2 className={`${styles.title} ${styles.fontSerif}`}>
                {TITLE_PREFIX}
                <span className={styles.outlineMorphologyThick}>{TITLE_OUTLINE}</span>
                {TITLE_SUFFIX}
              </h2>
            </div>
            <pre className={styles.code}>
              {`radius: 4
/* 方形 kernel 在 radius 大時轉角會出現像素方角，
   宋體細節被「吃」掉，看起來像粗糙的黑體外框 */`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
