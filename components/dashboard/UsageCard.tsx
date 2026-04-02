"use client";

import { AlertTriangle, Clock3 } from "lucide-react";
import { UsageStat } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { formatClock } from "@/lib/utils/timeUtils";
import { formatPercent, providerAccent, providerLabel } from "@/lib/utils/formatters";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { useSettingsStore } from "@/stores/settingsStore";

const ProgressRing = ({ value, stroke }: { value: number; stroke: string }) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (value / 100) * circumference;

  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28">
      <circle className="opacity-20" cx="60" cy="60" r={radius} stroke="currentColor" strokeWidth="10" fill="none" />
      <circle
        className="status-ring"
        cx="60"
        cy="60"
        r={radius}
        stroke={stroke}
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        fill="none"
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-white text-2xl font-semibold">
        {Math.round(value)}%
      </text>
    </svg>
  );
};

export const UsageCard = ({ stat }: { stat: UsageStat }) => {
  const timezone = useSettingsStore((state) => state.timezone);
  const stroke = stat.provider === "claude-code" ? "#a78bfa" : "#38bdf8";
  const nextReset = stat.resetAt ? formatClock(stat.resetAt, timezone) : "Unknown";

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${providerAccent(stat.provider)}`}>
      <div className="absolute inset-0 opacity-40" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{providerLabel(stat.provider)}</p>
          <h3 className="mt-2 text-xl font-semibold">Usage Window</h3>
          <div className="mt-3">
            <StatusBadge label={stat.status} />
          </div>
        </div>
        <ProgressRing value={stat.sessionUsedPercent} stroke={stroke} />
      </div>
      <div className="mt-5 grid gap-3 text-sm text-zinc-300 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
          <p className="text-zinc-500">Session</p>
          <p className="mt-1 text-lg font-semibold text-white">{formatPercent(stat.sessionUsedPercent)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
          <p className="text-zinc-500">Period</p>
          <p className="mt-1 text-lg font-semibold text-white">{formatPercent(stat.periodUsedPercent)}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-zinc-300">
        <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" />Next reset: {nextReset}</span>
        {stat.status === "limit-reached" ? <span className="inline-flex items-center gap-2 text-rose-300"><AlertTriangle className="h-4 w-4" />Blocked</span> : <span>{formatPercent(stat.remainingPercent)} left</span>}
      </div>
    </Card>
  );
};
