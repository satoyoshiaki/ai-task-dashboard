"use client";

import { UsageCard } from "@/components/dashboard/UsageCard";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { UsageChart } from "@/components/dashboard/UsageChart";
import { CharacterDisplay } from "@/components/character/CharacterDisplay";
import { resolveCharacterState } from "@/components/character/CharacterContext";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/lib/i18n";
import { useDashboardStore } from "@/stores/dashboardStore";
import { formatRelativeTime } from "@/lib/utils/formatters";
import { useSettingsStore } from "@/stores/settingsStore";

export default function DashboardPage() {
  const usageStats = useDashboardStore((state) => state.usageStats);
  const systemState = useDashboardStore((state) => state.systemState);
  const activity = useDashboardStore((state) => state.recentActivity);
  const isLoading = useDashboardStore((state) => state.isLoading);
  const locale = useSettingsStore((state) => state.locale);
  const t = useT();

  if (isLoading && usageStats.length === 0) {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-[320px]" />
        <Skeleton className="h-[320px]" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        {usageStats.map((stat) => (
          <UsageCard key={stat.provider} stat={stat} />
        ))}
      </div>
      <StatsOverview systemState={systemState} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <UsageChart usageStats={usageStats} />
        <CharacterDisplay state={resolveCharacterState(systemState)} title={t("mascot.status")} subtitle={t("mascot.description")} />
      </div>
      <Card>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t("activity.title")}</p>
        <div className="mt-4 grid gap-3">
          {activity.map((entry) => (
            <div key={entry.id} className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-sm text-zinc-200">{entry.message}</p>
              <span className="shrink-0 text-xs text-zinc-500">{formatRelativeTime(entry.timestamp, locale)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
