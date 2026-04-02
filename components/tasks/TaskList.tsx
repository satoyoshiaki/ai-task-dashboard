"use client";

import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskModal } from "@/components/tasks/TaskModal";
import { useT } from "@/lib/i18n";
import { filterTasks } from "@/lib/tasks/filterTasks";
import { useTaskStore } from "@/stores/taskStore";

export const TaskList = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const activeStatus = useTaskStore((state) => state.activeStatus);
  const provider = useTaskStore((state) => state.provider);
  const search = useTaskStore((state) => state.search);
  const sortBy = useTaskStore((state) => state.sortBy);
  const t = useT();

  const filtered = filterTasks({ tasks, activeStatus, provider, search, sortBy });

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
