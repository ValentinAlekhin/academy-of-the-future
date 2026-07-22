import { describe, expect, it } from "vitest";
import {
  filterTrainings,
  formatSpotsLabel,
  getAvailableSpots,
  getProgressPercent,
  getUniqueStations,
} from "./schedule";
import type { TrialTraining } from "./types";

const training: TrialTraining = {
  id: "training-1",
  startsAt: "2026-07-22T18:00:00+03:00",
  endsAt: "2026-07-22T19:00:00+03:00",
  durationMinutes: 60,
  station: { id: "station-1", name: "Ясенево", address: "Москва" },
  room: "Корт №1",
  trainer: { id: "trainer-1", name: "Иван Иванов", photoUrl: null },
  clientsCount: 1,
  maxClientsCount: 4,
  priceRub: null,
};

describe("schedule helpers", () => {
  it("filters by date and station and sorts chronologically", () => {
    const later = { ...training, id: "training-2", startsAt: "2026-07-22T20:00:00+03:00" };
    const otherStation = {
      ...training,
      id: "training-3",
      station: { ...training.station, id: "station-2" },
    };

    expect(
      filterTrainings([later, otherStation, training], "2026-07-22", "station-1").map(
        (item) => item.id,
      ),
    ).toEqual(["training-1", "training-2"]);
  });

  it("calculates available spots and clamps progress", () => {
    expect(getAvailableSpots(training)).toBe(3);
    expect(getAvailableSpots({ ...training, clientsCount: 5 })).toBe(0);
    expect(getProgressPercent(training)).toBe(25);
    expect(getProgressPercent({ ...training, clientsCount: 5 })).toBe(100);
  });

  it("uses correct Russian plural forms", () => {
    expect(formatSpotsLabel(0)).toBe("мест нет");
    expect(formatSpotsLabel(1)).toBe("1 место");
    expect(formatSpotsLabel(2)).toBe("2 места");
    expect(formatSpotsLabel(5)).toBe("5 мест");
  });

  it("returns unique stations sorted by name", () => {
    const duplicate = { ...training, id: "training-2" };
    const otherStation = {
      ...training,
      id: "training-3",
      station: { id: "station-2", name: "Нагатинская", address: "Москва" },
    };

    expect(getUniqueStations([training, duplicate, otherStation]).map((station) => station.name)).toEqual([
      "Нагатинская",
      "Ясенево",
    ]);
  });
});
