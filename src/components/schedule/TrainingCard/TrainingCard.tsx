import {
  formatSpotsLabel,
  getAvailableSpots,
} from "@/lib/schedule";
import type { TrialTraining } from "@/lib/types";
import { CalendarDays, ChartNoAxesColumnIncreasing, Ellipsis, MapPin, Medal } from "lucide-react";
import styles from "./TrainingCard.module.css";
import { getDayAndMonth, longDateFormatter, timeFormatter, weekdayFormatter } from "../lib/formatters";
import { ServicePriceBadge } from "../ServicePriceBadge/ServicePriceBadge";
import { TrainerAvatar } from "../TrainerAvatar/TrainerAvatar";

function Capacity({ training }: { training: TrialTraining }) {
  const spots = getAvailableSpots(training);
  const totalSlots = Math.max(Math.trunc(training.maxClientsCount), 0);
  const occupiedSlots = Math.min(Math.max(Math.trunc(training.clientsCount), 0), totalSlots);

  return (
    <div className={styles.capacity}>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label="Заполненность тренировки"
        aria-valuemin={0}
        aria-valuemax={training.maxClientsCount}
        aria-valuenow={Math.min(training.clientsCount, training.maxClientsCount)}
      >
        {Array.from({ length: totalSlots }, (_, index) => (
          <span
            className={index < occupiedSlots ? styles.slotOccupied : styles.slotAvailable}
            key={index}
          />
        ))}
      </div>
      <div className={styles.capacityLabels}>
        <span>
          <strong>{training.clientsCount}</strong>/{training.maxClientsCount}{" "}
          участников
        </span>
        <span className={spots > 0 ? styles.spotsAvailable : styles.spotsFull}>
          {spots > 0
            ? `осталось: ${formatSpotsLabel(spots)}`
            : "мест нет"}
        </span>
      </div>
    </div>
  );
}

export function TrainingCard({ training }: { training: TrialTraining }) {
  const startsAt = new Date(training.startsAt);
  const endsAt = new Date(training.endsAt);
  const { day, month } = getDayAndMonth(startsAt);

  return (
    <article className={styles.trainingGroup}>
      <div className={styles.trainerRow}>
        <TrainerAvatar trainer={training.trainer} />
        <div>
          <p className={styles.trainerName}>{training.trainer.name}</p>
          <p className={styles.trainerStation}>{training.station.name}</p>
        </div>
        <Ellipsis className={styles.more} aria-hidden="true" size={18} strokeWidth={2} />
      </div>

      <div className={styles.card}>
        <div className={styles.dateBadge} aria-label={longDateFormatter.format(startsAt)}>
          <strong>{day}</strong>
          <span>{month}</span>
        </div>

        <span className={styles.typeBadge}>
          <Medal aria-hidden="true" size={11} strokeWidth={2.5} />
          Первая пробная
        </span>
        <h2>Первая пробная тренировка</h2>

        <ul className={styles.details}>
          <li>
            <CalendarDays aria-hidden="true" />
            {weekdayFormatter.format(startsAt)}, {timeFormatter.format(startsAt)}–
            {timeFormatter.format(endsAt)}
          </li>
          <li>
            <MapPin aria-hidden="true" />
            {training.station.name}
          </li>
          <li>
            <ChartNoAxesColumnIncreasing aria-hidden="true" />
            {training.durationMinutes} мин · {training.room}
          </li>
        </ul>

        <ServicePriceBadge priceRub={training.priceRub} />

        <Capacity training={training} />

        <div className={styles.cardFooter}>
          <span title={training.station.address}>Лист ожидания: 0</span>
          <button type="button" disabled title="Запись не входит в тестовое задание">
            Открыть
          </button>
        </div>
      </div>
    </article>
  );
}
