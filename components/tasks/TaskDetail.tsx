"use client";

import Link from "next/link";
import { CharacterDisplay } from "@/components/character/CharacterDisplay";
import { resolveCharacterState } from "@/components/character/CharacterContext";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { getTaskStatusLabel, useT } from "@/lib/i18n";
import { Task, SystemState } from "@/lib/types";
import { formatRemaining, formatUsage, providerLabel } from "@/lib/utils/formatters";
import { formatLogTimestamp } from "@/lib/utils/timeUtils";
import { useSettingsStore } from "@/stores/settingsStore";

export const TaskDetail = ({ task, systemState }: { task: Task; systemState: SystemState }) => {
  const timezone = useSettingsStore((state) => state.timezone);
  const locale = useSettingsStore((state) => state.locale);
  const state = resolveCharacterState(systemState, task);
  const t = useT();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr,0.8fr]">
      <div className="space-y-6">
        <Card>
          <Link href="/tasks" className="text-sm text-zinc-400 transition hover:text-zinc-200">
            {t("taskDetail.back")}
          </Link>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-500">{t("taskDetail.title")}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{task.id}</p>
          <h1 className="mt-2 text-3xl font-semibold">{task.title}</h1>
          <p className="mt-2 text-sm text-zinc-400">{providerLabel(task.provider)} · {t("taskDetail.status")} {getTaskStatusLabel(locale, task.status)}</p>
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm text-zinc-400">
              <span>{t("tasks.progress")}</span>
              <span>{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-3" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-3"><p className="text-zinc-500">{t("taskDetail.usageImpact")}</p><p className="mt-2 text-lg font-semibold">{formatUsage(task.usageImpact)}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-3"><p className="text-zinc-500">{t("tasks.resumable")}</p><p className="mt-2 text-lg font-semibold">{task.resumable ? t("common.yes") : t("common.no")}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-3"><p className="text-zinc-500">{t("tasks.blockedReason")}</p><p className="mt-2 text-sm font-medium text-zinc-200">{task.blockedReason ?? t("common.none")}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-3"><p className="text-zinc-500">{t("tasks.errorLabel")}</p><p className="mt-2 text-sm font-medium text-zinc-200">{task.errorMessage ?? t("common.none")}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-3"><p className="text-zinc-500">{t("taskDetail.estimatedRemaining")}</p><p className="mt-2 text-lg font-semibold">{formatRemaining(task.estimatedRemainingSec, t("common.unknown"))}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-3"><p className="text-zinc-500">{t("taskDetail.started")}</p><p className="mt-2 text-sm font-medium text-zinc-200">{formatLogTimestamp(task.startedAt, timezone, locale)}</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-3"><p className="text-zinc-500">{t("taskDetail.lastUpdated")}</p><p className="mt-2 text-sm font-medium text-zinc-200">{formatLogTimestamp(task.updatedAt, timezone, locale)}</p></div>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">{t("taskDetail.timeline")}</h2>
          <div className="mt-5 space-y-4">
            {[
              { label: t("taskDetail.taskQueued"), tone: "bg-sky-400" },
              { label: t("taskDetail.taskStarted"), tone: "bg-violet-400" },
              { label: task.status === "completed" ? t("taskDetail.taskCompleted") : t("taskDetail.currentState", { status: getTaskStatusLabel(locale, task.status) }), tone: "bg-emerald-400" }
            ].map((step) => (
              <div key={step.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`mt-1 h-3 w-3 rounded-full ${step.tone}`} />
                  <span className="h-full w-px bg-white/10" />
                </div>
                <p className="pb-5 text-sm text-zinc-300">{step.label}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">{t("taskDetail.logs")}</h2>
          <div className="mt-4 max-h-[360px] space-y-2 overflow-auto rounded-2xl border border-white/10 bg-black/20 p-4 font-mono text-xs text-zinc-300">
            {task.logs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <span className="text-zinc-500">{formatLogTimestamp(log.timestamp, timezone, locale)}</span>
                <span className="uppercase text-zinc-500">{log.level}</span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <CharacterDisplay state={state} title={t("taskDetail.mascotTitle")} subtitle={t("mascot.description")} />
        <Card>
          <h2 className="text-xl font-semibold">{t("taskDetail.retryHistory")}</h2>
          <div className="mt-4 space-y-3">
            {task.retryHistory.length === 0 ? (
              <p className="text-sm text-zinc-400">{t("common.noRetries")}</p>
            ) : (
              task.retryHistory.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/10 bg-black/10 p-3">
                  <p className="text-sm font-medium capitalize">{entry.outcome}</p>
                  <p className="mt-1 text-sm text-zinc-400">{entry.note}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
