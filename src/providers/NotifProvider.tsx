import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import type { Notification } from "@models/tables";
import { toast } from "sonner";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type NotifContextType = {
  notifications: Notification[];
  unread: boolean;
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
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Could not load notifications: ', error);
        throw new Error('Could not load notifications: ', error);
      }
      
      setNotifications(data);
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
    switch (payload.eventType) {
      case 'INSERT': {
        setNotifications((prev) => [payload.new as Notification, ...prev]);
        toast.info("You have a new notification!");
        break;
      }
      case 'UPDATE': {
        setNotifications((prev) => {
          const notifsWithoutOld = prev.filter((notif) => notif.id !== payload.new.id);
          return [payload.new as Notification, ...notifsWithoutOld]
        });
        break;
      }
      case 'DELETE': {
        setNotifications((prev) => prev.filter((notif) => notif.id !== payload.old.id));
        break;
      }
    }
  }

  return (
    <NotifContext.Provider value={{ notifications, unread }}>
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