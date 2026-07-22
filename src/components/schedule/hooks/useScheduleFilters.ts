"use client";

import { useEffect, useMemo } from "react";
import { parseAsString, useQueryState } from "nuqs";
import { ALL_STATIONS_ID, DATE_RANGE_DAYS } from "@/constants/schedule";
import {
  createDateRange,
  filterTrainings,
  getDatePart,
  getUniqueStations,
} from "@/lib/schedule";
import type { SchedulePayload } from "@/lib/types";
import { SCHEDULE_QUERY_KEYS } from "./constants";

export function useScheduleFilters(schedule: SchedulePayload) {
  const [selectedDate, setSelectedDateQuery] = useQueryState(
    SCHEDULE_QUERY_KEYS.date,
    parseAsString.withDefault(schedule.dateFrom).withOptions({ history: "replace" }),
  );
  const [stationId, setStationIdQuery] = useQueryState(
    SCHEDULE_QUERY_KEYS.station,
    parseAsString.withDefault(ALL_STATIONS_ID).withOptions({ history: "replace" }),
  );

  const dates = useMemo(
    () => createDateRange(schedule.dateFrom, DATE_RANGE_DAYS),
    [schedule.dateFrom],
  );
  const availableDates = useMemo(
    () => new Set(schedule.items.map((item) => getDatePart(item.startsAt))),
    [schedule.items],
  );
  const stations = useMemo(() => getUniqueStations(schedule.items), [schedule.items]);
  const visibleTrainings = useMemo(
    () => filterTrainings(schedule.items, selectedDate, stationId),
    [schedule.items, selectedDate, stationId],
  );

  useEffect(() => {
    if (!dates.includes(selectedDate)) {
      void setSelectedDateQuery(schedule.dateFrom);
    }
  }, [dates, schedule.dateFrom, selectedDate, setSelectedDateQuery]);

  useEffect(() => {
    const isValidStation =
      stationId === ALL_STATIONS_ID || stations.some((station) => station.id === stationId);

    if (!isValidStation) {
      void setStationIdQuery(ALL_STATIONS_ID);
    }
  }, [setStationIdQuery, stationId, stations]);

  const setSelectedDate = (date: string) => {
    void setSelectedDateQuery(date);
  };

  const setStationId = (nextStationId: string) => {
    void setStationIdQuery(nextStationId);
  };

  const resetFilters = () => {
    void Promise.all([
      setSelectedDateQuery(schedule.dateFrom),
      setStationIdQuery(ALL_STATIONS_ID),
    ]);
  };

  const refreshSchedule = () => {
    window.location.reload();
  };

  return {
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
  };
}
