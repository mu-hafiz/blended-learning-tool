import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { createClient } from 'npm:@supabase/supabase-js@2'

type UserPrivacySettings = {
    achievements: "public" | "friends_only" | "private";
    friends: "public" | "friends_only" | "private";
    leaderboards: "public" | "friends_only";
    level: "public" | "friends_only";
    name: "public" | "friends_only" | "private";
    profile: "public" | "friends_only";
}

type FinishOnboardingInfo = {
  username: string,
  firstName: string,
  middleName?: string,
  lastName: string,
  aboutMe?: string,
}

type Request = {
  userId: string,
  formValues: FinishOnboardingInfo,
  privacySettings: UserPrivacySettings
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? Deno.env.get('LOCAL_SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('LOCAL_SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const { userId, formValues, privacySettings } = await req.json() as Request;

    const { username, firstName, middleName, lastName, aboutMe } = formValues;
    const { error: userError } = await supabaseAdmin.from('users')
      .update({
        username,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        about_me: aboutMe,
        onboarding_completed: true
      })
      .eq('user_id', userId);

    if (userError) {
      return jsonResponse({ error: userError?.message || "Failed to update user" }, 500);
    }

    const { data: privacyData, error: privacyError } = await supabaseAdmin.from('user_privacy')
      .update(privacySettings)
      .eq('user_id', userId);

    if (privacyError) {
      return jsonResponse({ error: privacyError?.message || "Failed to update privacy settings" }, 500);
    }

    console.log("Privacy Data:");
    console.log(privacyData);

    const { error: metadataError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { app_metadata: { onboardingCompleted: 'true' } }
    )

    if (metadataError) {
      return jsonResponse({ error: metadataError?.message || "Failed to update app_metadata" }, 500);
    }
  
    return jsonResponse({ success: true }, 200);

  } catch (error) {
    console.log(error);
    return jsonResponse({ error: error?.message || "Something went wrong, please try again later" }, 500);
  }
});