"use client";

import { AlertTriangle, MoonStar, SunMedium } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboardStore";
import { settingsStore, useSettingsStore } from "@/stores/settingsStore";
import { getGlobalStatusLabel, getModeLabel, localeLabels, useT } from "@/lib/i18n";
import { formatClock } from "@/lib/utils/timeUtils";
import { resolveCharacterState } from "@/components/character/CharacterContext";
import { CharacterDisplay } from "@/components/character/CharacterDisplay";

export const Header = () => {
  const systemState = useDashboardStore((state) => state.systemState);
  const lastUpdated = useDashboardStore((state) => state.lastUpdated);
  const usageStats = useDashboardStore((state) => state.usageStats);
  const theme = useSettingsStore((state) => state.theme);
  const timezone = useSettingsStore((state) => state.timezone);
  const locale = useSettingsStore((state) => state.locale);
  const limited = usageStats.some((item) => item.status === "limit-reached");
  const t = useT();

  return (
    <header className="space-y-4">
      {limited && (
        <div className="glass-card flex items-center gap-3 rounded-3xl border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          <AlertTriangle className="h-4 w-4" />
          {t("header.limitBanner")}
        </div>
      )}
      <div className="grid gap-4 xl:grid-cols-[1fr,320px]">
        <div className="glass-card rounded-[32px] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{t("dashboard.liveMonitor")}</p>
              <h1 className="mt-2 text-3xl font-semibold">{getGlobalStatusLabel(locale, systemState.globalStatus)}</h1>
              <p className="mt-2 text-sm text-zinc-400">
                {lastUpdated ? `${t("dashboard.lastSync")} ${formatClock(lastUpdated, timezone, locale)}` : t("common.waitingFirstPoll")} · {t("dashboard.mode")} {getModeLabel(locale, systemState.currentMode)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(["ja", "en"] as const).map((nextLocale) => (
                <button
                  key={nextLocale}
                  onClick={() => settingsStore.update({ locale: nextLocale })}
                  className={`rounded-full border px-3 py-2 text-sm ${locale === nextLocale ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-white/5 text-zinc-400"}`}
                >
                  {nextLocale === "ja" ? "🇯🇵" : "🇺🇸"} {localeLabels[nextLocale]}
                </button>
              ))}
              <button
                onClick={() => settingsStore.update({ theme: theme === "dark" ? "light" : "dark" })}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
              >
                {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                {theme === "dark" ? t("dashboard.lightTheme") : t("dashboard.darkTheme")}
              </button>
            </div>
          </div>
        </div>
        <CharacterDisplay compact state={resolveCharacterState(systemState)} title={t("mascot.status")} subtitle={t("mascot.description")} />
      </div>
    </header>
  );
};
