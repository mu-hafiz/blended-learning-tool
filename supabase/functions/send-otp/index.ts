import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { createClient } from 'npm:@supabase/supabase-js@2'
import { Resend } from "npm:resend";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const otpLength = 6;

const resend = new Resend(RESEND_API_KEY);

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = performance.now();
  console.log(`[${new Date().toISOString()}] Request received`);

  const { email } = await req.json();

  let code = "";
  for (let i = 0; i < otpLength; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  };

  try {
    const sendEmailStart = performance.now();
    const { error } = await resend.emails.send({
      from: "Blended Learning Tool <support@blendedlearningtool.app>",
      to: email,
      subject: "Your Blended Learning Tool verification code",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2>Hello,</h2>
          <p>Your verification code is:</p>
          <p style="font-size: 1.5em; font-weight: bold; color: #0051ff;">${code}</p>
          <p>This code expires in 10 minutes. If you did not request this, feel free to ignore this message.</p>
          <hr />
          <p style="font-size: 0.9em; color: #888;">
            Sent by Blended Learning Tool • blendedlearningtool.app
          </p>
        </div>
      `,
      text: `Hello,\n\nYour verification code is: ${code}\nIt expires in 10 minutes. If you did not request this, feel free to ignore this message.\n\nSent by Blended Learning Tool • blendedlearningtool.app`,
    });
    
    
    const sendEmailEnd = performance.now();
    console.log(`[${new Date().toISOString()}] Email send attempted (${(sendEmailEnd - sendEmailStart).toFixed(2)}ms)`);

    if (error) {
      console.log("Error sending email: ", error);
      return jsonResponse({ error: "Could not send OTP, please try again later" }, 400);
    }

    const dbInsertStart = performance.now();
    const fiveMinutes = new Date(Date.now() + 5 * 60 * 1000);
    const { error: dbError } = await supabaseAdmin.from('otp')
      .upsert({ email, code, delete_at: fiveMinutes });
    const dbInsertEnd = performance.now();
    console.log(`[${new Date().toISOString()}] OTP inserted into DB (${(dbInsertEnd - dbInsertStart).toFixed(2)}ms)`);

    if (dbError) {
      console.log("Error inserting OTP: ", dbError.message);
      return jsonResponse({ error: "Something went wrong, please try again later" }, 500);
    }

    const endTime = performance.now();
    console.log(`[${new Date().toISOString()}] Success response sent (${(endTime - startTime).toFixed(2)}ms total)`);
    return jsonResponse({ success: true }, 200);

  } catch (error) {
    console.log(error);
    return jsonResponse({ error: "Something went wrong, please try again later" }, 500);
  }
});