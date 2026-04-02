export type Provider = "claude-code" | "codex";
export type UsageStatus = "normal" | "warning" | "limit-reached" | "unknown";
export type TaskStatus =
  | "running"
  | "queued"
  | "paused"
  | "blocked"
  | "error"
  | "completed";
export type GlobalStatus = "healthy" | "busy" | "warning" | "critical" | "idle";
export type Mode = "mock" | "live" | "demo";
export type CharacterState =
  | "idle"
  | "working"
  | "completed"
  | "warning"
  | "limit-reached"
  | "error";
export type DataSource = "mock" | "claude-code" | "codex" | "combined";

export interface UsageStat {
  provider: Provider;
  sessionUsedPercent: number;
  periodUsedPercent: number;
  remainingPercent: number;
  resetAt: Date | null;
  status: UsageStatus;
}

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: "info" | "warning" | "error" | "success";
  message: string;
}

export interface RetryEntry {
  id: string;
  timestamp: Date;
  outcome: "retried" | "recovered" | "failed";
  note: string;
}

export interface Task {
  id: string;
  provider: Provider;
  title: string;
  status: TaskStatus;
  progress: number;
  startedAt: Date;
  updatedAt: Date;
  estimatedRemainingSec: number | null;
  blockedReason: string | null;
  errorMessage: string | null;
  resumable: boolean;
  logs: LogEntry[];
  usageImpact: number;
  retryHistory: RetryEntry[];
}

export interface SystemState {
  globalStatus: GlobalStatus;
  runningTaskCount: number;
  queuedTaskCount: number;
  blockedTaskCount: number;
  errorTaskCount: number;
  completedTaskCount: number;
  currentMode: Mode;
}

export interface TaskFilter {
  status?: TaskStatus | "all";
  provider?: Provider | "all";
  search?: string;
  sortBy?: "updatedAt" | "startedAt" | "progress" | "usageImpact";
}

export interface DemoScenario {
  id: string;
  label: string;
  description: string;
  systemState: SystemState;
  usageStats: UsageStat[];
  taskMutator: (tasks: Task[]) => Task[];
}

export interface DashboardSnapshot {
  usageStats: UsageStat[];
  tasks: Task[];
  systemState: SystemState;
  recentActivity: LogEntry[];
}

export interface IDataAdapter {
  getUsageStats(): Promise<UsageStat[]>;
  getTasks(filter?: TaskFilter): Promise<Task[]>;
  getTask(id: string): Promise<Task | null>;
  getSystemState(): Promise<SystemState>;
}

export interface SettingsState {
  dataSource: DataSource;
  pollingIntervalSec: number;
  timezone: string;
  theme: "dark" | "light";
  animationsEnabled: boolean;
  notificationsEnabled: boolean;
  webhookDiscord: string;
  webhookSlack: string;
  demoScenarioId: string;
}
