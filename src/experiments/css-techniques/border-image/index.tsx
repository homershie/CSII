import styles from './styles.module.css';

const modes = [
  { key: 'stretch', className: styles.stretch, css: 'border-image-repeat: stretch;' },
  { key: 'repeat', className: styles.repeat, css: 'border-image-repeat: repeat;' },
  { key: 'round', className: styles.round, css: 'border-image-repeat: round;' },
] as const;

export default function BorderImageDemo() {
  return (
    <div className={styles.grid}>
      {modes.map(({ key, className, css }) => (
        <div key={key}>
          <div className={styles.label}>{key}</div>
          <div className={`${styles.demo} ${className}`} />
          <pre className={styles.code}>{css}</pre>
        </div>
      ))}
    </div>
  );
}
