import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting daily match generation...');

    // Get all verified users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('user_id, location_city, location_state, age, profession, verified')
      .eq('verified', true)
      .eq('invisible', false);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    console.log(`Found ${users?.length || 0} verified users`);

    let matchesCreated = 0;
    const today = new Date().toISOString().split('T')[0];

    // For each user, generate matches
    for (const user of users || []) {
      // Check if user already has matches for today
      const { data: existingMatches } = await supabase
        .from('matches')
        .select('id')
        .eq('match_date', today)
        .or(`user1_id.eq.${user.user_id},user2_id.eq.${user.user_id}`);

      if (existingMatches && existingMatches.length > 0) {
        console.log(`User ${user.user_id} already has matches for today`);
        continue;
      }

      // Get user's recent reflections for tone analysis
      const { data: userReflections } = await supabase
        .from('reflections')
        .select('response, tone_tags')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Find potential matches (exclude self)
      const { data: candidates } = await supabase
        .from('profiles')
        .select('user_id, location_city, location_state, age, profession')
        .eq('verified', true)
        .eq('invisible', false)
        .neq('user_id', user.user_id);

      if (!candidates || candidates.length === 0) {
        console.log(`No candidates found for user ${user.user_id}`);
        continue;
      }

      // Score each candidate
      const scoredCandidates = candidates.map(candidate => {
        let score = 0;

        // 1. Reflection tone (40% weight) - Placeholder for now
        // Future: Use AI to analyze tone similarity
        score += 0.4 * Math.random();

        // 2. Geographic proximity (30% weight)
        if (candidate.location_city === user.location_city) {
          score += 0.3;
        } else if (candidate.location_state === user.location_state) {
          score += 0.15;
        }

        // 3. Age range (20% weight)
        const ageDiff = Math.abs((candidate.age || 0) - (user.age || 0));
        if (ageDiff <= 5) {
          score += 0.2;
        } else if (ageDiff <= 10) {
          score += 0.1;
        }

        // 4. Profession (10% weight)
        if (candidate.profession === user.profession) {
          score += 0.1;
        }

        return { ...candidate, score };
      });

      // Sort by score and take top 2
      const topMatches = scoredCandidates
        .sort((a, b) => b.score - a.score)
        .slice(0, 2);

      console.log(`Creating ${topMatches.length} matches for user ${user.user_id}`);

      // Create match records
      for (const match of topMatches) {
        // Ensure user1_id < user2_id to prevent duplicates
        const [user1, user2] = [user.user_id, match.user_id].sort();
        
        const { error: insertError } = await supabase.from('matches').insert({
          user1_id: user1,
          user2_id: user2,
          match_score: match.score,
          match_date: today,
          user1_interest: 'pending',
          user2_interest: 'pending',
          mutual_values: [],
          shared_reflections: [],
        });

        if (insertError) {
          // Might fail if match already exists (from other direction), which is fine
          console.log(`Could not create match: ${insertError.message}`);
        } else {
          matchesCreated++;
        }
      }
    }

    console.log(`Match generation complete. Created ${matchesCreated} matches.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        matchesCreated,
        usersProcessed: users?.length || 0 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Matching error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
