import { applyScenarioUsage, demoScenarios, getScenarioSystemResources } from "@/lib/mock/demoScenarios";
import { cloneSystemState, cloneTasks, cloneUsageStats } from "@/lib/mock/mockData";
import { DashboardSnapshot, IDataAdapter, SettingsState, SystemResources, Task } from "@/lib/types";
import { ClaudeCodeAdapter } from "@/lib/adapters/claudeCodeAdapter";
import { CodexAdapter } from "@/lib/adapters/codexAdapter";
import { MockAdapter } from "@/lib/adapters/mockAdapter";

const adapters = {
  mock: new MockAdapter(),
  "claude-code": new ClaudeCodeAdapter(),
  codex: new CodexAdapter()
};

export const getAdapter = (settings: SettingsState): IDataAdapter => {
  if (settings.dataSource === "combined") {
    return adapters.mock;
  }
  return adapters[settings.dataSource] ?? adapters.mock;
};

export const buildSnapshot = async (settings: SettingsState): Promise<DashboardSnapshot> => {
  const adapter = getAdapter(settings);
  let [usageStats, tasks, systemState] = await Promise.all([
    adapter.getUsageStats(),
    adapter.getTasks(),
    adapter.getSystemState()
  ]);

  if (settings.demoScenarioId !== "normal-operation") {
    const scenario = demoScenarios.find((entry) => entry.id === settings.demoScenarioId);
    if (scenario) {
      usageStats = applyScenarioUsage(scenario.id, usageStats);
      tasks = scenario.taskMutator(tasks);
      systemState = { ...scenario.systemState };
    }
  }

  return {
    usageStats,
    tasks,
    systemState,
    recentActivity: [...tasks.flatMap((task) => task.logs)].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 6)
  };
};

export const buildSystemResources = async (settings: SettingsState): Promise<SystemResources> => {
  if (settings.demoScenarioId !== "normal-operation") {
    return getScenarioSystemResources(settings.demoScenarioId);
  }

  if (settings.dataSource === "mock") {
    return adapters.mock.getSystemResources();
  }

  return adapters.mock.getSystemResources();
};

export const createBaseSnapshot = (): DashboardSnapshot => ({
  usageStats: cloneUsageStats(),
  tasks: cloneTasks(),
  systemState: cloneSystemState(),
  recentActivity: cloneTasks()
    .flatMap((task) => task.logs)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 6)
});
