import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVerificationStatus = (userId: string | undefined) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsVerified(null);
      setLoading(false);
      return;
    }

    const checkVerification = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('selfie_url, video_intro_url')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error checking verification:', error);
          setIsVerified(false);
        } else if (!data) {
          // No profile exists yet
          setIsVerified(false);
        } else {
          // User is verified if they have both selfie and video uploaded
          setIsVerified(!!(data.selfie_url && data.video_intro_url));
        }
      } catch (err) {
        console.error('Verification check failed:', err);
        setIsVerified(false);
      } finally {
        setLoading(false);
      }
    };

    checkVerification();
  }, [userId]);

  return { isVerified, loading };
};
