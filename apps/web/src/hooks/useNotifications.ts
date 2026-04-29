import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
  link?: string | null;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("id, user_id, title, body, is_read, created_at, link")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        // Gracefully handle missing table (feature not yet deployed)
        console.warn("[Notifications] Could not fetch notifications:", error.message);
        return;
      }
      setNotifications((data ?? []) as Notification[]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  // Realtime subscription for new notifications
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          void fetchNotifications();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user?.id, fetchNotifications]);

  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .eq("user_id", user?.id ?? "");
      if (error) {
        console.warn("[Notifications] markAsRead failed:", error.message);
        void fetchNotifications();
      }
    },
    [user?.id, fetchNotifications],
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user?.id ?? "")
      .eq("is_read", false);
    if (error) {
      console.warn("[Notifications] markAllAsRead failed:", error.message);
      void fetchNotifications();
    }
  }, [user?.id, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}
