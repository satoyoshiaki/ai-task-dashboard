import { MockAdapter } from "@/lib/adapters/mockAdapter";
import { Task, TaskFilter } from "@/lib/types";

interface CodexSession {
  sessionId: string;
  cwd: string;
  firstPrompt: string;
  startedAt: string;
  updatedAt: string;
  messageCount: number;
}

function sessionToTask(session: CodexSession): Task {
  const updatedAt = new Date(session.updatedAt);
  const startedAt = new Date(session.startedAt);
  const ageMs = Date.now() - updatedAt.getTime();
  const isRecent = ageMs < 15 * 60 * 1000;
  const status = isRecent ? "running" : "completed";
  const progress = isRecent ? Math.min(90, Math.round((session.messageCount / 10) * 100)) : 100;

  const cwdLabel = session.cwd.split("/").pop() || session.cwd || "codex";

  return {
    id: session.sessionId.slice(0, 8),
    provider: "codex",
    title: session.firstPrompt,
    status,
    progress,
    startedAt,
    updatedAt,
    estimatedRemainingSec: isRecent ? 180 : null,
    blockedReason: null,
    errorMessage: null,
    resumable: false,
    usageImpact: Math.min(100, session.messageCount * 8),
    logs: [
      {
        id: `${session.sessionId}-log-0`,
        timestamp: startedAt,
        level: "info",
        message: `Session started — ${cwdLabel}`,
      },
    ],
    retryHistory: [],
  };
}

export class CodexAdapter extends MockAdapter {
  private cachedTasks: Task[] | null = null;
  private cacheAt = 0;

  private async fetchTasks(): Promise<Task[]> {
    const now = Date.now();
    if (this.cachedTasks && now - this.cacheAt < 30_000) return this.cachedTasks;

    try {
      const res = await fetch("/api/codex-tasks", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { sessions: CodexSession[] } = await res.json();
      this.cachedTasks = data.sessions.map(sessionToTask);
      this.cacheAt = now;
      return this.cachedTasks;
    } catch {
      return super.getTasks();
    }
  }

  override async getTasks(filter?: Parameters<MockAdapter["getTasks"]>[0]): Promise<Task[]> {
    const tasks = await this.fetchTasks();
    if (!filter) return tasks;

    let result = [...tasks];
    if (filter.status && filter.status !== "all") result = result.filter((t) => t.status === filter.status);
    if (filter.provider && filter.provider !== "all") result = result.filter((t) => t.provider === filter.provider);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter((t) => `${t.id} ${t.title}`.toLowerCase().includes(q));
    }
    if (filter.sortBy) {
      const key = filter.sortBy;
      result.sort((a, b) => {
        if (key === "progress" || key === "usageImpact") return b[key] - a[key];
        return b[key].getTime() - a[key].getTime();
      });
    }
    return result;
  }

  override async getTask(id: string) {
    const tasks = await this.fetchTasks();
    return tasks.find((t) => t.id === id) ?? null;
  }
}
