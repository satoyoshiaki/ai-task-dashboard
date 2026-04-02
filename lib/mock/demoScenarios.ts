import { addMinutes, subMinutes } from "date-fns";
import { DemoScenario, SystemResources, Task, UsageStat } from "@/lib/types";

const mutateTasks = (tasks: Task[], partial: Partial<Task>, statuses?: Task["status"][]) =>
  tasks.map((task, index) => {
    const shouldApply = !statuses || statuses.includes(task.status);
    if (!shouldApply) {
      return task;
    }

    return {
      ...task,
      ...partial,
      updatedAt: subMinutes(new Date(), index + 1)
    };
  });

const mapUsage = (usageStats: UsageStat[], updates: Partial<UsageStat>[]) =>
  usageStats.map((stat, index) => ({
    ...stat,
    ...updates[index]
  }));

const createSystemResources = (cpu: number, memory: number, storage: number): SystemResources => {
  const memoryTotal = 32 * 1024 ** 3;
  const storageTotal = 512 * 1024 ** 3;
  const memoryUsed = Math.round((memoryTotal * memory) / 100);
  const storageUsed = Math.round((storageTotal * storage) / 100);

  return {
    cpu: {
      usage: cpu,
      cores: 8,
      model: "Demo Compute Cluster",
      loadAvg: [
        Number((cpu / 24).toFixed(2)),
        Number((cpu / 30).toFixed(2)),
        Number((cpu / 36).toFixed(2))
      ]
    },
    memory: {
      total: memoryTotal,
      used: memoryUsed,
      free: memoryTotal - memoryUsed,
      usagePercent: memory
    },
    storage: {
      total: storageTotal,
      used: storageUsed,
      free: storageTotal - storageUsed,
      usagePercent: storage
    },
    uptime: 4 * 86400 + 9 * 3600 + 12 * 60,
    platform: "linux",
    timestamp: new Date().toISOString()
  };
};

export const demoScenarios: DemoScenario[] = [
  {
    id: "normal-operation",
    label: "Normal Operation",
    description: "Balanced queues, healthy throughput, mascot idling between updates.",
    systemState: {
      globalStatus: "healthy",
      runningTaskCount: 2,
      queuedTaskCount: 1,
      blockedTaskCount: 0,
      errorTaskCount: 0,
      completedTaskCount: 4,
      currentMode: "demo"
    },
    usageStats: [],
    systemResources: createSystemResources(45, 62, 38),
    taskMutator: (tasks) => tasks
  },
  {
    id: "high-load",
    label: "High Load",
    description: "Heavy execution pressure with most tasks active.",
    systemState: {
      globalStatus: "busy",
      runningTaskCount: 4,
      queuedTaskCount: 3,
      blockedTaskCount: 0,
      errorTaskCount: 0,
      completedTaskCount: 1,
      currentMode: "demo"
    },
    usageStats: [],
    systemResources: createSystemResources(92, 88, 55),
    taskMutator: (tasks) =>
      tasks.map((task, index) => ({
        ...task,
        status: index < 4 ? "running" : index < 7 ? "queued" : "completed",
        progress: index < 4 ? 40 + index * 10 : task.progress,
        estimatedRemainingSec: index < 4 ? 600 + index * 120 : task.estimatedRemainingSec,
        updatedAt: subMinutes(new Date(), index)
      }))
  },
  {
    id: "limit-reached",
    label: "Limit Reached",
    description: "One provider exhausted and blocked tasks pile up.",
    systemState: {
      globalStatus: "critical",
      runningTaskCount: 1,
      queuedTaskCount: 1,
      blockedTaskCount: 4,
      errorTaskCount: 1,
      completedTaskCount: 1,
      currentMode: "demo"
    },
    usageStats: [],
    systemResources: createSystemResources(78, 75, 60),
    taskMutator: (tasks) =>
      tasks.map((task, index) => ({
        ...task,
        status: index < 4 ? "blocked" : task.status,
        blockedReason: index < 4 ? "Provider session limit reached" : task.blockedReason,
        progress: index < 4 ? Math.min(task.progress, 82) : task.progress,
        updatedAt: subMinutes(new Date(), index + 1)
      }))
  },
  {
    id: "error-storm",
    label: "Error Storm",
    description: "Multiple failures and retries flood the board.",
    systemState: {
      globalStatus: "critical",
      runningTaskCount: 1,
      queuedTaskCount: 1,
      blockedTaskCount: 1,
      errorTaskCount: 4,
      completedTaskCount: 1,
      currentMode: "demo"
    },
    usageStats: [],
    systemResources: createSystemResources(85, 90, 65),
    taskMutator: (tasks) =>
      mutateTasks(tasks, { status: "error", errorMessage: "Upstream adapter timeout during response stream" }, [
        "running",
        "queued",
        "paused",
        "error"
      ])
  },
  {
    id: "quiet-night",
    label: "Quiet Night",
    description: "Almost everything is calm and mostly complete.",
    systemState: {
      globalStatus: "idle",
      runningTaskCount: 0,
      queuedTaskCount: 0,
      blockedTaskCount: 0,
      errorTaskCount: 0,
      completedTaskCount: 6,
      currentMode: "demo"
    },
    usageStats: [],
    systemResources: createSystemResources(8, 40, 38),
    taskMutator: (tasks) =>
      tasks.map((task, index) => ({
        ...task,
        status: "completed",
        progress: 100,
        estimatedRemainingSec: null,
        updatedAt: subMinutes(new Date(), index * 8)
      }))
  },
  {
    id: "all-complete-party",
    label: "All Complete Party",
    description: "Everything lands successfully and the mascot celebrates.",
    systemState: {
      globalStatus: "healthy",
      runningTaskCount: 0,
      queuedTaskCount: 0,
      blockedTaskCount: 0,
      errorTaskCount: 0,
      completedTaskCount: 8,
      currentMode: "demo"
    },
    usageStats: [],
    systemResources: createSystemResources(20, 45, 38),
    taskMutator: (tasks) =>
      tasks.map((task, index) => ({
        ...task,
        status: "completed",
        progress: 100,
        errorMessage: null,
        blockedReason: null,
        updatedAt: subMinutes(new Date(), index * 3)
      }))
  }
];

export const applyScenarioUsage = (scenarioId: string, usageStats: UsageStat[]) => {
  switch (scenarioId) {
    case "high-load":
      return mapUsage(usageStats, [
        { sessionUsedPercent: 82, periodUsedPercent: 66, remainingPercent: 18, status: "warning", resetAt: addMinutes(new Date(), 40) },
        { sessionUsedPercent: 58, periodUsedPercent: 47, remainingPercent: 42, status: "normal" }
      ]);
    case "limit-reached":
      return mapUsage(usageStats, [
        { sessionUsedPercent: 100, periodUsedPercent: 92, remainingPercent: 0, status: "limit-reached", resetAt: addMinutes(new Date(), 24) },
        { sessionUsedPercent: 61, periodUsedPercent: 52, remainingPercent: 39, status: "warning" }
      ]);
    case "error-storm":
      return mapUsage(usageStats, [
        { sessionUsedPercent: 74, periodUsedPercent: 62, remainingPercent: 26, status: "warning" },
        { sessionUsedPercent: 68, periodUsedPercent: 59, remainingPercent: 32, status: "warning" }
      ]);
    case "quiet-night":
      return mapUsage(usageStats, [
        { sessionUsedPercent: 18, periodUsedPercent: 21, remainingPercent: 82, status: "normal" },
        { sessionUsedPercent: 9, periodUsedPercent: 14, remainingPercent: 91, status: "normal" }
      ]);
    case "all-complete-party":
      return mapUsage(usageStats, [
        { sessionUsedPercent: 59, periodUsedPercent: 55, remainingPercent: 41, status: "normal" },
        { sessionUsedPercent: 44, periodUsedPercent: 39, remainingPercent: 56, status: "normal" }
      ]);
    default:
      return usageStats;
  }
};

export const getScenarioSystemResources = (scenarioId: string) =>
  (() => {
    const resources = demoScenarios.find((scenario) => scenario.id === scenarioId)?.systemResources ?? createSystemResources(45, 62, 38);

    return {
      cpu: {
        ...resources.cpu,
        loadAvg: [...resources.cpu.loadAvg]
      },
      memory: { ...resources.memory },
      storage: { ...resources.storage },
      uptime: resources.uptime,
      platform: resources.platform,
      timestamp: new Date().toISOString()
    };
  })();
