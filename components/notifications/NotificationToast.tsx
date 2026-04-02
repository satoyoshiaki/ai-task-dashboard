"use client";

import { X } from "lucide-react";
import { AppNotification, notificationStore } from "@/stores/notificationStore";

export const NotificationToast = ({ item }: { item: AppNotification }) => (
  <div className="glass-card w-full rounded-2xl p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold">{item.title}</p>
        <p className="mt-1 text-sm text-zinc-400">{item.detail}</p>
      </div>
      <button onClick={() => notificationStore.dismiss(item.id)} className="text-zinc-500 transition hover:text-zinc-200">
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);
