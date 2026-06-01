import styles from './AuthLayout.module.css';

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgGlow} />
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>F</div>
          <h1 className={styles.title}>FitQuest</h1>
          <p className={styles.subtitle}>Supera tus límites</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
