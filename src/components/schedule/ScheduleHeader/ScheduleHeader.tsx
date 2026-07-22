import { ArrowLeft } from "lucide-react";
import { SCHEDULE_SOURCE_URL } from "./constants";
import styles from "./ScheduleHeader.module.css";

export function ScheduleHeader() {
  return (
    <header className={styles.header}>
      <a href={SCHEDULE_SOURCE_URL} target="_blank" rel="noreferrer">
        <ArrowLeft aria-hidden="true" size={14} strokeWidth={2.5} />
        Назад
      </a>
      <h1>Запись на пробные тренировки</h1>
    </header>
  );
}
