import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  recipientUserId: string;
  recipientName: string;
  interestedUserName: string;
  matchId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientUserId, recipientName, interestedUserName, matchId }: NotificationRequest = await req.json();

    console.log('Sending interest notification:', { recipientUserId, recipientName, interestedUserName, matchId });

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get recipient's email from auth.users
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(recipientUserId);
    
    if (userError || !userData?.user?.email) {
      console.error('Failed to get user email:', userError);
      throw new Error('Could not retrieve recipient email');
    }

    const recipientEmail = userData.user.email;

    // Use Resend to send email
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Hearth <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: "💌 Someone's Interested in You on Hearth",
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FDF9F4;">
            <h1 style="color: #B66E41; font-size: 28px; margin-bottom: 20px;">
              Hello ${recipientName},
            </h1>
            <p style="color: #2C2A27; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
              Someone has shown interest in connecting with you on Hearth! 
            </p>
            <p style="color: #2C2A27; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              This is a thoughtful connection that we believe could be meaningful for you both. 
              Log in to see who it is and respond if you're interested too.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://preview--hearth-dating-app.lovable.app/matches" 
                 style="background-color: #B66E41; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; display: inline-block;">
                View Your Match
              </a>
            </div>
            <p style="color: #B5A89D; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              Come home to real love,<br/>
              The Hearth Team
            </p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailData = await emailResponse.json();
    console.log('Email sent successfully:', emailData);

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-interest-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
