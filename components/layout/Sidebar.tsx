"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListTodo, Settings } from "lucide-react";
import { TranslationKey, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils/formatters";

const nav = [
  { href: "/", key: "nav.dashboard", icon: LayoutDashboard },
  { href: "/tasks", key: "nav.tasks", icon: ListTodo },
  { href: "/settings", key: "nav.settings", icon: Settings }
] as const satisfies ReadonlyArray<{ href: string; key: TranslationKey; icon: typeof LayoutDashboard }>;

export const Sidebar = () => {
  const pathname = usePathname();
  const t = useT();

  return (
    <aside className="glass-card sticky top-4 hidden h-[calc(100vh-2rem)] w-72 rounded-[32px] p-5 lg:block">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t("dashboard.aiOps")}</p>
        <h2 className="mt-3 text-2xl font-semibold">{t("dashboard.title")}</h2>
        <p className="mt-2 text-sm text-zinc-400">{t("dashboard.subtitle")}</p>
      </div>
      <nav className="mt-10 space-y-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                active ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
