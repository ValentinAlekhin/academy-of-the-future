import axios from "axios";
import { VIVA_API_CONFIG } from "@/constants/api";
import { MOSCOW_TIME_ZONE } from "@/constants/date";
import { addDays } from "./schedule";
import type { SchedulePayload, TrialTraining } from "./types";

const vivaClient = axios.create({
  baseURL: VIVA_API_CONFIG.baseUrl,
  timeout: VIVA_API_CONFIG.timeoutMs,
  headers: { Accept: "application/json" },
});

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getMoscowToday(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MOSCOW_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

async function getJson(path: string, params: Record<string, string>): Promise<unknown> {
  try {
    const response = await vivaClient.get<unknown>(path, { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ? ` (${error.response.status})` : "";
      throw new Error(`VivaCRM request failed for ${path}${status}`, { cause: error });
    }
    throw error;
  }
}

function getNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getExercisePrice(value: UnknownRecord): number | null {
  const services = Array.isArray(value.availableClientOneTimes)
    ? value.availableClientOneTimes
    : [];

  for (const service of services) {
    if (!isRecord(service)) continue;

    for (const field of ["price", "cost", "amount"] as const) {
      const price = service[field];
      if (typeof price === "number" && Number.isFinite(price) && price >= 0) return price;
    }
  }

  return null;
}

function normalizeExercise(value: unknown): TrialTraining | null {
  if (!isRecord(value) || typeof value.id !== "string") return null;
  if (!isRecord(value.direction) || value.direction.id !== VIVA_API_CONFIG.directionId) return null;
  if (typeof value.timeFrom !== "string" || typeof value.timeTo !== "string") {
    return null;
  }
  if (!isRecord(value.studio) || typeof value.studio.id !== "string") return null;

  const studioName =
    typeof value.studio.name === "string" ? value.studio.name : "Станция не указана";
  const address = typeof value.studio.address === "string" ? value.studio.address : "";
  const room =
    isRecord(value.room) && typeof value.room.name === "string"
      ? value.room.name
      : "Корт уточняется";
  const trainerValue = Array.isArray(value.trainers) ? value.trainers[0] : null;
  const trainer = isRecord(trainerValue) ? trainerValue : null;
  const firstName = trainer && typeof trainer.firstName === "string" ? trainer.firstName : "";
  const lastName = trainer && typeof trainer.lastName === "string" ? trainer.lastName : "";
  const trainerName = `${firstName} ${lastName}`.trim() || "Тренер уточняется";
  const startsAt = new Date(value.timeFrom);
  const endsAt = new Date(value.timeTo);

  if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) return null;

  return {
    id: value.id,
    startsAt: value.timeFrom,
    endsAt: value.timeTo,
    durationMinutes: Math.max(
      Math.round((endsAt.getTime() - startsAt.getTime()) / 60_000),
      0,
    ),
    station: {
      id: value.studio.id,
      name: studioName,
      address,
    },
    room,
    trainer: {
      id: trainer && typeof trainer.id === "string" ? trainer.id : `unknown-${value.id}`,
      name: trainerName,
      photoUrl: trainer && typeof trainer.photo === "string" ? trainer.photo : null,
    },
    clientsCount: getNumber(value.clientsCount),
    maxClientsCount: getNumber(value.maxClientsCount),
    priceRub: getExercisePrice(value),
  };
}

async function getAvailableDates(dateFrom: string, dateTo: string): Promise<string[]> {
  const payload = await getJson("/exercises/dates", {
    dateFrom,
    dateTo,
    directions: String(VIVA_API_CONFIG.directionId),
    city: VIVA_API_CONFIG.city,
  });
  if (!isRecord(payload) || !Array.isArray(payload.availableDates)) {
    throw new Error("VivaCRM returned an invalid available-dates payload");
  }

  return payload.availableDates.filter(
    (date): date is string => typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date),
  );
}

async function getExercises(date: string): Promise<TrialTraining[]> {
  const payload = await getJson("/exercises", {
    date,
    directions: String(VIVA_API_CONFIG.directionId),
    city: VIVA_API_CONFIG.city,
  });
  if (!Array.isArray(payload)) {
    throw new Error(`VivaCRM returned an invalid exercises payload for ${date}`);
  }

  return payload.map(normalizeExercise).filter((item): item is TrialTraining => item !== null);
}

export async function getTrialSchedule(): Promise<SchedulePayload> {
  const dateFrom = getMoscowToday();
  const dateTo = addDays(dateFrom, VIVA_API_CONFIG.daysToShow - 1);
  const availableDates = await getAvailableDates(dateFrom, dateTo);
  const items = (await Promise.all(availableDates.map(getExercises)))
    .flat()
    .sort((first, second) => first.startsAt.localeCompare(second.startsAt));

  return {
    generatedAt: new Date().toISOString(),
    city: VIVA_API_CONFIG.city,
    dateFrom,
    dateTo,
    items,
  };
}

export { normalizeExercise };
