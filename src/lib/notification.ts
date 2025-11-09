import { supabase } from "./supabaseClient";
import type { NotificationType } from "@models/enums";

type Notification = {
  userId: string,
  title: string,
  description: string,
  type: NotificationType
}

export const createNotification = async ({userId, title, description, type}: Notification) => {
  const { error: notifError } = await supabase.from('notifications')
    .insert([
      { user_id: userId, title, description, type },
    ])
    .select();
  
  if (notifError) throw new Error(notifError.message || JSON.stringify(notifError));
};