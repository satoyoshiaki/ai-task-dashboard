"use client";

import { demoScenarios } from "@/lib/mock/demoScenarios";
import { settingsStore, useSettingsStore } from "@/stores/settingsStore";

export const DemoModeBar = () => {
  const active = useSettingsStore((state) => state.demoScenarioId);

  return (
    <div className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-2 px-4 py-3 text-sm md:px-6">
        <span className="mr-2 text-xs uppercase tracking-[0.3em] text-zinc-500">Demo Mode</span>
        {demoScenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => settingsStore.update({ demoScenarioId: scenario.id })}
            className={`rounded-full border px-3 py-1.5 transition ${active === scenario.id ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-black/10 text-zinc-400"}`}
          >
            {scenario.label}
          </button>
        ))}
      </div>
    </div>
  );
};
