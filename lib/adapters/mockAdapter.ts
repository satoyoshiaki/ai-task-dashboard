import { cloneSystemState, cloneTasks, cloneUsageStats } from "@/lib/mock/mockData";
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
}
