import { Activity, AlertCircle, CheckCircle2, PauseCircle, PlayCircle, Timer } from "lucide-react";
import { SystemState } from "@/lib/types";
import { Card } from "@/components/ui/card";

const stats = [
  { key: "runningTaskCount", label: "Running", icon: PlayCircle, tone: "text-emerald-300" },
  { key: "queuedTaskCount", label: "Queued", icon: Timer, tone: "text-sky-300" },
  { key: "blockedTaskCount", label: "Blocked", icon: PauseCircle, tone: "text-amber-300" },
  { key: "errorTaskCount", label: "Errors", icon: AlertCircle, tone: "text-rose-300" },
  { key: "completedTaskCount", label: "Completed", icon: CheckCircle2, tone: "text-violet-300" }
] as const;

export const StatsOverview = ({ systemState }: { systemState: SystemState }) => (
  <Card>
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">System Overview</p>
        <h3 className="mt-2 text-xl font-semibold">Cluster status: {systemState.globalStatus}</h3>
      </div>
      <Activity className="h-8 w-8 text-zinc-500" />
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.key} className="rounded-2xl border border-white/10 bg-black/15 p-4">
            <div className="flex items-center justify-between">
              <Icon className={`h-5 w-5 ${item.tone}`} />
              <span className="text-2xl font-semibold">{systemState[item.key]}</span>
            </div>
            <p className="mt-4 text-sm text-zinc-400">{item.label}</p>
          </div>
        );
      })}
    </div>
  </Card>
);
