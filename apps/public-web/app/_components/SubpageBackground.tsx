import styles from "../SubpageVisual.module.css";

export function SubpageBackground() {
  return (
    <div className={styles.fixedSubpageBackground} aria-hidden="true">
      <div className={styles.subpageGridBackdrop} />
      <div className={styles.subpageAmbientGlow} />
    </div>
  );
}
