"use client";

import { Activity, AlertCircle, CheckCircle2, PauseCircle, PlayCircle, Timer } from "lucide-react";
import { TranslationKey, getGlobalStatusLabel, useT } from "@/lib/i18n";
import { SystemState } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { useSettingsStore } from "@/stores/settingsStore";

const stats = [
  { key: "runningTaskCount", label: "task.running", icon: PlayCircle, tone: "text-emerald-300" },
  { key: "queuedTaskCount", label: "task.queued", icon: Timer, tone: "text-sky-300" },
  { key: "blockedTaskCount", label: "task.blocked", icon: PauseCircle, tone: "text-amber-300" },
  { key: "errorTaskCount", label: "task.error", icon: AlertCircle, tone: "text-rose-300" },
  { key: "completedTaskCount", label: "task.completed", icon: CheckCircle2, tone: "text-violet-300" }
] as const satisfies ReadonlyArray<{ key: keyof SystemState; label: TranslationKey; icon: typeof Activity; tone: string }>;

export const StatsOverview = ({ systemState }: { systemState: SystemState }) => {
  const locale = useSettingsStore((state) => state.locale);
  const t = useT();

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t("system.overview")}</p>
          <h3 className="mt-2 text-xl font-semibold">{t("system.clusterStatus")} {getGlobalStatusLabel(locale, systemState.globalStatus)}</h3>
        </div>
        <Activity className="h-8 w-8 text-zinc-500" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${item.tone}`} />
                <span className="text-2xl font-semibold">{systemState[item.key]}</span>
              </div>
              <p className="mt-4 text-sm text-zinc-400">{t(item.label)}</p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
