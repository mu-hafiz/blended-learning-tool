import { supabase } from "@lib/supabaseClient";
import type { NotificationType } from "@models/enums";

type Notification = {
  user_id: string,
  title: string,
  description: string,
  type: NotificationType
}

async function createNotifications(notifications: Notification[]) {
  const { error } = await supabase.from('notifications')
    .insert(notifications)
    .select();

  if (error) {
    console.error(error.message || JSON.stringify(error));
    throw new Error(error.message || JSON.stringify(error));
  };
}

async function getNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Could not load notifications: ', error);
    throw new Error('Could not load notifications: ', error);
  }

  return data;
};

async function updateReadStatus(notifId: string, read: boolean) {
  const { error } = await supabase.from('notifications')
    .update({ read })
    .eq('id', notifId);
  
  if (error) {
    console.log("Error marking notification as read: ", error);
    return false;
  }

  return true;
}

async function markAllAsRead() {
  const { error } = await supabase.from('notifications')
    .update({ read: true })
    .eq('read', false);
  
  if (error) {
    console.log("Error marking all notifications as read: ", error);
    return false;
  }

  return true;
}

export default { createNotifications, getNotifications, updateReadStatus, markAllAsRead };