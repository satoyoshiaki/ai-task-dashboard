"use client";

import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { TaskDetail } from "@/components/tasks/TaskDetail";
import { useDashboardStore } from "@/stores/dashboardStore";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const tasks = useDashboardStore((state) => state.tasks);
  const systemState = useDashboardStore((state) => state.systemState);
  const task = tasks.find((entry) => entry.id === params.id);

  if (!task) {
    return (
      <Card>
        <h1 className="text-2xl font-semibold">Task not found</h1>
        <p className="mt-2 text-sm text-zinc-400">Wait for the next poll or return to the task board.</p>
      </Card>
    );
  }

  return <TaskDetail task={task} systemState={systemState} />;
}
