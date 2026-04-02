"use client";

import { NotificationToast } from "@/components/notifications/NotificationToast";
import { useNotificationStore } from "@/stores/notificationStore";

export const NotificationCenter = () => {
  const items = useNotificationStore((state) => state.items);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-3">
      {items.map((item) => (
        <NotificationToast key={item.id} item={item} />
      ))}
    </div>
  );
};
