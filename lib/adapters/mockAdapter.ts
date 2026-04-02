import { cloneSystemResources, cloneSystemState, cloneTasks, cloneUsageStats } from "@/lib/mock/mockData";
import { IDataAdapter } from "@/lib/types";
import { Task, TaskFilter } from "@/lib/types";

const wait = () => new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

const applyFilter = (tasks: Task[], filter?: TaskFilter) => {
  let next = [...tasks];
  if (filter?.status && filter.status !== "all") {
    next = next.filter((task) => task.status === filter.status);
  }
  if (filter?.provider && filter.provider !== "all") {
    next = next.filter((task) => task.provider === filter.provider);
  }
  if (filter?.search) {
    const query = filter.search.toLowerCase();
    next = next.filter((task) => `${task.id} ${task.title}`.toLowerCase().includes(query));
  }
  if (filter?.sortBy) {
    const sortBy = filter.sortBy;
    next.sort((a, b) => {
      if (sortBy === "progress" || sortBy === "usageImpact") {
        return b[sortBy] - a[sortBy];
      }
      return b[sortBy].getTime() - a[sortBy].getTime();
    });
  }
  return next;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const withVariation = (base: number, spread: number) => clamp(base + (Math.random() * spread * 2 - spread), 0, 100);

export class MockAdapter implements IDataAdapter {
  async getUsageStats() {
    await wait();
    return cloneUsageStats();
  }

  async getTasks(filter?: TaskFilter) {
    await wait();
    return applyFilter(cloneTasks(), filter);
  }

  async getTask(id: string) {
    await wait();
    return cloneTasks().find((task) => task.id === id) ?? null;
  }

  async getSystemState() {
    await wait();
    return cloneSystemState();
  }

  async getSystemResources() {
    await wait();
    const resources = cloneSystemResources();
    const cpuUsage = withVariation(45, 6);
    const memoryUsage = withVariation(62, 4);
    const storageUsage = withVariation(38, 2);

    const memoryUsed = Math.round((resources.memory.total * memoryUsage) / 100);
    const storageUsed = Math.round((resources.storage.total * storageUsage) / 100);

    return {
      ...resources,
      cpu: {
        ...resources.cpu,
        usage: cpuUsage,
        loadAvg: resources.cpu.loadAvg.map((value, index) => Number((value + (cpuUsage - 45) / (index + 8)).toFixed(2)))
      },
      memory: {
        ...resources.memory,
        used: memoryUsed,
        free: resources.memory.total - memoryUsed,
        usagePercent: memoryUsage
      },
      storage: {
        ...resources.storage,
        used: storageUsed,
        free: resources.storage.total - storageUsed,
        usagePercent: storageUsage
      },
      uptime: resources.uptime + Math.round(Math.random() * 180),
      timestamp: new Date().toISOString()
    };
  }
}
