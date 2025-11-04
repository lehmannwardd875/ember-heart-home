import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useVerificationStatus } from '@/hooks/useVerificationStatus';

interface VerificationGuardProps {
  children: React.ReactNode;
}

export const VerificationGuard = ({ children }: VerificationGuardProps) => {
  const [userId, setUserId] = useState<string | undefined>();
  const { isVerified, loading } = useVerificationStatus(userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);
    };
    checkAuth();
  }, []);

  // If user not authenticated, redirect to auth immediately
  if (userId === undefined) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return <Navigate to="/auth" replace />;
  }

  // Now check verification status
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground text-lg">Checking verification status...</p>
        </div>
      </div>
    );
  }

  // If not verified, redirect to verification page
  if (isVerified === false) {
    return <Navigate to="/verify" replace />;
  }

  return <>{children}</>;
};
