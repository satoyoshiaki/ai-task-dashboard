# AI Task Dashboard

Dark-mode Next.js dashboard for monitoring Claude Code and Codex task usage, queue health, demo scenarios, and mascot reactions.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Local shadcn-style UI primitives
- date-fns
- Lucide icons
- Custom persisted stores and polling layer

## Run

```bash
cd /home/sato-fox/codex/ai-task-dashboard
npm run dev
```

The project is nested inside `/home/sato-fox/codex`, so the npm scripts intentionally call the parent workspace `next` binary.

## Pages

- `/` dashboard overview
- `/tasks` task board with filters and quick-view modal
- `/tasks/[id]` task detail
- `/settings` dashboard settings

## Demo Scenarios

Use the top demo bar to swap between:

- Normal Operation
- High Load
- Limit Reached
- Error Storm
- Quiet Night
- All Complete Party

Each scenario overrides system state, task statuses, and usage pressure.

## Data Adapters

Adapter registration lives in [lib/adapters/index.ts](/home/sato-fox/codex/ai-task-dashboard/lib/adapters/index.ts).

- `mockAdapter` provides realistic delayed data.
- `claudeCodeAdapter` and `codexAdapter` attempt local file reads first and fall back to mock data.
- To swap to a real source, replace the placeholder file-read logic in the provider adapter and keep the `IDataAdapter` contract stable.

## Persistence

Settings persist in localStorage through the custom store in [stores/settingsStore.ts](/home/sato-fox/codex/ai-task-dashboard/stores/settingsStore.ts).

Persisted fields:

- data source
- polling interval
- timezone
- theme
- animations toggle
- notifications toggle
- demo scenario

## Notes

- Mock data lives in [lib/mock/mockData.ts](/home/sato-fox/codex/ai-task-dashboard/lib/mock/mockData.ts).
- Demo scenario overrides live in [lib/mock/demoScenarios.ts](/home/sato-fox/codex/ai-task-dashboard/lib/mock/demoScenarios.ts).
- Polling is driven by [lib/hooks/useDataPolling.ts](/home/sato-fox/codex/ai-task-dashboard/lib/hooks/useDataPolling.ts).
- The mascot SVG and state mapping live in [components/character/CharacterDisplay.tsx](/home/sato-fox/codex/ai-task-dashboard/components/character/CharacterDisplay.tsx) and [components/character/CharacterContext.tsx](/home/sato-fox/codex/ai-task-dashboard/components/character/CharacterContext.tsx).

## Verification

Run:

```bash
npm run build
```

If you want live provider data, add local adapter inputs under `ai-task-dashboard/data/` and update the provider adapters to parse those files or local APIs.
