import { format } from "date-fns";
import { Locale } from "@/lib/types";
import { getIntlLocale } from "@/lib/i18n";

export const formatClock = (value: Date, timezone: string, locale: Locale = "en") =>
  new Intl.DateTimeFormat(getIntlLocale(locale), {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    timeZone: timezone
  }).format(value);

export const formatLogTimestamp = (value: Date, timezone: string, locale: Locale = "en") =>
  new Intl.DateTimeFormat(getIntlLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: timezone
  }).format(value);

export const formatDateStamp = (value: Date) => format(value, "MMM d, HH:mm");
