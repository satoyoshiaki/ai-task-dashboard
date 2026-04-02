"use client";

import { Card } from "@/components/ui/card";
import { settingsStore, useSettingsStore } from "@/stores/settingsStore";

const timezones = ["Asia/Tokyo", "UTC", "America/Los_Angeles", "America/New_York", "Europe/London"];

export default function SettingsPage() {
  const settings = useSettingsStore((state) => state);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Preferences</p>
        <h1 className="mt-2 text-3xl font-semibold">Dashboard settings</h1>
        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Data source</span>
            <select
              value={settings.dataSource}
              onChange={(event) => settingsStore.update({ dataSource: event.target.value as typeof settings.dataSource })}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm"
            >
              <option value="mock">Mock</option>
              <option value="claude-code">Claude Code</option>
              <option value="codex">Codex</option>
              <option value="combined">Combined</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Polling interval: {settings.pollingIntervalSec}s</span>
            <input type="range" min={5} max={60} step={5} value={settings.pollingIntervalSec} onChange={(event) => settingsStore.update({ pollingIntervalSec: Number(event.target.value) })} className="w-full" />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Timezone</span>
            <select value={settings.timezone} onChange={(event) => settingsStore.update({ timezone: event.target.value })} className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
              {timezones.map((zone) => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">
              Theme
              <button onClick={() => settingsStore.update({ theme: settings.theme === "dark" ? "light" : "dark" })}>{settings.theme}</button>
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">
              Animations
              <input type="checkbox" checked={settings.animationsEnabled} onChange={(event) => settingsStore.update({ animationsEnabled: event.target.checked })} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">
              Notifications
              <input type="checkbox" checked={settings.notificationsEnabled} onChange={(event) => settingsStore.update({ notificationsEnabled: event.target.checked })} />
            </label>
          </div>
        </div>
      </Card>
      <Card>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Future Integrations</p>
        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Discord webhook URL</span>
            <input
              value={settings.webhookDiscord}
              disabled
              onChange={(event) => settingsStore.update({ webhookDiscord: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-zinc-500"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">Slack webhook URL</span>
            <input
              value={settings.webhookSlack}
              disabled
              onChange={(event) => settingsStore.update({ webhookSlack: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-zinc-500"
            />
          </label>
          <p className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-4 text-sm text-zinc-400">
            Webhooks are future-ready fields. They stay disabled until live outbound notification hooks are wired.
          </p>
        </div>
      </Card>
    </div>
  );
}
