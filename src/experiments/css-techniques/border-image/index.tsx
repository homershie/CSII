import frameUrl from './assets/frame02.svg';
import frameFillUrl from './assets/frame02-fill.svg';
import frameFillNoBorderUrl from './assets/frame02-fill-without-border.svg';
import styles from './styles.module.css';

const modes = [
  { key: 'stretch', className: styles.stretch, css: 'border-image-repeat: stretch;' },
  { key: 'repeat', className: styles.repeat, css: 'border-image-repeat: repeat;' },
  { key: 'round', className: styles.round, css: 'border-image-repeat: round;' },
] as const;

export default function BorderImageDemo() {
  return (
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.sectionLabel}>原圖 frame02.svg（82×82，9-slice 示意）</div>
        <div className={styles.originRow}>
          <img
            src={frameUrl}
            width={82}
            height={82}
            alt="frame02 原圖"
            className={styles.originImg}
          />
          <div className={styles.sliceAnnotation}>
            <span>slice: 32px</span>
            <span>edge zone: 18px</span>
            <span>corner zone: 32×32</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          border-image 應用（width: 100%，可拉伸視窗觀察差異）
        </div>
        <div className={styles.grid}>
          {modes.map(({ key, className, css }) => (
            <div key={key}>
              <div className={styles.label}>{key}</div>
              <div className={`${styles.demo} ${className}`} />
              <pre className={styles.code}>{css}</pre>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>內部填色技巧（三種方法對照）</div>
        <div className={styles.grid}>
          <div>
            <div className={styles.label}>① background（滲入邊框透明區）</div>
            <div
              className={`${styles.demo} ${styles.stretch} ${styles.demoColored} ${styles.demoTall}`}
            />
            <pre className={styles.code}>
              {'background: rgba(11,227,148,.25);\n/* 透過 tile 透明像素滲入邊框區 */'}
            </pre>
          </div>
          <div>
            <div className={styles.label}>② background-clip: padding-box</div>
            <div
              className={`${styles.demo} ${styles.stretch} ${styles.demoColored} ${styles.demoClipped} ${styles.demoTall}`}
            />
            <pre className={styles.code}>
              {
                'background: rgba(11,227,148,.25);\nbackground-clip: padding-box;\n/* 填色限定在 border 內側矩形 */'
              }
            </pre>
          </div>
          <div>
            <div className={styles.label}>③ border-image-slice: fill（SVG 中心區）</div>
            <div
              className={`${styles.demo} ${styles.stretch} ${styles.demoSliceFill} ${styles.demoTall}`}
              style={{
                borderImageSource: `url(${frameFillUrl})`,
                borderImageSlice: '32 fill',
              }}
            />
            <pre className={styles.code}>
              {'/* SVG 中心 tile 有填色 */\nborder-image-slice: 32 fill;\nbackground: transparent;'}
            </pre>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionLabel}>
          SVG 內建填色 × repeat 模式（border-image-slice: 32 fill）
        </div>
        {[
          { label: 'frame02-fill.svg（邊緣 bump 有填色）', url: frameFillUrl },
          {
            label: 'frame02-fill-without-border.svg（邊緣 bump 無填色）',
            url: frameFillNoBorderUrl,
          },
        ].map(({ label, url }) => (
          <div key={label} className={styles.fillGroup}>
            <div className={styles.fillGroupLabel}>{label}</div>
            <div className={styles.grid}>
              {modes.map(({ key, className }) => (
                <div key={key}>
                  <div className={styles.label}>{key}</div>
                  <div
                    className={`${styles.demo} ${className} ${styles.demoSvgTest}`}
                    style={{
                      borderImageSource: `url(${url})`,
                      borderImageSlice: '32 fill',
                    }}
                  />
                  <pre
                    className={styles.code}
                  >{`border-image-repeat: ${key};\nborder-image-slice: 32 fill;`}</pre>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
