"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Cpu, HardDrive, Server } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useSystemResources } from "@/lib/hooks/useSystemResources";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils/formatters";
import { useSettingsStore } from "@/stores/settingsStore";

const getUsageTone = (value: number) => {
  if (value < 60) {
    return {
      stroke: "#34d399",
      text: "text-emerald-300",
      track: "from-emerald-400 via-emerald-300 to-lime-300"
    };
  }

  if (value < 80) {
    return {
      stroke: "#fbbf24",
      text: "text-amber-300",
      track: "from-amber-400 via-yellow-300 to-orange-300"
    };
  }

  return {
    stroke: "#f87171",
    text: "text-rose-300",
    track: "from-rose-500 via-red-400 to-orange-300"
  };
};

const formatBytesToGb = (value: number) => `${(value / 1024 ** 3).toFixed(1)} GB`;

const formatUptime = (value: number, locale: "ja" | "en", t: ReturnType<typeof useT>) => {
  const totalMinutes = Math.floor(value / 60);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (locale === "ja") {
    return `${days}${t("days")} ${hours}${t("hours")} ${minutes}${t("minutes")}`;
  }

  return `${days} ${t("days")} ${hours} ${t("hours")} ${minutes} ${t("minutes")}`;
};

const AnimatedNumber = ({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);

  useEffect(() => {
    let frame = 0;
    const startedAt = performance.now();
    const startValue = previousValueRef.current;
    const delta = value - startValue;
    const duration = 450;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(startValue + delta * eased);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    previousValueRef.current = value;

    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <motion.span className={className}>{`${Math.round(displayValue)}${suffix}`}</motion.span>;
};

const CircularMeter = ({ value, label, sublabel, stroke }: { value: number; label: string; sublabel: string; stroke: string }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;

  return (
    <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</p>
          <p className="mt-2 text-sm text-zinc-300">{sublabel}</p>
        </div>
        <div className="relative">
          <svg viewBox="0 0 120 120" className="h-28 w-28">
            <circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke={stroke}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              fill="none"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatedNumber value={value} suffix="%" className="text-2xl font-semibold text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const SystemResourcesCard = () => {
  const { data, loading, error } = useSystemResources();
  const locale = useSettingsStore((state) => state.locale);
  const t = useT();

  if (!data && loading) {
    return (
      <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-950/70">
        <div className="h-[340px] animate-pulse rounded-3xl bg-white/5" />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="bg-gradient-to-br from-zinc-900/90 to-zinc-950/70">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t("System Resources")}</p>
        <p className="mt-4 text-sm text-rose-300">{error ?? "Unavailable"}</p>
      </Card>
    );
  }

  const cpuTone = getUsageTone(data.cpu.usage);
  const memoryTone = getUsageTone(data.memory.usagePercent);
  const storageTone = getUsageTone(data.storage.usagePercent);

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-zinc-950/90 via-slate-950/75 to-cyan-950/30">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t("System Resources")}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{data.platform}</h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-zinc-400">
            <Server className="h-4 w-4" />
            {data.cpu.cores} {t("cores")}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-right">
          <p className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
            <Clock className="h-4 w-4" />
            {t("Uptime")}
          </p>
          <p className="mt-2 text-sm text-zinc-200">{formatUptime(data.uptime, locale, t)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <CircularMeter
          value={data.cpu.usage}
          label={t("CPU Usage")}
          sublabel={`${data.cpu.model} · ${data.cpu.cores} ${t("cores")}`}
          stroke={cpuTone.stroke}
        />
        <CircularMeter
          value={data.memory.usagePercent}
          label={t("Memory Usage")}
          sublabel={`${formatBytesToGb(data.memory.used)} / ${formatBytesToGb(data.memory.total)}`}
          stroke={memoryTone.stroke}
        />
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-black/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-zinc-400" />
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t("Storage Usage")}</p>
          </div>
          <AnimatedNumber value={data.storage.usagePercent} suffix="%" className={cn("text-lg font-semibold", storageTone.text)} />
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className={cn("h-full rounded-full bg-gradient-to-r", storageTone.track)}
            initial={false}
            animate={{ width: `${data.storage.usagePercent}%` }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
          />
        </div>
        <p className="mt-3 text-sm text-zinc-300">
          {formatBytesToGb(data.storage.used)} / {formatBytesToGb(data.storage.total)}
        </p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
          <div className="flex items-center gap-2">
            <Cpu className={cn("h-4 w-4", cpuTone.text)} />
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t("Load Average")}</p>
          </div>
          <div className="mt-3 flex gap-3">
            {data.cpu.loadAvg.map((value, index) => (
              <div key={`${index}-${value}`} className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-zinc-500">{index === 0 ? "1m" : index === 1 ? "5m" : "15m"}</p>
                <motion.p
                  key={value}
                  initial={{ opacity: 0.6, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-lg font-semibold text-white"
                >
                  {value.toFixed(2)}
                </motion.p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/10 p-4">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-zinc-400" />
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">OS</p>
          </div>
          <p className="mt-3 text-lg font-semibold text-white">{data.platform}</p>
          <p className="mt-2 text-sm text-zinc-400">{new Date(data.timestamp).toLocaleTimeString(locale === "ja" ? "ja-JP" : "en-US")}</p>
          {error ? <p className="mt-3 text-xs text-amber-300">{error}</p> : null}
        </div>
      </div>
    </Card>
  );
};
