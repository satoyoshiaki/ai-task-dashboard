"use client";

import { AlertTriangle, BatteryWarning, Bug, Sparkles } from "lucide-react";
import { CharacterState } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/formatters";
import { stateMeta } from "@/components/character/CharacterStates";
import { getCharacterStateLabel, useT } from "@/lib/i18n";
import { useSettingsStore } from "@/stores/settingsStore";

const CharacterIcon = ({ state }: { state: CharacterState }) => (
  <div className={cn("mascot relative mx-auto h-44 w-44", state)}>
    <svg viewBox="0 0 180 180" className="h-full w-full overflow-visible">
      <path d="M48 62 L68 38 L83 62" fill="#27272a" />
      <path d="M132 62 L112 38 L97 62" fill="#27272a" />
      <ellipse cx="90" cy="92" rx="52" ry="46" fill="#18181b" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <ellipse cx="90" cy="128" rx="34" ry="24" fill="#27272a" />
      <circle cx="72" cy="88" r="13" fill="#f8fafc" className="mascot-eye" />
      <circle cx="108" cy="88" r="13" fill="#f8fafc" className="mascot-eye" />
      <circle cx="72" cy="90" r="6" fill="#18181b" />
      <circle cx="108" cy="90" r="6" fill="#18181b" />
      <path
        d={
          state === "completed"
            ? "M70 116 Q90 132 110 116"
            : state === "warning" || state === "error" || state === "limit-reached"
              ? "M70 126 Q90 112 110 126"
              : "M74 120 Q90 128 106 120"
        }
        stroke="#f8fafc"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="82" cy="104" r="3" fill="#fda4af" opacity="0.8" />
      <circle cx="98" cy="104" r="3" fill="#fda4af" opacity="0.8" />
      <rect x="56" y="120" width="16" height="8" rx="4" fill="#27272a" className={state === "working" ? "typing-arm" : ""} />
      <rect x="108" y="120" width="16" height="8" rx="4" fill="#27272a" className={state === "working" ? "typing-arm" : ""} />
    </svg>
    {state === "completed" && <Sparkles className="sparkle absolute -right-2 top-2 h-6 w-6 text-amber-300" />}
    {state === "warning" && <AlertTriangle className="absolute -right-2 top-6 h-6 w-6 text-amber-300" />}
    {state === "limit-reached" && <BatteryWarning className="absolute -right-2 top-6 h-6 w-6 text-rose-300" />}
    {state === "error" && <Bug className="absolute -right-2 top-6 h-6 w-6 text-rose-300" />}
  </div>
);

export const CharacterDisplay = ({
  state,
  compact = false,
  title,
  subtitle
}: {
  state: CharacterState;
  compact?: boolean;
  title?: string;
  subtitle?: string;
}) => {
  const t = useT();
  const locale = useSettingsStore((store) => store.locale);

  return (
    <Card className={cn("overflow-hidden", compact && "p-4")}>
      <div className={cn("flex items-center gap-4", compact ? "flex-row" : "flex-col")}>
        <CharacterIcon state={state} />
        <div className={cn("space-y-2", compact ? "flex-1" : "text-center")}>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{title ?? t("mascot.status")}</p>
          <h3 className="text-xl font-semibold">{getCharacterStateLabel(locale, state)}</h3>
          <p className="text-sm text-zinc-400">{subtitle ?? t("mascot.description")}</p>
        </div>
      </div>
    </Card>
  );
};
