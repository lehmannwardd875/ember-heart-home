import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  type?: 'welcome' | 'new_match' | 'new_message' | 'profile_makeover' | 'coach_reminder';
}

const getEmailTemplate = (type: string, content: { [key: string]: any }) => {
  const templates = {
    welcome: `
      <div style="font-family: 'Lora', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FAF3ED;">
        <h1 style="color: #B66E41; font-size: 32px; margin-bottom: 24px;">Welcome Home to Hearth</h1>
        <p style="color: #2C2A27; font-size: 18px; line-height: 1.6; margin-bottom: 16px;">
          Hello ${content.name},
        </p>
        <p style="color: #2C2A27; font-size: 18px; line-height: 1.6; margin-bottom: 16px;">
          You've taken the first step toward meaningful connection. We're honored to have you here.
        </p>
        <p style="color: #2C2A27; font-size: 18px; line-height: 1.6; margin-bottom: 24px;">
          At Hearth, we believe in slow, intentional connections. No swiping, no pressure — just real people ready for real love.
        </p>
        <a href="${content.loginUrl}" style="display: inline-block; background: #B66E41; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 18px; margin-bottom: 24px;">
          Complete Your Profile
        </a>
        <p style="color: #78856D; font-size: 14px; line-height: 1.6;">
          Welcome home,<br />
          The Hearth Team
        </p>
      </div>
    `,
    new_match: `
      <div style="font-family: 'Lora', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FAF3ED;">
        <h1 style="color: #B66E41; font-size: 32px; margin-bottom: 24px;">You Have a New Match</h1>
        <p style="color: #2C2A27; font-size: 18px; line-height: 1.6; margin-bottom: 16px;">
          Hello ${content.name},
        </p>
        <p style="color: #2C2A27; font-size: 18px; line-height: 1.6; margin-bottom: 16px;">
          Someone whose story resonates with yours is waiting to meet you.
        </p>
        <p style="color: #2C2A27; font-size: 18px; line-height: 1.6; margin-bottom: 24px;">
          Take your time. Read their profile. See if there's a spark.
        </p>
        <a href="${content.matchUrl}" style="display: inline-block; background: #B66E41; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 18px; margin-bottom: 24px;">
          View Your Match
        </a>
        <p style="color: #78856D; font-size: 14px; line-height: 1.6;">
          With warmth,<br />
          The Hearth Team
        </p>
      </div>
    `,
    new_message: `
      <div style="font-family: 'Lora', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #FAF3ED;">
        <h1 style="color: #B66E41; font-size: 32px; margin-bottom: 24px;">New Message from ${content.senderName}</h1>
        <p style="color: #2C2A27; font-size: 18px; line-height: 1.6; margin-bottom: 16px;">
          Hello ${content.name},
        </p>
        <p style="color: #2C2A27; font-size: 18px; line-height: 1.6; margin-bottom: 24px;">
          ${content.senderName} sent you a message. Continue your conversation when you're ready.
        </p>
        <a href="${content.chatUrl}" style="display: inline-block; background: #B66E41; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 18px; margin-bottom: 24px;">
          Read Message
        </a>
        <p style="color: #78856D; font-size: 14px; line-height: 1.6;">
          With warmth,<br />
          The Hearth Team
        </p>
      </div>
    `
  };

  return templates[type as keyof typeof templates] || content.html;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, type, ...templateData }: EmailRequest & { [key: string]: any } = await req.json();

    const emailHtml = type ? getEmailTemplate(type, templateData) : html;

    const emailResponse = await resend.emails.send({
      from: "Hearth <hello@hearth.lovable.app>",
      to: [to],
      subject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
