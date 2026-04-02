import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import readline from "readline";

interface CodexEntry {
  timestamp?: string;
  type?: string;
  payload?: {
    id?: string;
    cwd?: string;
    timestamp?: string;
    role?: string;
    content?: Array<{ type: string; text?: string }>;
    type?: string;
  };
}

interface CodexSessionSummary {
  sessionId: string;
  cwd: string;
  firstPrompt: string;
  startedAt: string;
  updatedAt: string;
  messageCount: number;
}

async function parseCodexSession(filePath: string): Promise<{ meta: { id: string; cwd: string; ts: string } | null; firstPrompt: string; count: number; updatedAt: string }> {
  return new Promise((resolve) => {
    let meta: { id: string; cwd: string; ts: string } | null = null;
    let firstPrompt = "";
    let count = 0;
    let updatedAt = "";
    const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity });
    rl.on("line", (line) => {
      try {
        const entry: CodexEntry = JSON.parse(line);
        if (entry.timestamp) updatedAt = entry.timestamp;
        if (entry.type === "session_meta" && entry.payload?.id) {
          meta = { id: entry.payload.id, cwd: entry.payload.cwd ?? "", ts: entry.payload.timestamp ?? entry.timestamp ?? "" };
        }
        if (entry.type === "response_item" && entry.payload?.role === "user") {
          count++;
          if (!firstPrompt) {
            const content = entry.payload.content ?? [];
            const text = content.find((c) => c.type === "input_text")?.text ?? "";
            // Skip system/instructions blocks (very long)
            if (text.length < 2000 && text.length > 5) {
              firstPrompt = text.slice(0, 120);
            }
          }
        }
      } catch {}
    });
    rl.on("close", () => resolve({ meta, firstPrompt: firstPrompt || "(no prompt)", count, updatedAt }));
    rl.on("error", () => resolve({ meta: null, firstPrompt: "(unreadable)", count: 0, updatedAt: "" }));
  });
}

function* walkDir(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkDir(full);
    else if (entry.isFile() && entry.name.endsWith(".jsonl")) yield full;
  }
}

export async function GET() {
  try {
    const sessionsDir = path.join(os.homedir(), ".codex", "sessions");
    if (!fs.existsSync(sessionsDir)) {
      return NextResponse.json({ sessions: [] });
    }

    const allFiles: Array<{ path: string; mtime: number }> = [];
    for (const filePath of walkDir(sessionsDir)) {
      try {
        const stat = fs.statSync(filePath);
        allFiles.push({ path: filePath, mtime: stat.mtimeMs });
      } catch {}
    }

    allFiles.sort((a, b) => b.mtime - a.mtime);
    const recentFiles = allFiles.slice(0, 20);

    const sessions: CodexSessionSummary[] = [];

    for (const { path: filePath, mtime } of recentFiles) {
      try {
        const { meta, firstPrompt, count, updatedAt } = await parseCodexSession(filePath);
        sessions.push({
          sessionId: meta?.id ?? path.basename(filePath, ".jsonl"),
          cwd: meta?.cwd ?? "",
          firstPrompt,
          startedAt: meta?.ts ?? new Date(mtime).toISOString(),
          updatedAt: updatedAt || new Date(mtime).toISOString(),
          messageCount: count,
        });
      } catch {}
    }

    sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({ sessions: sessions.slice(0, 20) });
  } catch (err) {
    return NextResponse.json({ sessions: [], error: String(err) });
  }
}
