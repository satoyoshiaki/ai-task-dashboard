"use client";

import { createStore } from "@/lib/utils/store";
import { SettingsState } from "@/lib/types";

const defaults: SettingsState = {
  dataSource: "mock",
  pollingIntervalSec: 10,
  timezone: "Asia/Tokyo",
  theme: "dark",
  animationsEnabled: true,
  notificationsEnabled: true,
  webhookDiscord: "",
  webhookSlack: "",
  demoScenarioId: "normal-operation"
};

const store = createStore(defaults, "ai-task-dashboard-settings");

export const settingsStore = {
  ...store,
  update: (partial: Partial<SettingsState>) => store.setState(partial)
};

export const useSettingsStore = <T,>(selector: (state: SettingsState) => T) => settingsStore.useStore(selector);
