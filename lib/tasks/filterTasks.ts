import { Provider, Task, TaskFilter } from "@/lib/types";

export const filterTasks = ({
  tasks,
  activeStatus,
  provider,
  search,
  sortBy
}: {
  tasks: Task[];
  activeStatus: TaskFilter["status"];
  provider: Provider | "all";
  search: string;
  sortBy: NonNullable<TaskFilter["sortBy"]>;
}) =>
  [...tasks]
    .filter((task) => (activeStatus === "all" ? true : task.status === activeStatus))
    .filter((task) => (provider === "all" ? true : task.provider === provider))
    .filter((task) => `${task.id} ${task.title}`.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "progress" || sortBy === "usageImpact") {
        return b[sortBy] - a[sortBy];
      }

      return b[sortBy].getTime() - a[sortBy].getTime();
    });
