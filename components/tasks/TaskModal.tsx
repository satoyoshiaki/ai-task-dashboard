"use client";

import { useMemo } from "react";
import { TaskDetail } from "@/components/tasks/TaskDetail";
import { useT } from "@/lib/i18n";
import { taskStore, useTaskStore } from "@/stores/taskStore";
import { useDashboardStore } from "@/stores/dashboardStore";

export const TaskModal = () => {
  const open = useTaskStore((state) => state.detailModalOpen);
  const selectedTaskId = useTaskStore((state) => state.selectedTaskId);
  const tasks = useDashboardStore((state) => state.tasks);
  const systemState = useDashboardStore((state) => state.systemState);
  const task = useMemo(() => tasks.find((item) => item.id === selectedTaskId) ?? null, [tasks, selectedTaskId]);
  const t = useT();

  if (!open || !task) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-white/10 bg-zinc-950 p-5">
        <div className="mb-4 flex justify-end">
          <button onClick={() => taskStore.setDetailModalOpen(false)} className="rounded-full border border-white/10 px-3 py-1 text-sm">
            {t("common.close")}
          </button>
        </div>
        <TaskDetail task={task} systemState={systemState} />
      </div>
    </div>
  );
};
