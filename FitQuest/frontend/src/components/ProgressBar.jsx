import styles from './ProgressBar.module.css';

const ProgressBar = ({ current, total }) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  const isComplete = percentage >= 100;

  return (
    <div>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${isComplete ? styles.fillComplete : styles.fillDefault}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className={styles.labels}>
        <span>{Math.round(percentage)}% completado</span>
        <span className={isComplete ? styles.countComplete : styles.count}>
          {current} / {total} días
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
