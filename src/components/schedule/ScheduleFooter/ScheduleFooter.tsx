import styles from "./ScheduleFooter.module.css";

export function ScheduleFooter({ onRefresh }: { onRefresh: () => void }) {
  return (
    <footer className={styles.footer}>
      <span>Данные VivaCRM · процедуры записи и оплаты не реализованы</span>
      <button type="button" onClick={onRefresh}>
        Обновить страницу
      </button>
    </footer>
  );
}
