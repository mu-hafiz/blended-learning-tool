import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@lib/supabaseClient";
import { useAuth } from "./AuthProvider";
import type { Notification } from "@models/tables";
import { toast } from "sonner";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

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
    let newList = [];

    setNotifications((prev) => {
      switch (payload.eventType) {
        case 'INSERT': {
          newList = [payload.new as Notification, ...prev];
          break;
        }
        case 'UPDATE': {
          newList = [payload.new as Notification, ...prev.filter(n => n.id !== payload.new.id)];
          break;
        }
        case 'DELETE': {
          newList = prev.filter(n => n.id !== payload.old.id);
          break;
        }
        default: {
          newList = prev
        }
      }

      newList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return newList;
    })

    if (payload.eventType === "INSERT") {
      toast.info("You have a new notification!");
    };
  }

  const updateRead = async ({ notifId, read }: UpdateReadArgs) => {
    const { error } = await supabase.from('notifications')
      .update({ read })
      .eq('id', notifId);
    
    if (error) {
      console.log("Error marking notification as read: ", error);
      toast.error("There was an error, please try again later.");
    }
  }

  const markAllRead = async () => {
    const { error } = await supabase.from('notifications')
      .update({ read: true })
      .eq('read', false);
    
    if (error) {
      console.log("Error marking all notifications as read: ", error);
      toast.error("There was an error, please try again later.");
    }

    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
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