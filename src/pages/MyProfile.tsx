import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Edit, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Profile {
  full_name: string;
  age: number;
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
  verified: boolean;
  verified_at: string | null;
  updated_at: string;
}

const MyProfile = () => {
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
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Could not load profile",
        description: error.message,
        variant: "destructive",
      });
      
      // If profile doesn't exist, redirect to create
      if (error.code === 'PGRST116') {
        navigate("/profile/create");
      }
      return;
    }

    // Check if profile is incomplete
    if (!data.life_focus || !data.reflection) {
      toast({
        title: "Your profile is incomplete",
        description: "Let's finish your story",
      });
      navigate("/profile/create");
      return;
    }

    setProfile({
      ...data,
      taste_cards: data.taste_cards as { books: string[]; films: string[]; music: string[]; inspiration: string[] }
    });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-12 max-w-[800px] space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </main>
      </div>
    );
  }

  if (!profile) return null;

  const formattedDate = new Date(profile.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl text-primary">
            Hearth
          </Link>
          <Link to="/matches">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Matches
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-[800px]">
        {/* Header with Edit Button */}
        <div className="flex items-start justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="font-serif text-4xl font-semibold mb-2">My Profile</h1>
            <p className="text-sm text-muted-foreground">
              Last updated {formattedDate}
            </p>
          </div>
          <Link to="/profile/create">
            <Button size="lg">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* Profile Content */}
        <div className="bg-background rounded-lg border border-border p-8 shadow-sm space-y-8">
          {/* Basic Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-3xl font-semibold">
                {profile.full_name}, {profile.age}
              </h2>
              {profile.verified && (
                <div className="flex items-center gap-1 text-accent">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>
            <p className="text-xl text-muted-foreground">{profile.profession}</p>
            {profile.education && (
              <p className="text-muted-foreground">{profile.education}</p>
            )}
          </div>

          {/* Life Focus */}
          <div className="border-t border-border pt-8">
            <p className="font-serif text-2xl italic text-primary leading-relaxed">
              "{profile.life_focus}"
            </p>
          </div>

          {/* Reflection */}
          <div className="border-t border-border pt-8 space-y-4">
            <h3 className="text-xl font-semibold">My Story</h3>
            <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
              {profile.reflection}
            </p>
          </div>

          {/* Taste Cards */}
          <div className="border-t border-border pt-8 space-y-6">
            <h3 className="text-xl font-semibold mb-6">What Moves Me</h3>
            
            <div className="space-y-4">
              {profile.taste_cards.books.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 text-sage">Books that moved me</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.taste_cards.books.map((book, i) => (
                      <span 
                        key={i} 
                        className="bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm"
                      >
                        {book}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.taste_cards.films.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 text-sage">Films I revisit</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.taste_cards.films.map((film, i) => (
                      <span 
                        key={i} 
                        className="bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm"
                      >
                        {film}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.taste_cards.music.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 text-sage">Music that centers me</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.taste_cards.music.map((item, i) => (
                      <span 
                        key={i} 
                        className="bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profile.taste_cards.inspiration.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 text-sage">What inspires me lately</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.taste_cards.inspiration.map((item, i) => (
                      <span 
                        key={i} 
                        className="bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <Link to="/settings" className="text-primary hover:underline text-sm">
            Go to Settings
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MyProfile;
