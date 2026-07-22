export interface Trainer {
  id: string;
  name: string;
  photoUrl: string | null;
}

export interface Station {
  id: string;
  name: string;
  address: string;
}

export interface TrialTraining {
  id: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  station: Station;
  room: string;
  trainer: Trainer;
  clientsCount: number;
  maxClientsCount: number;
  priceRub: number | null;
}

export interface SchedulePayload {
  generatedAt: string;
  city: string;
  dateFrom: string;
  dateTo: string;
  items: TrialTraining[];
}
