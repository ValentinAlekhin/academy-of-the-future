import { ScheduleHeader } from "../ScheduleHeader/ScheduleHeader";
import { DATE_PLACEHOLDER_COUNT } from "./constants";
import styles from "./ScheduleFallback.module.css";

export function ScheduleFallback() {
  return (
    <main className={styles.page} aria-label="Загружаем расписание" aria-busy="true">
      <ScheduleHeader />
      <div className={styles.dates}>
        {Array.from({ length: DATE_PLACEHOLDER_COUNT }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className={styles.filters}>
        <span />
        <span />
        <i />
      </div>
      <div className={styles.card} />
    </main>
  );
}
