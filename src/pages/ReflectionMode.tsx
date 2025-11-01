import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, BookOpen } from 'lucide-react';

const reflectionPrompts = [
  "What kind of connection would feel nourishing today?",
  "What made you feel alive this week?",
  "What are you grateful for in this season of life?",
  "What does 'home' mean to you right now?",
  "What brings you peace when life feels uncertain?",
  "What story from your past still makes you smile?",
  "What would you want someone to know about your heart?",
];

const getDailyPrompt = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return reflectionPrompts[dayOfYear % reflectionPrompts.length];
};

const ReflectionMode = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState('');
  const [shared, setShared] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pastReflections, setPastReflections] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'write' | 'past'>('write');
  const dailyPrompt = getDailyPrompt();

  const wordCount = response.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (viewMode === 'past') {
      fetchPastReflections();
    }
  }, [viewMode]);

  const fetchPastReflections = async () => {
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Could not load past reflections');
    } else {
      setPastReflections(data || []);
    }
  };

  const handleSave = async () => {
    if (wordCount < 10) {
      toast.error('Please write at least 10 words for your reflection');
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to save reflections');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('reflections')
      .insert([{
        user_id: user.id,
        prompt: dailyPrompt,
        response,
        shared,
      }]);

    setLoading(false);

    if (error) {
      toast.error('Could not save reflection');
    } else {
      toast.success('Reflection saved beautifully');
      setResponse('');
      setShared(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('reflections')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Could not delete reflection');
    } else {
      toast.success('Reflection deleted');
      fetchPastReflections();
    }
  };

  return (
    <div className="min-h-screen bg-ivory py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-text-dark mb-4">
            Daily Reflection
          </h1>
          <p className="text-lg text-warm-gray">
            A quiet space to explore your heart
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={viewMode === 'write' ? 'default' : 'outline'}
            onClick={() => setViewMode('write')}
          >
            Write Today
          </Button>
          <Button
            variant={viewMode === 'past' ? 'default' : 'outline'}
            onClick={() => setViewMode('past')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Past Reflections
          </Button>
        </div>

        {viewMode === 'write' ? (
          <Card className="border-copper/20">
            <CardHeader>
              <CardTitle className="font-handwritten text-2xl text-copper">
                {dailyPrompt}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Textarea
                placeholder="Begin writing... there's no rush, no pressure. Just you and your thoughts."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[300px] text-lg leading-relaxed border-copper/20 focus:border-copper resize-none"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    id="share-toggle"
                    checked={shared}
                    onCheckedChange={setShared}
                  />
                  <Label htmlFor="share-toggle" className="text-warm-gray cursor-pointer">
                    Share an excerpt on my match cards
                  </Label>
                </div>
                <span className={`text-sm ${wordCount < 10 ? 'text-warm-gray' : 'text-sage'}`}>
                  {wordCount} words
                </span>
              </div>

              <div className="text-sm text-warm-gray bg-copper/5 p-4 rounded-lg space-y-2">
                <div>
                  <p className="font-medium">Minimum 10 words required to save</p>
                </div>
                <div>
                  <p className="font-medium">About sharing:</p>
                  <p>
                    When you choose to share, a meaningful excerpt from your reflection may appear 
                    on your match cards, helping others understand the depth of your heart.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={loading || wordCount < 10}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Reflection'
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pastReflections.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-warm-gray text-lg">
                    Your reflections will appear here. Begin writing to start your journey.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pastReflections.map((reflection) => (
                <Card key={reflection.id} className="border-copper/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="font-handwritten text-xl text-copper mb-2">
                          {reflection.prompt}
                        </CardTitle>
                        <p className="text-sm text-warm-gray">
                          {new Date(reflection.created_at).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(reflection.id)}
                        className="text-warm-gray hover:text-copper"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-dark leading-relaxed whitespace-pre-wrap">
                      {reflection.response}
                    </p>
                    {reflection.shared && (
                      <div className="mt-4 pt-4 border-t border-copper/20">
                        <p className="text-sm text-sage">
                          ✓ Shared on match cards
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionMode;
