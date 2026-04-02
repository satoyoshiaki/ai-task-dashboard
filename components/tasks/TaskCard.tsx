"use client";

import Link from "next/link";
import { Task } from "@/lib/types";
import { getTaskStatusLabel, useT } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { providerLabel, statusTone } from "@/lib/utils/formatters";
import { formatClock } from "@/lib/utils/timeUtils";
import { useSettingsStore } from "@/stores/settingsStore";
import { taskStore } from "@/stores/taskStore";

export const TaskCard = ({ task }: { task: Task }) => {
  const timezone = useSettingsStore((state) => state.timezone);
  const locale = useSettingsStore((state) => state.locale);
  const t = useT();

  return (
    <Card className={task.status === "blocked" ? "border-amber-400/20" : ""}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-400">{task.id}</span>
            <span className={`rounded-full border px-2.5 py-1 text-xs ${statusTone(task.status)}`}>{getTaskStatusLabel(locale, task.status)}</span>
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-300">{providerLabel(task.provider)}</span>
          </div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-zinc-400">{t("tasks.updated")} {formatClock(task.updatedAt, timezone, locale)} · {t("tasks.started")} {formatClock(task.startedAt, timezone, locale)}</p>
        </div>
        <div className="w-full max-w-md space-y-3">
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span>{t("tasks.progress")}</span>
            <span>{task.progress}%</span>
          </div>
          <Progress value={task.progress} />
          <div className="flex gap-2">
            <button onClick={() => { taskStore.setSelectedTask(task.id); taskStore.setDetailModalOpen(true); }} className="rounded-2xl border border-white/10 px-3 py-2 text-sm">
              {t("tasks.quickView")}
            </button>
            <Link href={`/tasks/${task.id}`} className="rounded-2xl border border-white/10 px-3 py-2 text-sm text-zinc-200">
              {t("common.openDetail")}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};
