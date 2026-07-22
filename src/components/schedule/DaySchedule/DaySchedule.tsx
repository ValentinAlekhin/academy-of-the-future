import type { TrialTraining } from "@/lib/types";
import { CalendarX2 } from "lucide-react";
import styles from "./DaySchedule.module.css";
import { TrainingCard } from "../TrainingCard/TrainingCard";

interface DayScheduleProps {
  trainings: TrialTraining[];
  onReset: () => void;
}

function EmptySchedule({ onReset }: { onReset: () => void }) {
  return (
    <div className={styles.emptyState}>
      <span aria-hidden="true">
        <CalendarX2 size={25} strokeWidth={1.8} />
      </span>
      <h2>На эту дату тренировок нет</h2>
      <p>Выберите соседний день или сбросьте фильтр станции.</p>
      <button type="button" onClick={onReset}>
        Показать ближайшие
      </button>
    </div>
  );
}

export function DaySchedule({
  trainings,
  onReset,
}: DayScheduleProps) {
  return (
    <div className={styles.list}>
      {trainings.length > 0 ? (
        trainings.map((training) => <TrainingCard key={training.id} training={training} />)
      ) : (
        <EmptySchedule onReset={onReset} />
      )}
    </div>
  );
}
