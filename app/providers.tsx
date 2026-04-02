"use client";

import { useEffect } from "react";
import { useDataPolling } from "@/lib/hooks/useDataPolling";
import { useDashboardStore } from "@/stores/dashboardStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DemoModeBar } from "@/components/layout/DemoModeBar";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { cn } from "@/lib/utils/formatters";
import { useSettingsStore } from "@/stores/settingsStore";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  useDataPolling();
  const usageStats = useDashboardStore((state) => state.usageStats);
  const locale = useSettingsStore((state) => state.locale);
  const limited = usageStats.some((item) => item.status === "limit-reached");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className={cn("min-h-screen bg-grid-fade", limited && "dashboard-desaturated")}>
      <DemoModeBar />
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 md:px-6">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Header />
          <main className="pb-8">{children}</main>
        </div>
      </div>
      <NotificationCenter />
    </div>
  );
};
