"use client";

import { useSettingsStore } from "@/stores/settingsStore";
import { CharacterState, GlobalStatus, Locale, Mode, TaskStatus, UsageStatus } from "@/lib/types";

const translations = {
  ja: {
    "nav.dashboard": "ダッシュボード",
    "nav.tasks": "タスク",
    "nav.settings": "設定",
    "dashboard.title": "タスクダッシュボード",
    "dashboard.subtitle": "Claude Code + Codex を一画面で監視",
    "system.busy": "高負荷",
    "system.healthy": "正常",
    "system.idle": "アイドル",
    "system.warning": "警告",
    "system.critical": "重大",
    "dashboard.lastSync": "最終同期",
    "dashboard.mode": "モード",
    "dashboard.modeMock": "モック",
    "dashboard.modeLive": "ライブ",
    "dashboard.modeDemo": "デモ",
    "dashboard.lightTheme": "ライトテーマ",
    "dashboard.darkTheme": "ダークテーマ",
    "dashboard.liveMonitor": "ライブモニター",
    "dashboard.aiOps": "AI運用",
    "mascot.status": "マスコット状態",
    "mascot.working": "作業中",
    "mascot.idle": "待機中",
    "mascot.completed": "完了",
    "mascot.warning": "警告",
    "mascot.limitReached": "制限到達",
    "mascot.error": "エラー",
    "mascot.description": "キャラクターがシステム状態を表現します。",
    "usage.title": "使用状況",
    "usage.normal": "正常",
    "usage.warning": "警告",
    "usage.limitReached": "制限到達",
    "usage.session": "セッション",
    "usage.period": "期間",
    "usage.nextReset": "次回リセット:",
    "usage.left": "残り",
    "system.overview": "システム概要",
    "system.clusterStatus": "クラスター状態:",
    "task.running": "実行中",
    "task.queued": "待機中",
    "task.blocked": "制限中",
    "task.error": "エラー",
    "task.completed": "完了",
    "activity.title": "最近のアクティビティ",
    "tasks.title": "タスクボード",
    "tasks.subtitle": "実行中・待機中のタスク",
    "tasks.filterPlaceholder": "タスク状態でフィルタ、IDや名前で検索...",
    "tasks.searchPlaceholder": "タスクIDまたはタイトルで検索",
    "tasks.sortUpdated": "更新順",
    "tasks.sortStarted": "開始順",
    "tasks.sortProgress": "進捗順",
    "tasks.quickView": "クイックビュー",
    "tasks.progress": "進捗",
    "tasks.updated": "更新",
    "tasks.started": "開始",
    "tasks.resumable": "再開可能",
    "tasks.blockedReason": "停止理由:",
    "tasks.errorLabel": "エラー:",
    "tasks.notFound": "タスクが見つかりません",
    "taskDetail.back": "タスク一覧に戻る",
    "taskDetail.title": "タスク詳細",
    "taskDetail.timeline": "ステータス履歴",
    "taskDetail.logs": "ログ",
    "taskDetail.usageImpact": "使用量",
    "taskDetail.estimatedRemaining": "推定残り時間",
    "taskDetail.started": "開始時刻",
    "taskDetail.lastUpdated": "最終更新",
    "settings.title": "設定",
    "settings.subtitle": "ダッシュボード設定",
    "settings.dataSource": "データソース",
    "settings.pollingInterval": "ポーリング間隔",
    "settings.timezone": "タイムゾーン",
    "settings.theme": "テーマ",
    "settings.themeDark": "ダーク",
    "settings.themeLight": "ライト",
    "settings.animations": "アニメーション",
    "settings.notifications": "通知",
    "settings.futureIntegrations": "将来の連携",
    "settings.webhooksDisabled": "ライブモードが有効になると利用できます。",
    "settings.language": "言語",
    "demo.mode": "デモモード",
    "demo.normalOperation": "通常稼働",
    "demo.highLoad": "高負荷",
    "demo.limitReached": "制限到達",
    "demo.errorStorm": "エラー多発",
    "demo.quietNight": "深夜静穏",
    "demo.allComplete": "全完了祝い",
    "toast.taskComplete": "タスク完了:",
    "toast.taskCompleteMsg": "タスクが正常に完了しました。",
    "toast.taskFailed": "タスク失敗:",
    "toast.usageLimitReached": "使用量上限到達",
    "toast.usageLimitReachedMsg": "いずれかのプロバイダーがセッション上限に達しました。制限中のタスクを確認してください。",
    "toast.unexpectedTaskFailure": "予期しないタスク失敗",
    "common.preferences": "設定",
    "common.close": "閉じる",
    "common.openDetail": "詳細を開く",
    "common.waitingFirstPoll": "最初のポーリングを待機中",
    "common.noRetries": "再試行履歴はありません。",
    "common.yes": "はい",
    "common.no": "いいえ",
    "common.none": "なし",
    "common.all": "すべて",
    "common.paused": "一時停止",
    "common.unknown": "不明",
    "common.byIdOrName": "IDや名前で検索",
    "taskDetail.retryHistory": "再試行履歴",
    "taskDetail.taskQueued": "タスクが待機列に追加されました",
    "taskDetail.taskStarted": "タスクが開始されました",
    "taskDetail.currentState": "現在の状態: {{status}}",
    "taskDetail.taskCompleted": "タスクが完了しました",
    "taskDetail.status": "状態",
    "taskDetail.notFoundDescription": "次回のポーリングを待つか、タスクボードに戻ってください。",
    "settings.dataSourceMock": "モック",
    "settings.dataSourceClaudeCode": "Claude Code",
    "settings.dataSourceCodex": "Codex",
    "settings.dataSourceCombined": "統合",
    "settings.discordWebhook": "Discord Webhook URL",
    "settings.slackWebhook": "Slack Webhook URL",
    "header.limitBanner": "いずれかのプロバイダーが上限に達しました。使用カードでリセット時刻を確認でき、制限中タスクが強調表示されます。",
    "dashboard.mascotTitle": "マスコット状態",
    "taskDetail.mascotTitle": "タスクマスコット",
    "tasks.openQuickDetail": "ボードを離れずにクイック詳細を開けます。",
    "dashboard.usageTrend": "使用量の推移",
    "dashboard.usageTrendSubtitle": "直近1時間のセッション変動",
    "tasks.sortUsage": "使用量順",
    "System Resources": "システムリソース",
    "CPU Usage": "CPU使用率",
    "Memory Usage": "メモリ使用率",
    "Storage Usage": "ストレージ使用率",
    "Uptime": "稼働時間",
    "Load Average": "ロードアベレージ",
    "cores": "コア",
    "days": "日",
    "hours": "時間",
    "minutes": "分"
  },
  en: {
    "nav.dashboard": "Dashboard",
    "nav.tasks": "Tasks",
    "nav.settings": "Settings",
    "dashboard.title": "Task Dashboard",
    "dashboard.subtitle": "Claude Code + Codex monitoring in one place.",
    "system.busy": "System busy",
    "system.healthy": "healthy",
    "system.idle": "idle",
    "system.warning": "warning",
    "system.critical": "critical",
    "dashboard.lastSync": "Last sync",
    "dashboard.mode": "Mode",
    "dashboard.modeMock": "mock",
    "dashboard.modeLive": "live",
    "dashboard.modeDemo": "demo",
    "dashboard.lightTheme": "Light theme",
    "dashboard.darkTheme": "Dark theme",
    "dashboard.liveMonitor": "Live Monitor",
    "dashboard.aiOps": "AI Ops",
    "mascot.status": "MASCOT STATUS",
    "mascot.working": "Working",
    "mascot.idle": "Idle",
    "mascot.completed": "Completed",
    "mascot.warning": "Warning",
    "mascot.limitReached": "Limit Reached",
    "mascot.error": "Error",
    "mascot.description": "Corner companion mirrors the overall system mood.",
    "usage.title": "Usage Window",
    "usage.normal": "Normal",
    "usage.warning": "Warning",
    "usage.limitReached": "Limit Reached",
    "usage.session": "Session",
    "usage.period": "Period",
    "usage.nextReset": "Next reset:",
    "usage.left": "left",
    "system.overview": "SYSTEM OVERVIEW",
    "system.clusterStatus": "Cluster status:",
    "task.running": "Running",
    "task.queued": "Queued",
    "task.blocked": "Blocked",
    "task.error": "Error",
    "task.completed": "Completed",
    "activity.title": "RECENT ACTIVITY",
    "tasks.title": "TASK BOARD",
    "tasks.subtitle": "Queued and running work",
    "tasks.filterPlaceholder": "Filter by task state, search by id...",
    "tasks.searchPlaceholder": "Search by task id or title",
    "tasks.sortUpdated": "Sort by updated",
    "tasks.sortStarted": "Sort by started",
    "tasks.sortProgress": "Sort by progress",
    "tasks.quickView": "Quick view",
    "tasks.progress": "Progress",
    "tasks.updated": "Updated",
    "tasks.started": "Started",
    "tasks.resumable": "Resumable",
    "tasks.blockedReason": "Blocked reason:",
    "tasks.errorLabel": "Error:",
    "tasks.notFound": "No tasks found",
    "taskDetail.back": "Back to tasks",
    "taskDetail.title": "Task Detail",
    "taskDetail.timeline": "Status Timeline",
    "taskDetail.logs": "Logs",
    "taskDetail.usageImpact": "Usage Impact",
    "taskDetail.estimatedRemaining": "Estimated remaining",
    "taskDetail.started": "Started",
    "taskDetail.lastUpdated": "Last updated",
    "settings.title": "PREFERENCES",
    "settings.subtitle": "Dashboard settings",
    "settings.dataSource": "Data source",
    "settings.pollingInterval": "Polling interval",
    "settings.timezone": "Timezone",
    "settings.theme": "Theme",
    "settings.themeDark": "dark",
    "settings.themeLight": "light",
    "settings.animations": "Animations",
    "settings.notifications": "Notifications",
    "settings.futureIntegrations": "FUTURE INTEGRATIONS",
    "settings.webhooksDisabled": "Webhooks are disabled until live mode is active.",
    "settings.language": "Language",
    "demo.mode": "DEMO MODE",
    "demo.normalOperation": "Normal Operation",
    "demo.highLoad": "High Load",
    "demo.limitReached": "Limit Reached",
    "demo.errorStorm": "Error Storm",
    "demo.quietNight": "Quiet Night",
    "demo.allComplete": "All Complete Party",
    "toast.taskComplete": "Task complete:",
    "toast.taskCompleteMsg": "The task finished successfully.",
    "toast.taskFailed": "Task failed:",
    "toast.usageLimitReached": "Usage limit reached",
    "toast.usageLimitReachedMsg": "One provider hit its session cap. Review the blocked tasks.",
    "toast.unexpectedTaskFailure": "Unexpected task failure",
    "common.preferences": "Preferences",
    "common.close": "Close",
    "common.openDetail": "Open detail",
    "common.waitingFirstPoll": "Waiting for first poll",
    "common.noRetries": "No retries recorded.",
    "common.yes": "Yes",
    "common.no": "No",
    "common.none": "None",
    "common.all": "All",
    "common.paused": "Paused",
    "common.unknown": "Unknown",
    "common.byIdOrName": "search by id or name",
    "taskDetail.retryHistory": "Retry history",
    "taskDetail.taskQueued": "Task queued",
    "taskDetail.taskStarted": "Task started",
    "taskDetail.currentState": "Current state: {{status}}",
    "taskDetail.taskCompleted": "Task completed",
    "taskDetail.status": "Status",
    "taskDetail.notFoundDescription": "Wait for the next poll or return to the task board.",
    "settings.dataSourceMock": "Mock",
    "settings.dataSourceClaudeCode": "Claude Code",
    "settings.dataSourceCodex": "Codex",
    "settings.dataSourceCombined": "Combined",
    "settings.discordWebhook": "Discord webhook URL",
    "settings.slackWebhook": "Slack webhook URL",
    "header.limitBanner": "A provider has reached its limit. Reset countdowns are shown on usage cards and blocked tasks are highlighted.",
    "dashboard.mascotTitle": "Mascot Status",
    "taskDetail.mascotTitle": "Task Mascot",
    "tasks.openQuickDetail": "Open quick detail views without leaving the board.",
    "dashboard.usageTrend": "Usage Trend",
    "dashboard.usageTrendSubtitle": "Session drift over the last hour",
    "tasks.sortUsage": "Sort by usage",
    "System Resources": "System Resources",
    "CPU Usage": "CPU Usage",
    "Memory Usage": "Memory Usage",
    "Storage Usage": "Storage Usage",
    "Uptime": "Uptime",
    "Load Average": "Load Average",
    "cores": "cores",
    "days": "days",
    "hours": "hours",
    "minutes": "minutes"
  }
} as const;

export type TranslationKey = keyof (typeof translations)["ja"];

type TranslationValues = Record<string, string | number>;

const interpolate = (message: string, values?: TranslationValues) => {
  if (!values) {
    return message;
  }

  return message.replace(/\{\{(\w+)\}\}/g, (_, key: string) => String(values[key] ?? ""));
};

export const localeLabels: Record<Locale, string> = {
  ja: "JA",
  en: "EN"
};

export const getIntlLocale = (locale: Locale) => (locale === "ja" ? "ja-JP" : "en-US");

export const translate = (locale: Locale, key: TranslationKey, values?: TranslationValues) =>
  interpolate(translations[locale][key], values);

export const getModeLabel = (locale: Locale, mode: Mode) =>
  translate(locale, mode === "mock" ? "dashboard.modeMock" : mode === "live" ? "dashboard.modeLive" : "dashboard.modeDemo");

export const getGlobalStatusLabel = (locale: Locale, status: GlobalStatus) =>
  translate(locale, `system.${status}` as TranslationKey);

export const getTaskStatusLabel = (locale: Locale, status: TaskStatus | "paused") => {
  if (status === "paused") {
    return translate(locale, "common.paused");
  }

  return translate(locale, `task.${status}` as TranslationKey);
};

export const getUsageStatusLabel = (locale: Locale, status: UsageStatus) => {
  if (status === "unknown") {
    return translate(locale, "common.unknown");
  }

  return translate(locale, `usage.${status === "limit-reached" ? "limitReached" : status}` as TranslationKey);
};

export const getCharacterStateLabel = (locale: Locale, state: CharacterState) =>
  translate(
    locale,
    state === "limit-reached" ? "mascot.limitReached" : (`mascot.${state}` as TranslationKey)
  );

export const getDemoScenarioLabel = (locale: Locale, scenarioId: string) => {
  const keyMap: Record<string, TranslationKey> = {
    "normal-operation": "demo.normalOperation",
    "high-load": "demo.highLoad",
    "limit-reached": "demo.limitReached",
    "error-storm": "demo.errorStorm",
    "quiet-night": "demo.quietNight",
    "all-complete-party": "demo.allComplete"
  };

  return translate(locale, keyMap[scenarioId] ?? "demo.normalOperation");
};

export const useT = () => {
  const locale = useSettingsStore((state) => state.locale);

  return <K extends TranslationKey>(key: K, values?: TranslationValues) => translate(locale, key, values);
};
