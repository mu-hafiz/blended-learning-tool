import { supabase } from "@lib/supabaseClient";

type updateProps = {
  username: string,
  firstName: string,
  middleName?: string,
  lastName: string,
  aboutMe?: string,
  onboardingCompleted?: boolean,
}

async function getUser(userId: string) {
  const { data, error } = await supabase.from('users')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error("Could not get user's profile information: ", error);
    throw new Error("Could not get user's profile information: ", error);
  };

  return data;
}

async function getUserByUsername(username: string) {
  const { data, error } = await supabase.from('users')
    .select('*')
    .eq('username', username)
    .single();
  
  if (error) {
    console.error("Could not get user's profile information: ", error);
    throw new Error("Could not get user's profile information: ", error);
  };

  return data;
}

async function updateUser(userId: string, {username, firstName, middleName, lastName, aboutMe, onboardingCompleted = true}: updateProps) {
  const { error } = await supabase.from('users')
    .update({
      username,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      about_me: aboutMe,
      onboarding_completed: onboardingCompleted
    })
    .eq('user_id', userId);

  if (error) {
    console.error("Could not update user's profile information: ", error);
    throw new Error("Could not update user's profile information: ", error);
  }

  return true;
}

async function deleteUser(userId: string) {
  const deleteResult = await supabase.from("users")
    .update({ deleted: true })
    .eq('user_id', userId);
    
  if (deleteResult.error) {
    console.log("Error deleting account: ", deleteResult.error);
    throw new Error("Error deleting account: ", deleteResult.error);
  }

  return true;
}

async function getUserTheme(userId: string) {
  const { data, error } = await supabase.from('users')
    .select('theme_id(data_theme)')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.log("Error getting user's selected theme: ", error);
    throw new Error("Error getting user's selected theme: ", error);
  }

  return data.theme_id?.data_theme;
}

async function setUserTheme(userId: string, themeId: string) {
  const { error: themeError } = await supabase.from('users')
    .update({ theme_id: themeId })
    .eq('user_id', userId);

  if (themeError) {
    console.error("Error setting theme: ", themeError);
    throw new Error("Error setting theme: ", themeError);
  }

  const { error: usedError } = await supabase.from('unlocked_themes')
    .update({ used: true })
    .eq('user_id', userId)
    .eq('theme_id', themeId);

  if (usedError) {
    console.error("Error setting theme used status: ", usedError);
    throw new Error("Error setting theme used status: ", usedError);
  }

  return true;
}

async function checkUsername(username: string) {
  const { data, error } = await supabase.from('users')
    .select()
    .eq('username', username)
    .eq('deleted', false)
    .limit(1)

  if (error) {
    console.error("Error checking username uniqueness", error);
    throw new Error("Error checking username uniqueness", error); 
  }

  return data && data.length === 0
}

async function dailyCheckIn(userId: string) {
  const { error } = await supabase.from('users')
    .update({ daily_check_in: true })
    .eq('user_id', userId);

  if (error) {
    console.error("Error updating user's daily check in", error);
    throw new Error("Error updating user's daily check in", error); 
  }

  return true;
}

async function findUser(search: string) {
  const { data, error } = await supabase.from('users')
    .select('user_id, username, profile_picture')
    .ilike('username', `%${search}%`);
  
  if (error) {
    console.error("Error finding users", error);
    throw new Error("Error finding users", error); 
  }

  return data;
}

async function updateProfilePicture(userId: string, filePath: string) {
  const { error } = await supabase.from('users')
    .update({
      profile_picture: filePath,
      profile_picture_updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);
  
  if (error) {
    console.error("Error updating new profile picture", error);
    throw new Error("Error updating new profile picture", error); 
  }
}

export default {
  getUser,
  getUserByUsername,
  updateUser,
  deleteUser,
  getUserTheme,
  setUserTheme,
  checkUsername,
  dailyCheckIn,
  findUser,
  updateProfilePicture
};