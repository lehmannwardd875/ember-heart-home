import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, MessageCircle, User, Sparkles } from "lucide-react";

interface Profile {
  full_name: string;
  profession: string;
  education: string | null;
  life_focus: string;
  reflection: string;
  taste_cards: {
    books: string[];
    films: string[];
    music: string[];
    inspiration: string[];
  };
}

const ProfilePublished = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('full_name, profession, education, life_focus, reflection, taste_cards')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      navigate("/profile/create");
      return;
    }

    setProfile(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="font-serif text-2xl text-primary">
            Hearth
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-[800px]">
        {/* Success Message */}
        <div className="text-center mb-12 animate-fade-in space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-4">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>
          
          <h1 className="font-serif text-4xl font-semibold text-primary">
            Your story is beautifully told ✨
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
            Your profile is live and ready to connect hearts. Take a moment to see how your story reads.
          </p>
        </div>

        {/* Profile Preview Card */}
        <div className="bg-background rounded-lg border border-border p-8 shadow-sm mb-8 space-y-6">
          <div>
            <h2 className="font-serif text-3xl font-semibold mb-2">
              {profile.full_name}
            </h2>
            <p className="text-lg text-muted-foreground">{profile.profession}</p>
            {profile.education && (
              <p className="text-sm text-muted-foreground">{profile.education}</p>
            )}
          </div>

          <div className="border-t border-border pt-6">
            <p className="font-serif text-xl italic text-primary leading-relaxed">
              "{profile.life_focus}"
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-medium mb-3 text-lg">My Story</h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-6">
              {profile.reflection}
            </p>
          </div>

          <div className="border-t border-border pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.taste_cards.books.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-sm">Books that moved me</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.taste_cards.books.slice(0, 2).map((book, i) => (
                    <span key={i} className="bg-accent/20 px-3 py-1 rounded-full text-xs">
                      {book}
                    </span>
                  ))}
                  {profile.taste_cards.books.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{profile.taste_cards.books.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {profile.taste_cards.films.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 text-sm">Films I revisit</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.taste_cards.films.slice(0, 2).map((film, i) => (
                    <span key={i} className="bg-accent/20 px-3 py-1 rounded-full text-xs">
                      {film}
                    </span>
                  ))}
                  {profile.taste_cards.films.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{profile.taste_cards.films.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Link to="/profile">
              <Button variant="outline" size="sm" className="w-full">
                <User className="w-4 h-4 mr-2" />
                View Full Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/reflection" className="block">
            <Button size="lg" variant="default" className="w-full h-auto py-6 flex-col gap-2">
              <MessageCircle className="w-6 h-6" />
              <span className="text-lg font-medium">Write Your First Reflection</span>
              <span className="text-sm opacity-80">Share what's on your heart today</span>
            </Button>
          </Link>

          <Link to="/matches" className="block">
            <Button size="lg" variant="outline" className="w-full h-auto py-6 flex-col gap-2">
              <Sparkles className="w-6 h-6" />
              <span className="text-lg font-medium">See My Matches</span>
              <span className="text-sm opacity-80">Discover hearts with history</span>
            </Button>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            You can always update your profile from{" "}
            <Link to="/settings" className="text-primary hover:underline">
              Settings
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProfilePublished;
