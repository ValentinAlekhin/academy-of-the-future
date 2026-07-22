import { ALL_STATIONS_ID } from "@/constants/schedule";
import type { Station } from "@/lib/types";
import { RefreshCw } from "lucide-react";
import { TRAINING_TYPE_VALUE } from "./constants";
import styles from "./ScheduleFilters.module.css";

interface ScheduleFiltersProps {
  stations: Station[];
  stationId: string;
  resultCount: number;
  onStationChange: (stationId: string) => void;
  onRefresh: () => void;
}

function formatResultCount(count: number): string {
  if (count === 0) return "Тренировок нет";
  return `${count} ${count === 1 ? "тренировка" : "тренировки"}`;
}

export function ScheduleFilters({
  stations,
  stationId,
  resultCount,
  onStationChange,
  onRefresh,
}: ScheduleFiltersProps) {
  return (
    <div className={styles.filters}>
      <label>
        <span>Тип</span>
        <select value={TRAINING_TYPE_VALUE} aria-label="Тип тренировки" disabled>
          <option value={TRAINING_TYPE_VALUE}>Все типы</option>
        </select>
      </label>
      <label>
        <span>Станция</span>
        <select value={stationId} onChange={(event) => onStationChange(event.target.value)}>
          <option value={ALL_STATIONS_ID}>Все станции</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className={styles.refreshButton}
        onClick={onRefresh}
        aria-label="Обновить расписание"
        title="Обновить расписание"
      >
        <RefreshCw aria-hidden="true" size={18} strokeWidth={2} />
      </button>
      <div className={styles.resultSummary} aria-live="polite">
        {formatResultCount(resultCount)}
      </div>
    </div>
  );
}
