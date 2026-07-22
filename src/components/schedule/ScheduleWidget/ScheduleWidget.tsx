"use client";

import type { SchedulePayload } from "@/lib/types";
import { DateStrip } from "../DateStrip/DateStrip";
import { DaySchedule } from "../DaySchedule/DaySchedule";
import { ScheduleFilters } from "../ScheduleFilters/ScheduleFilters";
import { ScheduleFooter } from "../ScheduleFooter/ScheduleFooter";
import { ScheduleHeader } from "../ScheduleHeader/ScheduleHeader";
import { useScheduleFilters } from "../hooks/useScheduleFilters";
import styles from "./ScheduleWidget.module.css";

export function ScheduleWidget({ schedule }: { schedule: SchedulePayload }) {
  const {
    selectedDate,
    stationId,
    dates,
    availableDates,
    stations,
    visibleTrainings,
    setSelectedDate,
    setStationId,
    resetFilters,
    refreshSchedule,
  } = useScheduleFilters(schedule);

  return (
    <main className={styles.page}>
      <ScheduleHeader />

      <section className={styles.schedule} aria-label="Расписание пробных тренировок">
        <DateStrip
          dates={dates}
          selectedDate={selectedDate}
          availableDates={availableDates}
          onSelect={setSelectedDate}
        />
        <ScheduleFilters
          stations={stations}
          stationId={stationId}
          resultCount={visibleTrainings.length}
          onStationChange={setStationId}
          onRefresh={refreshSchedule}
        />
        <DaySchedule trainings={visibleTrainings} onReset={resetFilters} />
      </section>

      <ScheduleFooter onRefresh={refreshSchedule} />
    </main>
  );
}
