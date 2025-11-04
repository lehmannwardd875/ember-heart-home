import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useSmartRedirect = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  const handleRedirect = async () => {
    setIsChecking(true);
    
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('🔍 Smart Redirect - User check:', user ? 'Logged in' : 'Not logged in');
      
      if (!user) {
        // Not logged in → go to auth page (handles both login and signup)
        console.log('➡️ Redirecting to /auth (no user)');
        navigate('/auth');
        return;
      }

      // User is logged in, check verification status
      const { data: profile } = await supabase
        .from('profiles')
        .select('selfie_url, video_intro_url, verified, profession, life_focus, reflection')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!profile) {
        // No profile yet (shouldn't happen with trigger, but safety check)
        navigate('/auth');
        return;
      }

      // Check if verified (has selfie and video)
      const isVerified = !!(profile.selfie_url && profile.video_intro_url);
      
      console.log('🔍 Verification status:', isVerified ? 'Verified' : 'Not verified');
      
      if (!isVerified) {
        // Not verified → go to verification
        console.log('➡️ Redirecting to /verify (not verified)');
        navigate('/verify');
        return;
      }

      // Check if profile is complete (basic fields filled)
      const hasBasicProfile = profile.profession && profile.life_focus && profile.reflection;
      
      console.log('🔍 Profile complete:', hasBasicProfile ? 'Yes' : 'No');
      
      if (!hasBasicProfile) {
        // Verified but profile not complete → go to profile creation
        console.log('➡️ Redirecting to /profile/create (incomplete profile)');
        navigate('/profile/create');
        return;
      }

      // Everything complete → go to matches
      console.log('➡️ Redirecting to /matches (all complete)');
      navigate('/matches');
      
    } catch (error) {
      console.error('Error checking user status:', error);
      // On error, default to auth page
      navigate('/auth');
    } finally {
      setIsChecking(false);
    }
  };

  return { handleRedirect, isChecking };
};
