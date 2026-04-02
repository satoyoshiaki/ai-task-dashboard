"use client";

import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskModal } from "@/components/tasks/TaskModal";
import { useT } from "@/lib/i18n";
import { useTaskStore } from "@/stores/taskStore";

export const TaskList = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const activeStatus = useTaskStore((state) => state.activeStatus);
  const search = useTaskStore((state) => state.search.toLowerCase());
  const sortBy = useTaskStore((state) => state.sortBy);
  const t = useT();

  const filtered = tasks
    .filter((task) => (activeStatus === "all" ? true : task.status === activeStatus))
    .filter((task) => `${task.id} ${task.title}`.toLowerCase().includes(search))
    .sort((a, b) => {
      if (sortBy === "progress" || sortBy === "usageImpact") {
        return b[sortBy] - a[sortBy];
      }
      return b[sortBy].getTime() - a[sortBy].getTime();
    });

  return (
    <>
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-black/10 p-10 text-center text-zinc-400">
            {t("tasks.notFound")}
          </div>
        ) : (
          filtered.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
      <TaskModal />
    </>
  );
};
