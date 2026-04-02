import { DashboardSnapshot, GlobalStatus, SystemState, Task, UsageStat } from "@/lib/types";

const sortTasksByUpdatedAt = (tasks: Task[]) =>
  [...tasks].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

const ensureUniqueTaskIds = (tasks: Task[]) => {
  const seen = new Map<string, number>();

  return tasks.map((task) => {
    const currentCount = seen.get(task.id) ?? 0;
    seen.set(task.id, currentCount + 1);

    if (currentCount === 0) {
      return task;
    }

    return {
      ...task,
      id: `${task.provider}-${task.id}`
    };
  });
};

export const dedupeUsageStats = (usageGroups: UsageStat[][]): UsageStat[] => {
  const byProvider = new Map<UsageStat["provider"], UsageStat>();

  usageGroups.flat().forEach((stat) => {
    byProvider.set(stat.provider, stat);
  });

  return Array.from(byProvider.values()).sort((a, b) => a.provider.localeCompare(b.provider));
};

const resolveGlobalStatus = (tasks: Task[], usageStats: UsageStat[]): GlobalStatus => {
  const hasLimitReached = usageStats.some((stat) => stat.status === "limit-reached");
  const errorCount = tasks.filter((task) => task.status === "error").length;
  const blockedCount = tasks.filter((task) => task.status === "blocked").length;
  const runningCount = tasks.filter((task) => task.status === "running").length;
  const queuedCount = tasks.filter((task) => task.status === "queued").length;
  const hasWarnings = usageStats.some((stat) => stat.status === "warning");

  if (hasLimitReached || errorCount > 0) {
    return "critical";
  }

  if (blockedCount > 0 || hasWarnings) {
    return "warning";
  }

  if (runningCount > 0 || queuedCount > 0) {
    return "busy";
  }

  if (tasks.length === 0) {
    return "idle";
  }

  return "healthy";
};

export const deriveLiveSystemState = (tasks: Task[], usageStats: UsageStat[]): SystemState => ({
  globalStatus: resolveGlobalStatus(tasks, usageStats),
  runningTaskCount: tasks.filter((task) => task.status === "running").length,
  queuedTaskCount: tasks.filter((task) => task.status === "queued").length,
  blockedTaskCount: tasks.filter((task) => task.status === "blocked").length,
  errorTaskCount: tasks.filter((task) => task.status === "error").length,
  completedTaskCount: tasks.filter((task) => task.status === "completed").length,
  currentMode: "live"
});

export const buildCombinedSnapshot = ({
  taskGroups,
  usageGroups
}: {
  taskGroups: Task[][];
  usageGroups: UsageStat[][];
}): DashboardSnapshot => {
  const tasks = ensureUniqueTaskIds(sortTasksByUpdatedAt(taskGroups.flat()));
  const usageStats = dedupeUsageStats(usageGroups);

  return {
    usageStats,
    tasks,
    systemState: deriveLiveSystemState(tasks, usageStats),
    recentActivity: tasks
      .flatMap((task) => task.logs)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 6)
  };
};
