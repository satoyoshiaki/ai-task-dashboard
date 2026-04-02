"use client";

import { getUsageStatusLabel } from "@/lib/i18n";
import { UsageStatus } from "@/lib/types";
import { statusTone } from "@/lib/utils/formatters";
import { useSettingsStore } from "@/stores/settingsStore";

export const StatusBadge = ({ status }: { status: UsageStatus }) => {
  const locale = useSettingsStore((state) => state.locale);

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusTone(status)}`}>
      {getUsageStatusLabel(locale, status)}
    </span>
  );
};
