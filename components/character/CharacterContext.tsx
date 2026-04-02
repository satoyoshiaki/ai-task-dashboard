import { CharacterState, SystemState, Task } from "@/lib/types";

export const resolveCharacterState = (systemState: SystemState, task?: Task | null): CharacterState => {
  if (task?.status === "error" || systemState.globalStatus === "critical") {
    return task?.blockedReason?.includes("limit") ? "limit-reached" : "error";
  }
  if (task?.status === "blocked") {
    return task.blockedReason?.toLowerCase().includes("limit") ? "limit-reached" : "warning";
  }
  if (task?.status === "completed") {
    return "completed";
  }
  if (task?.status === "running" || systemState.globalStatus === "busy") {
    return "working";
  }
  if (systemState.globalStatus === "warning") {
    return "warning";
  }
  return "idle";
};
