import { supabase } from "@lib/supabaseClient";

type updateProps = {
  username: string,
  firstName: string,
  middleName: string,
  lastName: string,
  aboutMe: string
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

async function updateUser(userId: string, {username, firstName, middleName, lastName, aboutMe}: updateProps) {
  const { error } = await supabase.from('users')
    .update({
      username,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      about_me: aboutMe
    })
    .eq('user_id', userId);

  if (error) {
    console.error("Could not update user's profile information: ", error);
    return false;
  }

  return true;
}

async function deleteUser(userId: string) {
  const deleteResult = await supabase.from("users")
    .update({ deleted: true })
    .eq('user_id', userId);
    
  if (deleteResult.error) {
    console.log("Error deleting account: ", deleteResult.error);
    return false;
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
  const { error } = await supabase.from('users')
    .update({ theme_id: themeId })
    .eq('user_id', userId);

  if (error) {
    console.error("Error setting theme: ", error);
    return false;
  }

  return true;
}

export default { getUser, updateUser, deleteUser, getUserTheme, setUserTheme };