"use client";

import { useEffect, useRef } from "react";
import { buildSnapshot } from "@/lib/adapters";
import { translate } from "@/lib/i18n";
import { dashboardStore } from "@/stores/dashboardStore";
import { notificationStore } from "@/stores/notificationStore";
import { settingsStore, useSettingsStore } from "@/stores/settingsStore";
import { taskStore } from "@/stores/taskStore";

export const useDataPolling = () => {
  const lastCriticalRef = useRef(false);
  const lastCompletedIdsRef = useRef<Set<string>>(new Set());
  const theme = useSettingsStore((state) => state.theme);
  const animationsEnabled = useSettingsStore((state) => state.animationsEnabled);
  const pollingIntervalSec = useSettingsStore((state) => state.pollingIntervalSec);
  const demoScenarioId = useSettingsStore((state) => state.demoScenarioId);
  const dataSource = useSettingsStore((state) => state.dataSource);
  const notificationsEnabled = useSettingsStore((state) => state.notificationsEnabled);

  useEffect(() => {
    settingsStore.hydrate();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("motion-disabled", !animationsEnabled);
  }, [animationsEnabled, theme]);

  useEffect(() => {
    let active = true;

    const poll = async () => {
      dashboardStore.setLoading(true);
      const settings = settingsStore.getState();
      const { locale } = settings;
      const snapshot = await buildSnapshot(settings);
      if (!active) {
        return;
      }

      dashboardStore.setSnapshot(snapshot);
      taskStore.setTasks(snapshot.tasks);

      const isCritical = snapshot.usageStats.some((stat) => stat.status === "limit-reached");
      const completedIds = new Set(snapshot.tasks.filter((task) => task.status === "completed").map((task) => task.id));

      if (notificationsEnabled) {
        if (isCritical && !lastCriticalRef.current) {
          notificationStore.push({
            title: translate(locale, "toast.usageLimitReached"),
            detail: translate(locale, "toast.usageLimitReachedMsg"),
            tone: "warning"
          });
        }

        snapshot.tasks
          .filter((task) => task.status === "error")
          .slice(0, 1)
          .forEach((task) => {
            notificationStore.push({
              title: `${translate(locale, "toast.taskFailed")} ${task.id}`,
              detail: task.errorMessage ?? translate(locale, "toast.unexpectedTaskFailure"),
              tone: "error"
            });
          });

        completedIds.forEach((id) => {
          if (!lastCompletedIdsRef.current.has(id)) {
            notificationStore.push({
              title: `${translate(locale, "toast.taskComplete")} ${id}`,
              detail: translate(locale, "toast.taskCompleteMsg"),
              tone: "success"
            });
          }
        });
      }

      if (typeof window !== "undefined" && notificationsEnabled && "Notification" in window) {
        Notification.requestPermission().catch(() => null);
      }

      lastCriticalRef.current = isCritical;
      lastCompletedIdsRef.current = completedIds;
    };

    poll();
    const interval = window.setInterval(poll, pollingIntervalSec * 1000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [dataSource, demoScenarioId, notificationsEnabled, pollingIntervalSec]);
};
