"use client";

import { Card } from "@/components/ui/card";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskStatusTabs } from "@/components/tasks/TaskStatusTabs";

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <Card>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Task Board</p>
        <h1 className="mt-2 text-3xl font-semibold">Queued and running work</h1>
        <p className="mt-2 text-sm text-zinc-400">Filter by task state, search by id, and open quick detail views without leaving the board.</p>
        <div className="mt-6 space-y-4">
          <TaskStatusTabs />
          <TaskFilters />
        </div>
      </Card>
      <TaskList />
    </div>
  );
}
