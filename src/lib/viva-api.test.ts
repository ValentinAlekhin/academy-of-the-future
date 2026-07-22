import { describe, expect, it } from "vitest";
import { normalizeExercise } from "./viva-api";

describe("normalizeExercise", () => {
  it("maps a first-trial exercise to the public schedule contract", () => {
    const result = normalizeExercise({
      id: "exercise-1",
      direction: { id: 3108, name: "Первая пробная тренировка" },
      timeFrom: "2026-07-22T18:00:00+03:00",
      timeTo: "2026-07-22T19:00:00+03:00",
      clientsCount: 1,
      maxClientsCount: 4,
      availableClientOneTimes: [{ price: 990 }],
      studio: { id: "studio-1", name: "Ясенево", address: "Москва" },
      room: { name: "Корт №1" },
      trainers: [
        { id: "trainer-1", firstName: "Иван", lastName: "Иванов", photo: "photo.jpg" },
      ],
    });

    expect(result).toMatchObject({
      id: "exercise-1",
      durationMinutes: 60,
      station: { id: "studio-1", name: "Ясенево" },
      trainer: { id: "trainer-1", name: "Иван Иванов" },
      priceRub: 990,
    });
  });

  it("rejects exercises from other directions", () => {
    expect(normalizeExercise({ id: "exercise-1", direction: { id: 999 } })).toBeNull();
  });
});
