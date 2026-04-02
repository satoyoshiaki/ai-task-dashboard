"use client";

import { useEffect, useRef, useState } from "react";
import { buildSystemResources } from "@/lib/adapters";
import { SystemResources } from "@/lib/types";
import { settingsStore, useSettingsStore } from "@/stores/settingsStore";

type UseSystemResourcesResult = {
  data: SystemResources | null;
  loading: boolean;
  error: string | null;
};

export const useSystemResources = (): UseSystemResourcesResult => {
  const pollingIntervalSec = useSettingsStore((state) => state.pollingIntervalSec);
  const dataSource = useSettingsStore((state) => state.dataSource);
  const demoScenarioId = useSettingsStore((state) => state.demoScenarioId);

  const cacheRef = useRef<SystemResources | null>(null);
  const [data, setData] = useState<SystemResources | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const poll = async () => {
      setLoading(cacheRef.current === null);

      try {
        const settings = settingsStore.getState();
        const nextData =
          dataSource === "mock" || demoScenarioId !== "normal-operation"
            ? await buildSystemResources(settings)
            : await fetch("/api/system-resources", { cache: "no-store" }).then(async (response) => {
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}`);
                }

                return (await response.json()) as SystemResources;
              });

        if (!active) {
          return;
        }

        cacheRef.current = nextData;
        setData(nextData);
        setError(null);
      } catch (caughtError) {
        if (!active) {
          return;
        }

        setData(cacheRef.current);
        setError(caughtError instanceof Error ? caughtError.message : "Failed to load system resources");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    poll();
    const interval = window.setInterval(poll, pollingIntervalSec * 1000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [dataSource, demoScenarioId, pollingIntervalSec]);

  return { data, loading, error };
};
