import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import type { Notification } from "@models/tables";
import { toast } from "@lib/toast";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import notifDB from "@lib/db/notifications";

type NotifContextType = {
  notifications: Notification[];
  unread: boolean;
  updateRead: ({ notifId, read }: UpdateReadArgs) => void;
  markAllRead: () => void;
}

type UpdateReadArgs = {
  notifId: string;
  read: boolean;
}

const NotifContext = createContext<NotifContextType | undefined>(undefined);

export const NotifProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const unread = useMemo(() => {
    return notifications.some((notif) => !notif.read);
  }, [notifications])

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      const notifications = await notifDB.getNotifications();
      setNotifications(notifications);
    };

    loadNotifications();

    const notifChannel = supabase
      .channel('user_notifications')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => handleNotifChange(payload)
      )
    .subscribe();

    return () => {
      supabase.removeChannel(notifChannel);
    }
  }, [user]);

  const handleNotifChange = (payload: RealtimePostgresChangesPayload<{
    [key: string]: any;
  }>) => {
    let newList = [];

    setNotifications((prev) => {
      switch (payload.eventType) {
        case 'INSERT':
          newList = [payload.new as Notification, ...prev];
          break;
        case 'UPDATE':
          newList = [payload.new as Notification, ...prev.filter(n => n.id !== payload.new.id)];
          break;
        case 'DELETE':
          newList = prev.filter(n => n.id !== payload.old.id);
          break;
        default:
          newList = prev
      }

      newList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return newList;
    })

    if (payload.eventType === "INSERT") {
      switch ((payload.new as Notification).type) {
        case 'achievement_unlocked':
          toast.achievement(payload.new.title, payload.new.description);
          break;
        default:
          toast.notification(payload.new.title, payload.new.description);
          break;
      }
    };
  }

  const updateRead = async ({ notifId, read }: UpdateReadArgs) => {
    const success = await notifDB.updateReadStatus(notifId, read);
    if (!success) {
      toast.error("There was an error, please try again later.");
    }
  }

  const markAllRead = async () => {
    const success = notifDB.markAllAsRead();
    if (!success) {
      toast.error("There was an error, please try again later.");
    } else {
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    } 
  }

  return (
    <NotifContext.Provider value={{ notifications, unread, updateRead, markAllRead }}>
      {children}
    </NotifContext.Provider>
  );
}

export const useNotif = () => {
  const context = useContext(NotifContext);
  if (!context) {
    throw new Error('useNotif must be used within NotifProvider');
  }
  return context;
}