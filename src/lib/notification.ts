import { supabase } from "./supabaseClient";
import type { NotificationType } from "@models/enums";

type Notification = {
  user_id: string,
  title: string,
  description: string,
  type: NotificationType
}

export const createNotifications = async (notifications: Notification[]) => {
  const { error: notifError } = await supabase.from('notifications')
    .insert(notifications)
    .select();
  
  if (notifError) throw new Error(notifError.message || JSON.stringify(notifError));
};