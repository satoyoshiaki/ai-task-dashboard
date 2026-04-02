"use client";

import { AlertTriangle, MoonStar, SunMedium } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { settingsStore, useSettingsStore } from "@/stores/settingsStore";
import { formatClock } from "@/lib/utils/timeUtils";
import { resolveCharacterState } from "@/components/character/CharacterContext";
import { CharacterDisplay } from "@/components/character/CharacterDisplay";

export const Header = () => {
  const systemState = useDashboardStore((state) => state.systemState);
  const lastUpdated = useDashboardStore((state) => state.lastUpdated);
  const usageStats = useDashboardStore((state) => state.usageStats);
  const theme = useSettingsStore((state) => state.theme);
  const timezone = useSettingsStore((state) => state.timezone);
  const limited = usageStats.some((item) => item.status === "limit-reached");

  return (
    <header className="space-y-4">
      {limited && (
        <div className="glass-card flex items-center gap-3 rounded-3xl border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          <AlertTriangle className="h-4 w-4" />
          A provider has reached its limit. Reset countdowns are shown on usage cards and blocked tasks are highlighted.
        </div>
      )}
      <div className="grid gap-4 xl:grid-cols-[1fr,320px]">
        <div className="glass-card rounded-[32px] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Live Monitor</p>
              <h1 className="mt-2 text-3xl font-semibold">System {systemState.globalStatus}</h1>
              <p className="mt-2 text-sm text-zinc-400">
                {lastUpdated ? `Last sync ${formatClock(lastUpdated, timezone)}` : "Waiting for first poll"} · Mode {systemState.currentMode}
              </p>
            </div>
            <button
              onClick={() => settingsStore.update({ theme: theme === "dark" ? "light" : "dark" })}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
            >
              {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              {theme === "dark" ? "Light" : "Dark"} theme
            </button>
          </div>
        </div>
        <CharacterDisplay compact state={resolveCharacterState(systemState)} title="Mascot Status" subtitle="Corner companion mirrors the overall system mood." />
      </div>
    </header>
  );
};
