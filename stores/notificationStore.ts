"use client";

import { createStore } from "@/lib/utils/store";

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  tone: "info" | "success" | "warning" | "error";
  createdAt: Date;
}

interface NotificationState {
  items: AppNotification[];
}

const store = createStore<NotificationState>({ items: [] });

export const notificationStore = {
  ...store,
  push: (notification: Omit<AppNotification, "id" | "createdAt">) =>
    store.setState((state) => ({
      ...state,
      items: [
        {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          createdAt: new Date(),
          ...notification
        },
        ...state.items
      ].slice(0, 6)
    })),
  dismiss: (id: string) =>
    store.setState((state) => ({
      ...state,
      items: state.items.filter((item) => item.id !== id)
    }))
};

export const useNotificationStore = <T,>(selector: (state: NotificationState) => T) =>
  notificationStore.useStore(selector);
