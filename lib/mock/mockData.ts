import { addMinutes, addSeconds, subMinutes, subSeconds } from "date-fns";
import { LogEntry, SystemState, Task, UsageStat } from "@/lib/types";

const now = new Date();

const makeLogs = (prefix: string, count: number, status: Task["status"]): LogEntry[] =>
  Array.from({ length: count }).map((_, index) => ({
    id: `${prefix}-log-${index}`,
    timestamp: subSeconds(now, count * 50 - index * 35),
    level:
      status === "error"
        ? "error"
        : status === "blocked"
          ? "warning"
          : index === count - 1 && status === "completed"
            ? "success"
            : "info",
    message:
      index === count - 1 && status === "completed"
        ? `${prefix} finished successfully`
        : `${prefix} checkpoint ${index + 1} synced`
  }));

export const baseUsageStats: UsageStat[] = [
  {
    provider: "claude-code",
    sessionUsedPercent: 65,
    periodUsedPercent: 45,
    remainingPercent: 35,
    resetAt: addMinutes(now, 83),
    status: "normal"
  },
  {
    provider: "codex",
    sessionUsedPercent: 30,
    periodUsedPercent: 20,
    remainingPercent: 70,
    resetAt: addMinutes(now, 118),
    status: "normal"
  }
];

export const baseTasks: Task[] = [
  {
    id: "claude-4821",
    provider: "claude-code",
    title: "Refactor adapter fallback chain",
    status: "running",
    progress: 72,
    startedAt: subMinutes(now, 22),
    updatedAt: subSeconds(now, 30),
    estimatedRemainingSec: 780,
    blockedReason: null,
    errorMessage: null,
    resumable: true,
    logs: makeLogs("claude-4821", 5, "running"),
    usageImpact: 13800,
    retryHistory: [{ id: "retry-1", timestamp: subMinutes(now, 15), outcome: "retried", note: "Recovered after schema mismatch" }]
  },
  {
    id: "claude-4814",
    provider: "claude-code",
    title: "Generate incident summary digest",
    status: "blocked",
    progress: 48,
    startedAt: subMinutes(now, 55),
    updatedAt: subMinutes(now, 5),
    estimatedRemainingSec: null,
    blockedReason: "Waiting on fresh telemetry export",
    errorMessage: null,
    resumable: true,
    logs: makeLogs("claude-4814", 4, "blocked"),
    usageImpact: 9700,
    retryHistory: []
  },
  {
    id: "claude-4802",
    provider: "claude-code",
    title: "Summarize overnight CI regressions",
    status: "completed",
    progress: 100,
    startedAt: subMinutes(now, 140),
    updatedAt: subMinutes(now, 87),
    estimatedRemainingSec: null,
    blockedReason: null,
    errorMessage: null,
    resumable: false,
    logs: makeLogs("claude-4802", 6, "completed"),
    usageImpact: 6200,
    retryHistory: [{ id: "retry-2", timestamp: subMinutes(now, 120), outcome: "recovered", note: "Replayed after transient parse error" }]
  },
  {
    id: "claude-4796",
    provider: "claude-code",
    title: "Draft release note comparison",
    status: "queued",
    progress: 0,
    startedAt: subMinutes(now, 8),
    updatedAt: subMinutes(now, 8),
    estimatedRemainingSec: 1500,
    blockedReason: null,
    errorMessage: null,
    resumable: true,
    logs: makeLogs("claude-4796", 2, "queued"),
    usageImpact: 4300,
    retryHistory: []
  },
  {
    id: "codex-7622",
    provider: "codex",
    title: "Build task dashboard interactions",
    status: "running",
    progress: 54,
    startedAt: subMinutes(now, 41),
    updatedAt: subSeconds(now, 12),
    estimatedRemainingSec: 1120,
    blockedReason: null,
    errorMessage: null,
    resumable: true,
    logs: makeLogs("codex-7622", 6, "running"),
    usageImpact: 8600,
    retryHistory: []
  },
  {
    id: "codex-7619",
    provider: "codex",
    title: "Investigate flaky auth test",
    status: "error",
    progress: 33,
    startedAt: subMinutes(now, 67),
    updatedAt: subMinutes(now, 3),
    estimatedRemainingSec: null,
    blockedReason: null,
    errorMessage: "Stack trace indicates null session token during retry loop",
    resumable: true,
    logs: makeLogs("codex-7619", 5, "error"),
    usageImpact: 12400,
    retryHistory: [{ id: "retry-3", timestamp: subMinutes(now, 12), outcome: "failed", note: "Failure repeated on second attempt" }]
  },
  {
    id: "codex-7608",
    provider: "codex",
    title: "Queue deployment audit",
    status: "paused",
    progress: 58,
    startedAt: subMinutes(now, 96),
    updatedAt: subMinutes(now, 25),
    estimatedRemainingSec: 2200,
    blockedReason: null,
    errorMessage: null,
    resumable: true,
    logs: makeLogs("codex-7608", 4, "paused"),
    usageImpact: 5100,
    retryHistory: []
  },
  {
    id: "codex-7592",
    provider: "codex",
    title: "Archive completed agent transcripts",
    status: "completed",
    progress: 100,
    startedAt: subMinutes(now, 180),
    updatedAt: subMinutes(now, 130),
    estimatedRemainingSec: null,
    blockedReason: null,
    errorMessage: null,
    resumable: false,
    logs: makeLogs("codex-7592", 5, "completed"),
    usageImpact: 2900,
    retryHistory: []
  }
];

export const baseSystemState: SystemState = {
  globalStatus: "busy",
  runningTaskCount: 2,
  queuedTaskCount: 1,
  blockedTaskCount: 1,
  errorTaskCount: 1,
  completedTaskCount: 2,
  currentMode: "mock"
};

export const baseRecentActivity = [
  {
    id: "activity-1",
    timestamp: subSeconds(now, 40),
    level: "info" as const,
    message: "claude-4821 synced a new adapter checkpoint"
  },
  {
    id: "activity-2",
    timestamp: subMinutes(now, 3),
    level: "error" as const,
    message: "codex-7619 failed while replaying auth test"
  },
  {
    id: "activity-3",
    timestamp: subMinutes(now, 6),
    level: "success" as const,
    message: "claude-4802 finished incident summary digest"
  }
];

export const cloneUsageStats = () =>
  baseUsageStats.map((stat) => ({
    ...stat,
    resetAt: stat.resetAt ? new Date(stat.resetAt) : null
  }));

export const cloneTasks = () =>
  baseTasks.map((task) => ({
    ...task,
    startedAt: new Date(task.startedAt),
    updatedAt: new Date(task.updatedAt),
    logs: task.logs.map((log) => ({ ...log, timestamp: new Date(log.timestamp) })),
    retryHistory: task.retryHistory.map((entry) => ({ ...entry, timestamp: new Date(entry.timestamp) }))
  }));

export const cloneSystemState = () => ({ ...baseSystemState });
