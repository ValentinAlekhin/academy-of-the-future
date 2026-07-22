import type { Station, TrialTraining } from "./types";
import { DATE_LOCALE, ISO_DATE_TIME_SUFFIX } from "@/constants/date";
import { ALL_STATIONS_ID, SPOTS_COPY } from "@/constants/schedule";

const pluralRules = new Intl.PluralRules(DATE_LOCALE);

export function addDays(dateIso: string, amount: number): string {
  const date = new Date(`${dateIso}${ISO_DATE_TIME_SUFFIX}`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function createDateRange(dateFrom: string, days: number): string[] {
  return Array.from({ length: days }, (_, index) => addDays(dateFrom, index));
}

export function getDatePart(dateTime: string): string {
  return dateTime.slice(0, 10);
}

export function getAvailableSpots(training: TrialTraining): number {
  return Math.max(training.maxClientsCount - training.clientsCount, 0);
}

export function formatSpotsLabel(spots: number): string {
  if (spots === 0) return SPOTS_COPY.empty;

  const form = pluralRules.select(spots);
  const noun = form === "one" ? SPOTS_COPY.one : form === "few" ? SPOTS_COPY.few : SPOTS_COPY.many;
  return `${spots} ${noun}`;
}

export function filterTrainings(
  items: TrialTraining[],
  selectedDate: string,
  stationId: string,
): TrialTraining[] {
  return items
    .filter((item) => getDatePart(item.startsAt) === selectedDate)
    .filter((item) => stationId === ALL_STATIONS_ID || item.station.id === stationId)
    .sort((first, second) => first.startsAt.localeCompare(second.startsAt));
}

export function getProgressPercent(training: TrialTraining): number {
  if (training.maxClientsCount <= 0) return 0;
  return Math.min(
    Math.max((training.clientsCount / training.maxClientsCount) * 100, 0),
    100,
  );
}

export function getUniqueStations(items: TrialTraining[]): Station[] {
  const stationsById = new Map(items.map((item) => [item.station.id, item.station]));

  return Array.from(stationsById.values()).sort((first, second) =>
    first.name.localeCompare(second.name, DATE_LOCALE),
  );
}
