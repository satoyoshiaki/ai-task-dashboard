"use client";

import { getTaskStatusLabel, useT } from "@/lib/i18n";
import { taskStore, useTaskStore } from "@/stores/taskStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { cn } from "@/lib/utils/formatters";

const tabs = ["all", "running", "queued", "paused", "blocked", "error", "completed"] as const;

export const TaskStatusTabs = () => {
  const activeStatus = useTaskStore((state) => state.activeStatus);
  const locale = useSettingsStore((state) => state.locale);
  const t = useT();

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => taskStore.setStatus(tab)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm capitalize transition",
            activeStatus === tab ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-black/10 text-zinc-400 hover:text-zinc-200"
          )}
        >
          {tab === "all" ? t("common.all") : getTaskStatusLabel(locale, tab)}
        </button>
      ))}
    </div>
  );
};
