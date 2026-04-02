import { cn } from "@/lib/utils/formatters";

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <section className={cn("glass-card rounded-3xl p-5", className)}>{children}</section>
);
