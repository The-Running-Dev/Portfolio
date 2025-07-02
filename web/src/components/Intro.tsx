
import styles from './Intro.module.css';

export default function Intro() {
  return (
    <div className={styles['overview-card']}>
      <div className={styles['overview-title']}>Overview</div>
      <div className={styles['overview-subtitle']}>
        Welcome to my technical portfolio! Here you'll find a curated selection of my work across frontend, backend, infrastructure, automation, and open source contributions.
      </div>
      <div className={styles['overview-links']}>
        <a className={styles['overview-link']} href={require('../../docs/frontend.md').default}>Frontend</a>
        <a className={styles['overview-link']} href={require('../../docs/backend.md').default}>Backend</a>
        <a className={styles['overview-link']} href={require('../../docs/infrastructure.md').default}>Infrastructure & DevOps</a>
        <a className={styles['overview-link']} href={require('../../docs/powershell.md').default}>PowerShell & Automation</a>
        <a className={styles['overview-link']} href={require('../../docs/contributions.md').default}>Contributions / Community</a>
      </div>
    </div>
  );
}
