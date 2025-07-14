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
    const { email, otp: userOTP } = await req.json();

    const { data, error } = await supabaseAdmin.from('otp')
      .select('code')
      .eq('email', email)
      .single();
    
    if (error) {
      const errorMessage = error.code === "PGRST116"
        ? "OTP has expired, please request a new one"
        : "Something went wrong, please try again later"
      console.log(errorMessage);
      return jsonResponse({ error: errorMessage }, 401);
    }
  
    const code = data.code;
    if (code !== userOTP.toUpperCase()) return jsonResponse({ error: "The provided OTP is incorrect" }, 401);
  
    return jsonResponse({ success: true }, 200);

  } catch (error) {
    console.log(error);
    return jsonResponse({ error: error?.message || "Something went wrong, please try again later" }, 500);
  }
});