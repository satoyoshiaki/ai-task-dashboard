import { promises as fs } from "node:fs";
import os from "node:os";
import { execSync } from "node:child_process";
import { NextResponse } from "next/server";
import { SystemResources } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CpuSnapshot = {
  idle: number;
  total: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseProcStat = async (): Promise<CpuSnapshot | null> => {
  try {
    const stat = await fs.readFile("/proc/stat", "utf8");
    const cpuLine = stat.split("\n").find((line) => line.startsWith("cpu "));
    if (!cpuLine) {
      return null;
    }

    const [, ...values] = cpuLine.trim().split(/\s+/);
    const numbers = values.map((value) => Number(value)).filter((value) => Number.isFinite(value));
    if (numbers.length < 4) {
      return null;
    }

    const idle = (numbers[3] ?? 0) + (numbers[4] ?? 0);
    const total = numbers.reduce((sum, value) => sum + value, 0);

    return { idle, total };
  } catch {
    return null;
  }
};

const getCpuUsage = async () => {
  const first = await parseProcStat();
  await sleep(100);
  const second = await parseProcStat();

  if (first && second) {
    const totalDelta = second.total - first.total;
    const idleDelta = second.idle - first.idle;

    if (totalDelta > 0) {
      return Number((((totalDelta - idleDelta) / totalDelta) * 100).toFixed(2));
    }
  }

  const fallback = (os.loadavg()[0] / Math.max(os.cpus().length, 1)) * 100;
  return Number(Math.max(0, Math.min(100, fallback)).toFixed(2));
};

const getStorage = () => {
  try {
    const output = execSync("df -k /", { encoding: "utf8" });
    const lines = output.trim().split("\n");
    const targetLine = lines[lines.length - 1] ?? "";
    const parts = targetLine.trim().split(/\s+/);
    const totalKb = Number(parts[1] ?? 0);
    const usedKb = Number(parts[2] ?? 0);
    const freeKb = Number(parts[3] ?? 0);

    if ([totalKb, usedKb, freeKb].every((value) => Number.isFinite(value) && value >= 0) && totalKb > 0) {
      const total = totalKb * 1024;
      const used = usedKb * 1024;
      const free = freeKb * 1024;
      return {
        total,
        used,
        free,
        usagePercent: Number(((used / total) * 100).toFixed(2))
      };
    }
  } catch {
    return {
      total: 0,
      used: 0,
      free: 0,
      usagePercent: 0
    };
  }

  return {
    total: 0,
    used: 0,
    free: 0,
    usagePercent: 0
  };
};

export async function GET() {
  const cpus = os.cpus();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const cpuUsage = await getCpuUsage();

  const response: SystemResources = {
    cpu: {
      usage: cpuUsage,
      cores: cpus.length,
      model: cpus[0]?.model ?? "Unknown CPU",
      loadAvg: os.loadavg().map((value) => Number(value.toFixed(2)))
    },
    memory: {
      total: totalMemory,
      used: usedMemory,
      free: freeMemory,
      usagePercent: totalMemory > 0 ? Number(((usedMemory / totalMemory) * 100).toFixed(2)) : 0
    },
    storage: getStorage(),
    uptime: os.uptime(),
    platform: os.platform(),
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store"
    }
  });
}
