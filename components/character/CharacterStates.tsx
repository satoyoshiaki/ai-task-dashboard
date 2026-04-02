import { CharacterState } from "@/lib/types";

export const stateMeta: Record<CharacterState, { label: string; accent: string }> = {
  idle: { label: "Idle", accent: "#a1a1aa" },
  working: { label: "Working", accent: "#38bdf8" },
  completed: { label: "Completed", accent: "#34d399" },
  warning: { label: "Warning", accent: "#fbbf24" },
  "limit-reached": { label: "Limit Reached", accent: "#fb7185" },
  error: { label: "Error", accent: "#f87171" }
};
