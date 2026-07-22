import { API_DATE_TIME_SUFFIX, DATE_LOCALE, MOSCOW_TIME_ZONE } from "@/constants/date";

export const shortDateFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  day: "2-digit",
  month: "short",
  timeZone: MOSCOW_TIME_ZONE,
});

export const weekdayFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  weekday: "short",
  timeZone: MOSCOW_TIME_ZONE,
});

export const longDateFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  weekday: "short",
  day: "numeric",
  month: "long",
  timeZone: MOSCOW_TIME_ZONE,
});

export const timeFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: MOSCOW_TIME_ZONE,
});

export const generatedAtFormatter = new Intl.DateTimeFormat(DATE_LOCALE, {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: MOSCOW_TIME_ZONE,
});

export function parseApiDate(dateIso: string): Date {
  return new Date(`${dateIso}${API_DATE_TIME_SUFFIX}`);
}

export function getDayAndMonth(date: Date): { day: string; month: string } {
  const parts = shortDateFormatter.formatToParts(date);
  return {
    day: parts.find((part) => part.type === "day")?.value ?? "",
    month: parts.find((part) => part.type === "month")?.value?.replace(".", "") ?? "",
  };
}
