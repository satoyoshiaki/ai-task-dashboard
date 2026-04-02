"use client";

import { Card } from "@/components/ui/card";
import { useT } from "@/lib/i18n";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskStatusTabs } from "@/components/tasks/TaskStatusTabs";

export default function TasksPage() {
  const t = useT();

  return (
    <div className="space-y-6">
      <Card>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t("tasks.title")}</p>
        <h1 className="mt-2 text-3xl font-semibold">{t("tasks.subtitle")}</h1>
        <p className="mt-2 text-sm text-zinc-400">{t("tasks.filterPlaceholder")}</p>
        <div className="mt-6 space-y-4">
          <TaskStatusTabs />
          <TaskFilters />
        </div>
      </Card>
      <TaskList />
    </div>
  );
}
