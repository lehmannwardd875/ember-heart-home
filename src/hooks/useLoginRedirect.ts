import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useLoginRedirect = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  const handleLoginRedirect = async () => {
    setIsChecking(true);
    
    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not logged in → go to auth/sign-in page
        navigate('/auth');
      } else {
        // Logged in → go to matches
        navigate('/matches');
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      // On error, default to auth page
      navigate('/auth');
    } finally {
      setIsChecking(false);
    }
  };

  return { handleLoginRedirect, isChecking };
};
