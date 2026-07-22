import { Suspense } from "react";
import { ScheduleFallback } from "@/components/schedule/ScheduleFallback/ScheduleFallback";
import { ScheduleWidget } from "@/components/schedule/ScheduleWidget/ScheduleWidget";
import { getTrialSchedule } from "@/lib/viva-api";

export default async function HomePage() {
  const schedule = await getTrialSchedule();

  return (
    <Suspense fallback={<ScheduleFallback />}>
      <ScheduleWidget schedule={schedule} />
    </Suspense>
  );
}
