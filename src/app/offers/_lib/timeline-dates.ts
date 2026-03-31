const TZ = "Asia/Kolkata";

/** Calendar YYYY-MM-DD in IST for the given instant. */
export function istYmdFromDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** Today's calendar date in IST as YYYY-MM-DD. */
export function todayYmdIST(now: Date = new Date()): string {
  return istYmdFromDate(now);
}

function parseYmdToNoonIST(ymd: string): Date {
  return new Date(`${ymd}T12:00:00+05:30`);
}

/** Add calendar days in IST (anchor at noon IST to avoid DST edge cases). */
export function addDaysYmdIST(ymd: string, days: number): string {
  const d = parseYmdToNoonIST(ymd);
  d.setTime(d.getTime() + days * 86400000);
  return istYmdFromDate(d);
}

/** Short display like "Apr 28" (month then 2-digit day) in IST for a YYYY-MM-DD string. */
export function formatYmdShortIST(ymd: string): string {
  const d = parseYmdToNoonIST(ymd);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    month: "short",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(d);
  let month = "";
  let day = "";
  for (const p of parts) {
    if (p.type === "month") month = p.value;
    if (p.type === "day") day = p.value;
  }
  return `${month} ${day}`;
}

/**
 * One display line per onboarding timeline step. All dates are relative to
 * "today" in Asia/Kolkata (same for every offer).
 */
export function getTimelineStepDateLine(stepIndex: number): string {
  const today = todayYmdIST();

  switch (stepIndex) {
    case 0:
      return `Today (${formatYmdShortIST(today)})`;
    case 1:
      return `Day 1 (${formatYmdShortIST(addDaysYmdIST(today, 1))})`;
    case 2:
      return `Day 2 (${formatYmdShortIST(addDaysYmdIST(today, 2))})`;
    case 3:
      return `Day 5 (${formatYmdShortIST(addDaysYmdIST(today, 5))})`;
    case 4:
      return `Day 7 (${formatYmdShortIST(addDaysYmdIST(today, 7))})`;
    case 5:
      return `Day 30 (${formatYmdShortIST(addDaysYmdIST(today, 30))})`;
    default:
      return `— (${formatYmdShortIST(today)})`;
  }
}
