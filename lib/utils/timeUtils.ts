import { format } from "date-fns";

export const formatClock = (value: Date, timezone: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    timeZone: timezone
  }).format(value);

export const formatLogTimestamp = (value: Date, timezone: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: timezone
  }).format(value);

export const formatDateStamp = (value: Date) => format(value, "MMM d, HH:mm");
