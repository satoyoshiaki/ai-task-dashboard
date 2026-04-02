"use client";

import { Search } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { taskStore, useTaskStore } from "@/stores/taskStore";

export const TaskFilters = () => {
  const search = useTaskStore((state) => state.search);
  const provider = useTaskStore((state) => state.provider);
  const sortBy = useTaskStore((state) => state.sortBy);
  const t = useT();

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input value={search} onChange={(event) => taskStore.setSearch(event.target.value)} placeholder={t("tasks.searchPlaceholder")} className="pl-10" />
      </div>
      <div className="flex gap-3">
        <select
          value={provider}
          onChange={(event) => taskStore.setProvider(event.target.value as typeof provider)}
          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-zinc-200 outline-none"
        >
          <option value="all">{t("common.allProviders")}</option>
          <option value="claude-code">Claude Code</option>
          <option value="codex">Codex</option>
        </select>
        <select
          value={sortBy}
          onChange={(event) => taskStore.setSortBy(event.target.value as typeof sortBy)}
          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-zinc-200 outline-none"
        >
          <option value="updatedAt">{t("tasks.sortUpdated")}</option>
          <option value="startedAt">{t("tasks.sortStarted")}</option>
          <option value="progress">{t("tasks.sortProgress")}</option>
          <option value="usageImpact">{t("tasks.sortUsage")}</option>
        </select>
      </div>
    </div>
  );
};
