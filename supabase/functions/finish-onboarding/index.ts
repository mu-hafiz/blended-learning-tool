import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const { userId } = await req.json() as { userId: string };

    console.log(`User ID: ${userId}`)

    // Update 'app_metadata'
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { app_metadata: { onboardingCompleted: 'true' } }
    )

    if (error) {
      return jsonResponse({ error: error?.message || "Failed to update app_metadata" }, 500);
    }
  
    return jsonResponse({ success: true }, 200);

  } catch (error) {
    console.log(error);
    return jsonResponse({ error: error?.message || "Something went wrong, please try again later" }, 500);
  }
});