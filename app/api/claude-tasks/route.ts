import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import readline from "readline";

interface ClaudeMessage {
  type: string;
  message?: { role: string; content: string | Array<{ type: string; text?: string }> };
  timestamp?: string;
  uuid?: string;
}

interface SessionSummary {
  sessionId: string;
  projectDir: string;
  firstUserMessage: string;
  startedAt: string;
  updatedAt: string;
  messageCount: number;
}

async function readFirstUserMessage(filePath: string): Promise<{ first: string; count: number; updatedAt: string }> {
  return new Promise((resolve) => {
    let first = "";
    let count = 0;
    let updatedAt = "";
    const rl = readline.createInterface({ input: fs.createReadStream(filePath), crlfDelay: Infinity });
    rl.on("line", (line) => {
      try {
        const entry: ClaudeMessage = JSON.parse(line);
        if (entry.timestamp) updatedAt = entry.timestamp;
        if (entry.type === "user" && entry.message?.role === "user") {
          count++;
          if (!first) {
            const content = entry.message.content;
            if (typeof content === "string") {
              first = content.slice(0, 120);
            } else if (Array.isArray(content)) {
              const text = content.find((c) => c.type === "text")?.text ?? "";
              first = text.slice(0, 120);
            }
          }
        }
      } catch {}
    });
    rl.on("close", () => resolve({ first: first || "(no message)", count, updatedAt }));
    rl.on("error", () => resolve({ first: "(unreadable)", count: 0, updatedAt: "" }));
  });
}

export async function GET() {
  try {
    const claudeDir = path.join(os.homedir(), ".claude", "projects");
    if (!fs.existsSync(claudeDir)) {
      return NextResponse.json({ sessions: [] });
    }

    const projectDirs = fs.readdirSync(claudeDir).filter((name) => {
      const full = path.join(claudeDir, name);
      return fs.statSync(full).isDirectory();
    });

    const sessions: SessionSummary[] = [];

    for (const projectDir of projectDirs) {
      const projectPath = path.join(claudeDir, projectDir);
      const jsonlFiles = fs.readdirSync(projectPath)
        .filter((f) => f.endsWith(".jsonl"))
        .map((f) => ({ name: f, full: path.join(projectPath, f) }))
        .sort((a, b) => fs.statSync(b.full).mtimeMs - fs.statSync(a.full).mtimeMs)
        .slice(0, 5); // latest 5 sessions per project

      for (const { name, full } of jsonlFiles) {
        try {
          const stat = fs.statSync(full);
          const { first, count, updatedAt } = await readFirstUserMessage(full);
          const sessionId = name.replace(".jsonl", "");
          sessions.push({
            sessionId,
            projectDir,
            firstUserMessage: first,
            startedAt: new Date(stat.birthtimeMs > 0 ? stat.birthtimeMs : stat.ctimeMs).toISOString(),
            updatedAt: updatedAt || new Date(stat.mtimeMs).toISOString(),
            messageCount: count,
          });
        } catch {}
      }
    }

    sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({ sessions: sessions.slice(0, 30) });
  } catch (err) {
    return NextResponse.json({ sessions: [], error: String(err) });
  }
}
