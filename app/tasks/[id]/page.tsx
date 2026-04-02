"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useT } from "@/lib/i18n";
import { TaskDetail } from "@/components/tasks/TaskDetail";
import { useDashboardStore } from "@/stores/dashboardStore";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const tasks = useDashboardStore((state) => state.tasks);
  const systemState = useDashboardStore((state) => state.systemState);
  const task = tasks.find((entry) => entry.id === params.id);
  const t = useT();

  if (!task) {
    return (
      <Card>
        <h1 className="text-2xl font-semibold">{t("tasks.notFound")}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t("taskDetail.notFoundDescription")}</p>
      </Card>
    );
  }

  return <TaskDetail task={task} systemState={systemState} />;
}
