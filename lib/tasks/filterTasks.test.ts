import test from "node:test";
import assert from "node:assert/strict";
import type { Task } from "@/lib/types";
import { filterTasks } from "@/lib/tasks/filterTasks";

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

test("filterTasks narrows by provider and search", () => {
  const tasks = filterTasks({
    tasks: [
      createTask({ id: "codex-1", provider: "codex", title: "Build dashboard" }),
      createTask({ id: "claude-1", provider: "claude-code", title: "Write summary" })
    ],
    activeStatus: "all",
    provider: "codex",
    search: "dash",
    sortBy: "updatedAt"
  });

  assert.equal(tasks.length, 1);
  assert.equal(tasks[0]?.id, "codex-1");
});

test("filterTasks sorts by numeric fields descending", () => {
  const tasks = filterTasks({
    tasks: [
      createTask({ id: "task-a", progress: 20 }),
      createTask({ id: "task-b", progress: 80 })
    ],
    activeStatus: "all",
    provider: "all",
    search: "",
    sortBy: "progress"
  });

  assert.deepEqual(
    tasks.map((task) => task.id),
    ["task-b", "task-a"]
  );
});
