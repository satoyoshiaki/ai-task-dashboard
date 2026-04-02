"use client";

import { DashboardSnapshot, LogEntry, SystemState, Task, UsageStat } from "@/lib/types";
import { createStore } from "@/lib/utils/store";

interface DashboardStoreState extends DashboardSnapshot {
  isLoading: boolean;
  lastUpdated: Date | null;
}

const store = createStore<DashboardStoreState>({
  usageStats: [],
  tasks: [],
  systemState: {
    globalStatus: "idle",
    runningTaskCount: 0,
    queuedTaskCount: 0,
    blockedTaskCount: 0,
    errorTaskCount: 0,
    completedTaskCount: 0,
    currentMode: "mock"
  },
  recentActivity: [],
  isLoading: true,
  lastUpdated: null
});

export const dashboardStore = {
  ...store,
  setLoading: (isLoading: boolean) => store.setState({ isLoading }),
  setSnapshot: (snapshot: DashboardSnapshot) =>
    store.setState({
      ...snapshot,
      isLoading: false,
      lastUpdated: new Date()
    })
};

export const useDashboardStore = <T,>(selector: (state: DashboardStoreState) => T) => dashboardStore.useStore(selector);
