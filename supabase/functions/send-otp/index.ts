import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { createClient } from 'npm:@supabase/supabase-js@2'
import { Resend } from "npm:resend";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const otpLength = 6;

const resend = new Resend(RESEND_API_KEY);

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? Deno.env.get('LOCAL_SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('LOCAL_SUPABASE_SERVICE_ROLE_KEY') ?? ''
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
      from: "ReviXion <otp@blendedlearningtool.app>",
      to: email,
      subject: "Your ReviXion verification code",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Verification Code</title>
          </head>
          <body style="margin:0; padding:0; background-color:#f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" style="padding:24px;">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:480px; background:#ffffff; border-radius:6px;">
                    <tr>
                      <td style="padding:24px; font-family:Arial, Helvetica, sans-serif; color:#333; line-height:1.5;">
                        <h2 style="margin-top:0;">Hello,</h2>

                        <p>Your verification code is:</p>

                        <p style="font-size:24px; font-weight:bold; color:#0051ff; margin:16px 0;">
                          ${code}
                        </p>

                        <p>
                          This code expires in 10 minutes.
                          If you did not request this, you can safely ignore this email.
                        </p>

                        <hr style="border:none; border-top:1px solid #e0e0e0; margin:24px 0;" />

                        <p style="font-size:12px; color:#888;">
                          Sent by ReviXion<br />
                          blendedlearningtool.app
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      text: `Hello,\n\nYour verification code is: ${code}\nIt expires in 10 minutes. If you did not request this, feel free to ignore this message.\n\nSent by ReviXion • blendedlearningtool.app`,
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