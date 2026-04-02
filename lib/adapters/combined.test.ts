import test from "node:test";
import assert from "node:assert/strict";
import type { Task, UsageStat } from "@/lib/types";
import {
  buildCombinedSnapshot,
  dedupeUsageStats,
  deriveLiveSystemState
} from "@/lib/adapters/combined";

const createTask = (overrides: Partial<Task>): Task => ({
  id: "task-1",
  provider: "codex",
  title: "Test task",
  status: "queued",
  progress: 0,
  startedAt: new Date("2026-04-02T00:00:00.000Z"),
  updatedAt: new Date("2026-04-02T00:10:00.000Z"),
  estimatedRemainingSec: null,
  blockedReason: null,
  errorMessage: null,
  resumable: false,
  usageImpact: 100,
  logs: [],
  retryHistory: [],
  ...overrides
});

const createUsage = (overrides: Partial<UsageStat>): UsageStat => ({
  provider: "codex",
  sessionUsedPercent: 20,
  periodUsedPercent: 10,
  remainingPercent: 80,
  resetAt: new Date("2026-04-02T01:00:00.000Z"),
  status: "normal",
  ...overrides
});

test("dedupeUsageStats keeps one stat per provider", () => {
  const stats = dedupeUsageStats([
    [
      createUsage({ provider: "claude-code", sessionUsedPercent: 65 }),
      createUsage({ provider: "codex", sessionUsedPercent: 30 })
    ],
    [
      createUsage({ provider: "claude-code", sessionUsedPercent: 99 }),
      createUsage({ provider: "codex", sessionUsedPercent: 55 })
    ]
  ]);

  assert.equal(stats.length, 2);
  assert.equal(stats[0]?.provider, "claude-code");
  assert.equal(stats[0]?.sessionUsedPercent, 99);
  assert.equal(stats[1]?.provider, "codex");
  assert.equal(stats[1]?.sessionUsedPercent, 55);
});

test("deriveLiveSystemState counts task buckets and marks live mode", () => {
  const systemState = deriveLiveSystemState(
    [
      createTask({ id: "running-1", status: "running" }),
      createTask({ id: "queued-1", status: "queued" }),
      createTask({ id: "blocked-1", status: "blocked" }),
      createTask({ id: "error-1", status: "error" }),
      createTask({ id: "done-1", status: "completed" })
    ],
    [createUsage({ provider: "claude-code", status: "warning" })]
  );

  assert.equal(systemState.currentMode, "live");
  assert.equal(systemState.runningTaskCount, 1);
  assert.equal(systemState.queuedTaskCount, 1);
  assert.equal(systemState.blockedTaskCount, 1);
  assert.equal(systemState.errorTaskCount, 1);
  assert.equal(systemState.completedTaskCount, 1);
  assert.equal(systemState.globalStatus, "critical");
});

test("buildCombinedSnapshot merges tasks and sorts recent activity", () => {
  const snapshot = buildCombinedSnapshot({
    taskGroups: [
      [createTask({ id: "codex-1", provider: "codex", updatedAt: new Date("2026-04-02T00:01:00.000Z"), logs: [{ id: "log-1", level: "info", message: "older", timestamp: new Date("2026-04-02T00:01:00.000Z") }] })],
      [createTask({ id: "claude-1", provider: "claude-code", updatedAt: new Date("2026-04-02T00:02:00.000Z"), logs: [{ id: "log-2", level: "info", message: "newer", timestamp: new Date("2026-04-02T00:02:00.000Z") }] })]
    ],
    usageGroups: [
      [createUsage({ provider: "codex" })],
      [createUsage({ provider: "claude-code" })]
    ]
  });

  assert.equal(snapshot.tasks.length, 2);
  assert.equal(snapshot.recentActivity[0]?.message, "newer");
  assert.equal(snapshot.systemState.currentMode, "live");
});
