import { cn } from "@/lib/utils/formatters";

export const Progress = ({ value, className }: { value: number; className?: string }) => (
  <div className={cn("h-2 overflow-hidden rounded-full bg-white/10", className)}>
    <div className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400" style={{ width: `${value}%` }} />
  </div>
);
