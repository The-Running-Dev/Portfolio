
import styles from './Intro.module.css';

export default function Intro() {
  return (
    <div className={styles['overview-card']}>
      <div className={styles['overview-title']}>Overview</div>
      <div className={styles['overview-subtitle']}>
        Welcome to my technical portfolio! Here you'll find a curated selection of my work across frontend, backend, infrastructure, automation, and open source contributions.
      </div>
      <div className={styles['overview-links']}>
        <a className={styles['overview-link']} href="/docs/frontend">Frontend</a>
        <a className={styles['overview-link']} href="/docs/backend">Backend</a>
        <a className={styles['overview-link']} href="/docs/infrastructure">Infrastructure & DevOps</a>
        <a className={styles['overview-link']} href="/docs/powershell">PowerShell & Automation</a>
        <a className={styles['overview-link']} href="/docs/contributions">Contributions / Community</a>
      </div>
    </div>
  );
}
