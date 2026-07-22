import { getDayAndMonth, longDateFormatter, parseApiDate, weekdayFormatter } from "../lib/formatters";
import styles from "./DateStrip.module.css";

interface DateStripProps {
  dates: string[];
  selectedDate: string;
  availableDates: Set<string>;
  onSelect: (date: string) => void;
}

export function DateStrip({ dates, selectedDate, availableDates, onSelect }: DateStripProps) {
  return (
    <div className={styles.dateScroller} aria-label="Выбор даты">
      {dates.map((date) => {
        const parsedDate = parseApiDate(date);
        const { day, month } = getDayAndMonth(parsedDate);
        const isSelected = date === selectedDate;
        const hasTrainings = availableDates.has(date);

        return (
          <div className={styles.dateCell} key={date}>
            <span className={styles.weekday}>{weekdayFormatter.format(parsedDate)}</span>
            <button
              type="button"
              className={`${styles.dateItem} ${isSelected ? styles.dateItemSelected : ""}`}
              onClick={() => onSelect(date)}
              aria-pressed={isSelected}
              aria-label={longDateFormatter.format(parsedDate)}
            >
              <span className={styles.month}>{month}</span>
              <strong>{day}</strong>
              {hasTrainings ? <i aria-label="Есть тренировки" /> : null}
            </button>
          </div>
        );
      })}
    </div>
  );
}
