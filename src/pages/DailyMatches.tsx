import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Heart, X, Loader2, Sparkles, User, Settings } from 'lucide-react';

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  match_score: number;
  user1_interest: string;
  user2_interest: string;
  otherProfile?: {
    user_id: string;
    full_name: string;
    age: number;
    profession: string;
    life_focus: string;
    selfie_url: string | null;
  };
  sharedReflection?: string;
}

const DailyMatches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUserAndMatches();
  }, []);

  const loadUserAndMatches = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    setUser(currentUser);

    // Fetch today's matches
    const today = new Date().toISOString().split('T')[0];
    const { data: matchesData, error } = await supabase
      .from('matches')
      .select('*')
      .eq('match_date', today)
      .or(`user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`);

    if (error) {
      toast.error('Could not load matches');
      setLoading(false);
      return;
    }

    // Fetch profiles for each match
    const enrichedMatches = await Promise.all(
      (matchesData || []).map(async (match) => {
        const otherUserId = match.user1_id === currentUser.id ? match.user2_id : match.user1_id;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id, full_name, age, profession, life_focus, selfie_url')
          .eq('user_id', otherUserId)
          .single();

        // Fetch shared reflection if available
        const { data: reflections } = await supabase
          .from('reflections')
          .select('response')
          .eq('user_id', otherUserId)
          .eq('shared', true)
          .order('created_at', { ascending: false })
          .limit(1);

        return {
          ...match,
          otherProfile: profile,
          sharedReflection: reflections?.[0]?.response?.substring(0, 150) + '...',
        };
      })
    );

    setMatches(enrichedMatches);
    setLoading(false);
  };

  const hasMutualInterest = (match: Match): boolean => {
    return match.user1_interest === 'interested' && match.user2_interest === 'interested';
  };

  const handleInterest = async (matchId: string, interested: boolean) => {
    if (!user) return;

    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    setActionLoading(matchId);

    const isUser1 = match.user1_id === user.id;
    const updateField = isUser1 ? 'user1_interest' : 'user2_interest';
    const interestValue = interested ? 'interested' : 'not_interested';

    const { error } = await supabase
      .from('matches')
      .update({ [updateField]: interestValue })
      .eq('id', matchId);

    setActionLoading(null);

    if (error) {
      toast.error('Could not update interest');
      return;
    }

    // Check for mutual interest
    const otherInterest = isUser1 ? match.user2_interest : match.user1_interest;
    if (interested && otherInterest === 'interested') {
      toast.success("It's a match! You can now start chatting.", {
        action: {
          label: 'Go to Chat',
          onClick: () => navigate(`/chat/${matchId}`),
        },
      });
      // Reload matches to show "Start Chat" button
      await loadUserAndMatches();
    } else if (interested) {
      toast.success('Interest recorded. We\'ll let you know if they\'re interested too!');
      // Remove from view
      setMatches(matches.filter((m) => m.id !== matchId));
    } else {
      // Remove from view
      setMatches(matches.filter((m) => m.id !== matchId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-copper" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-copper" />
            <h1 className="font-serif text-4xl text-text-dark">
              Your Daily Introductions
            </h1>
            <Sparkles className="w-6 h-6 text-copper" />
          </div>
          <p className="text-lg text-warm-gray">
            Thoughtfully curated connections, one or two at a time
          </p>
        </div>

        {matches.length === 0 ? (
          <Card className="text-center py-16 border-copper/20">
            <CardContent>
              <div className="space-y-4">
                <p className="text-2xl font-serif text-text-dark">
                  No introductions today yet
                </p>
                <p className="text-warm-gray text-lg max-w-md mx-auto">
                  We're carefully considering who to introduce you to next. 
                  Meaningful connections take time to cultivate.
                </p>
                <div className="flex gap-4 justify-center mt-6">
                  <Button
                    onClick={() => navigate('/reflection')}
                    variant="outline"
                  >
                    Write a Reflection
                  </Button>
                  <Button
                    onClick={async () => {
                      toast.info('Generating today\'s matches...');
                      try {
                        const { error } = await supabase.functions.invoke('generate-daily-matches');
                        if (error) throw error;
                        toast.success('Matches generated! Refreshing...');
                        await loadUserAndMatches();
                      } catch (error) {
                        console.error('Error generating matches:', error);
                        toast.error('Could not generate matches. Please try again later.');
                      }
                    }}
                  >
                    Generate Today's Matches
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {matches.map((match) => {
              if (!match.otherProfile) return null;

              const currentUserInterest = 
                match.user1_id === user?.id ? match.user1_interest : match.user2_interest;
              
              // Show pending matches and mutual interest matches
              const showMatch = currentUserInterest === 'pending' || hasMutualInterest(match);
              
              if (!showMatch) return null;

              return (
                <Card key={match.id} className="overflow-hidden border-copper/20 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex flex-col items-center md:items-start">
                        <Avatar className="w-32 h-32 border-4 border-copper/20">
                          <AvatarImage src={match.otherProfile.selfie_url || undefined} />
                          <AvatarFallback className="text-3xl bg-copper/10 text-copper">
                            {match.otherProfile.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <Badge variant="secondary" className="mt-4">
                          Verified ✓
                        </Badge>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h2 className="font-serif text-3xl text-text-dark mb-2">
                            {match.otherProfile.full_name}, {match.otherProfile.age}
                          </h2>
                          <p className="text-lg text-warm-gray">
                            {match.otherProfile.profession}
                          </p>
                        </div>

                        <div className="bg-copper/5 p-4 rounded-lg border-l-4 border-copper">
                          <p className="font-handwritten text-xl text-text-dark italic">
                            "{match.otherProfile.life_focus}"
                          </p>
                        </div>

                        {match.sharedReflection && (
                          <div className="bg-sage/5 p-4 rounded-lg border-l-4 border-sage">
                            <p className="text-sm text-warm-gray mb-2 font-medium">
                              From their reflection:
                            </p>
                            <p className="text-text-dark leading-relaxed">
                              {match.sharedReflection}
                            </p>
                          </div>
                        )}

                        {hasMutualInterest(match) ? (
                          <div className="flex gap-4 pt-4">
                            <div className="flex-1 bg-sage/10 text-sage p-4 rounded-lg border border-sage/20 text-center">
                              <p className="font-medium mb-2">✨ It's a match!</p>
                              <p className="text-sm">You both are interested in connecting</p>
                            </div>
                            <Button
                              size="lg"
                              onClick={() => navigate(`/chat/${match.id}`)}
                              className="flex-1"
                            >
                              Start Chat
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-4 pt-4">
                            <Button
                              variant="outline"
                              size="lg"
                              onClick={() => handleInterest(match.id, false)}
                              disabled={actionLoading === match.id}
                              className="flex-1"
                            >
                              <X className="w-5 h-5 mr-2" />
                              Not now
                            </Button>
                            <Button
                              size="lg"
                              onClick={() => handleInterest(match.id, true)}
                              disabled={actionLoading === match.id}
                              className="flex-1"
                            >
                              {actionLoading === match.id ? (
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              ) : (
                                <Heart className="w-5 h-5 mr-2" />
                              )}
                              I'm interested
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyMatches;
