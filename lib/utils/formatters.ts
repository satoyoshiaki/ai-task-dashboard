import { formatDistanceToNowStrict } from "date-fns";
import { enUS, ja } from "date-fns/locale";
import { Locale, Provider, TaskStatus, UsageStatus } from "@/lib/types";

export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const providerLabel = (provider: Provider) =>
  provider === "claude-code" ? "Claude Code" : "Codex";

export const providerAccent = (provider: Provider) =>
  provider === "claude-code"
    ? "from-violet-500/30 to-fuchsia-400/10 text-violet-100 ring-violet-400/30"
    : "from-sky-500/30 to-cyan-400/10 text-sky-100 ring-sky-400/30";

export const statusTone = (status: TaskStatus | UsageStatus) => {
  switch (status) {
    case "running":
    case "normal":
    case "completed":
      return "text-emerald-300 bg-emerald-500/10 border-emerald-400/20";
    case "queued":
    case "paused":
    case "unknown":
      return "text-zinc-300 bg-zinc-500/10 border-zinc-400/20";
    case "blocked":
    case "warning":
      return "text-amber-300 bg-amber-500/10 border-amber-400/20";
    case "error":
    case "limit-reached":
      return "text-rose-300 bg-rose-500/10 border-rose-400/20";
    default:
      return "text-zinc-300 bg-zinc-500/10 border-zinc-400/20";
  }
};

export const formatPercent = (value: number) => `${Math.round(value)}%`;
export const formatUsage = (value: number) => `${value.toLocaleString()} units`;

export const formatRelativeTime = (value: Date, locale: Locale = "en") =>
  formatDistanceToNowStrict(value, { addSuffix: true, locale: locale === "ja" ? ja : enUS });

export const formatRemaining = (seconds: number | null, unknownLabel = "Unknown") => {
  if (seconds === null) {
    return unknownLabel;
  }
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) {
    return `${hrs}h ${mins % 60}m`;
  }
  return `${mins}m`;
};
