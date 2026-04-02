"use client";

import { Card } from "@/components/ui/card";
import { useT } from "@/lib/i18n";
import { UsageStat } from "@/lib/types";
import { providerLabel } from "@/lib/utils/formatters";

const chartPath = (values: number[]) => {
  const points = values.map((value, index) => `${index * 60},${120 - value}`).join(" ");
  return points;
};

export const UsageChart = ({ usageStats }: { usageStats: UsageStat[] }) => {
  const t = useT();
  const series = usageStats.map((stat) => ({
    ...stat,
    color: stat.provider === "claude-code" ? "#a78bfa" : "#38bdf8",
    values: [
      stat.periodUsedPercent - 12,
      stat.periodUsedPercent - 8,
      stat.periodUsedPercent - 4,
      stat.periodUsedPercent
    ]
  }));

  return (
    <Card>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t("dashboard.usageTrend")}</p>
        <h3 className="mt-2 text-xl font-semibold">{t("dashboard.usageTrendSubtitle")}</h3>
      </div>
      <svg viewBox="0 0 180 130" className="w-full">
        <line x1="0" y1="120" x2="180" y2="120" stroke="rgba(255,255,255,0.08)" />
        <line x1="0" y1="80" x2="180" y2="80" stroke="rgba(255,255,255,0.08)" />
        <line x1="0" y1="40" x2="180" y2="40" stroke="rgba(255,255,255,0.08)" />
        {series.map((item) => (
          <polyline key={item.provider} fill="none" stroke={item.color} strokeWidth="4" points={chartPath(item.values)} />
        ))}
      </svg>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        {series.map((item) => (
          <div key={item.provider} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {providerLabel(item.provider)}
          </div>
        ))}
      </div>
    </Card>
  );
};
