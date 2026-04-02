import { CharacterState } from "@/lib/types";

export const stateMeta: Record<CharacterState, { accent: string }> = {
  idle: { accent: "#a1a1aa" },
  working: { accent: "#38bdf8" },
  completed: { accent: "#34d399" },
  warning: { accent: "#fbbf24" },
  "limit-reached": { accent: "#fb7185" },
  error: { accent: "#f87171" }
};
