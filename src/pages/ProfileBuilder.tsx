import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { X, Plus, Eye } from "lucide-react";

const profileSchema = z.object({
  profession: z.string().min(2, "Please share your profession"),
  education: z.string().optional(),
  lifeFocus: z.string().min(10).max(150, "Keep it to one meaningful line (max 150 characters)"),
  reflection: z.string().min(300, "Please write at least 300 words").max(500, "Please keep it under 500 words"),
  tasteCards: z.object({
    books: z.array(z.string()).min(3, "Add at least 3 books").max(5),
    films: z.array(z.string()).min(3, "Add at least 3 films").max(5),
    music: z.array(z.string()).min(3, "Add at least 3 music items").max(5),
    inspiration: z.array(z.string()).min(3, "Add at least 3 inspirations").max(5),
  }),
});

type Section = 1 | 2 | 3 | 4 | 5;

const ProfileBuilder = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>(1);
  const [showPreview, setShowPreview] = useState(false);

  // Form fields
  const [profession, setProfession] = useState("");
  const [education, setEducation] = useState("");
  const [lifeFocus, setLifeFocus] = useState("");
  const [reflection, setReflection] = useState("");
  const [books, setBooks] = useState<string[]>([]);
  const [films, setFilms] = useState<string[]>([]);
  const [music, setMusic] = useState<string[]>([]);
  const [inspiration, setInspiration] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  const progressValue = (section / 5) * 100;

  const addTasteItem = (category: "books" | "films" | "music" | "inspiration") => {
    if (!newItem.trim()) return;

    const setter = {
      books: setBooks,
      films: setFilms,
      music: setMusic,
      inspiration: setInspiration,
    }[category];

    const current = {
      books,
      films,
      music,
      inspiration,
    }[category];

    if (current.length >= 5) {
      toast({
        title: "Maximum reached",
        description: "You can add up to 5 items per category",
        variant: "destructive",
      });
      return;
    }

    setter([...current, newItem]);
    setNewItem("");
  };

  const removeTasteItem = (category: "books" | "films" | "music" | "inspiration", index: number) => {
    const setter = {
      books: setBooks,
      films: setFilms,
      music: setMusic,
      inspiration: setInspiration,
    }[category];

    const current = {
      books,
      films,
      music,
      inspiration,
    }[category];

    setter(current.filter((_, i) => i !== index));
  };

  const saveDraft = () => {
    const draft = {
      profession,
      education,
      lifeFocus,
      reflection,
      tasteCards: { books, films, music, inspiration },
    };
    localStorage.setItem("hearth_profile_draft", JSON.stringify(draft));
    toast({
      title: "Draft saved",
      description: "Your progress is safe",
    });
  };

  const handleNext = () => {
    saveDraft();
    if (section < 5) {
      setSection((section + 1) as Section);
    }
  };

  const handlePublish = () => {
    try {
      const validated = profileSchema.parse({
        profession,
        education: education || undefined,
        lifeFocus,
        reflection,
        tasteCards: { books, films, music, inspiration },
      });

      localStorage.setItem("hearth_profile", JSON.stringify(validated));
      toast({
        title: "Profile published!",
        description: "Your story is beautifully told",
      });
      navigate("/matches");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Please check your profile",
          description: error.issues[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const renderSection = () => {
    switch (section) {
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-semibold mb-2">
                Your Professional Story
              </h2>
              <p className="text-muted-foreground">
                Let others know what you do and where you've learned
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Profession *</Label>
              <Input
                id="profession"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g., Architect in transition"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education / Alma Mater (Optional)</Label>
              <Input
                id="education"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="e.g., B.A., Stanford"
                className="h-12"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-semibold mb-2">
                What Matters Most Right Now?
              </h2>
              <p className="text-muted-foreground">
                One meaningful line that captures your current focus
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifeFocus">Life Focus Line *</Label>
              <Input
                id="lifeFocus"
                value={lifeFocus}
                onChange={(e) => setLifeFocus(e.target.value)}
                placeholder="e.g., Rediscovering balance through art and travel"
                maxLength={150}
                className="h-12"
              />
              <p className="text-sm text-muted-foreground text-right">
                {lifeFocus.length}/150 characters
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-semibold mb-2">
                Your Story, Beautifully Told
              </h2>
              <p className="text-muted-foreground">
                Share your outlook, goals, or what brings you joy (300-500 words)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reflection">Personal Reflection *</Label>
              <Textarea
                id="reflection"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Take your time... Share what feels authentic to you."
                rows={10}
                className="resize-none leading-relaxed"
              />
              <p className="text-sm text-muted-foreground text-right">
                {reflection.split(/\s+/).filter(Boolean).length} words (300-500 recommended)
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-semibold mb-2">
                A Glimpse Into Your World
              </h2>
              <p className="text-muted-foreground">
                Share what moves you, inspires you, and brings you peace
              </p>
            </div>

            {/* Books */}
            <div className="space-y-3">
              <Label>Books that moved me (3-5) *</Label>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTasteItem("books"))}
                  placeholder="Enter a book title"
                  className="flex-1"
                />
                <Button type="button" onClick={() => addTasteItem("books")} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {books.map((book, i) => (
                  <div
                    key={i}
                    className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {book}
                    <button onClick={() => removeTasteItem("books", i)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Films */}
            <div className="space-y-3">
              <Label>Films I revisit (3-5) *</Label>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTasteItem("films"))}
                  placeholder="Enter a film title"
                  className="flex-1"
                />
                <Button type="button" onClick={() => addTasteItem("films")} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {films.map((film, i) => (
                  <div
                    key={i}
                    className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {film}
                    <button onClick={() => removeTasteItem("films", i)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Music */}
            <div className="space-y-3">
              <Label>Music that centers me (3-5) *</Label>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTasteItem("music"))}
                  placeholder="Enter artist or song"
                  className="flex-1"
                />
                <Button type="button" onClick={() => addTasteItem("music")} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {music.map((item, i) => (
                  <div
                    key={i}
                    className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {item}
                    <button onClick={() => removeTasteItem("music", i)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspiration */}
            <div className="space-y-3">
              <Label>What inspires me lately (3-5) *</Label>
              <div className="flex gap-2">
                <Input
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTasteItem("inspiration"))}
                  placeholder="Enter an inspiration"
                  className="flex-1"
                />
                <Button type="button" onClick={() => addTasteItem("inspiration")} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {inspiration.map((item, i) => (
                  <div
                    key={i}
                    className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {item}
                    <button onClick={() => removeTasteItem("inspiration", i)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-semibold mb-2">
                Preview & Publish
              </h2>
              <p className="text-muted-foreground">
                Review your story before sharing it with the world
              </p>
            </div>

            {showPreview ? (
              <div className="bg-background p-8 rounded-lg border border-border space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-semibold mb-2">{profession}</h3>
                  {education && <p className="text-muted-foreground">{education}</p>}
                </div>

                <div className="border-t border-border pt-6">
                  <p className="font-serif text-xl italic text-primary mb-4">"{lifeFocus}"</p>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-medium mb-3">My Story</h4>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{reflection}</p>
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Books that moved me</h4>
                    <div className="flex flex-wrap gap-2">
                      {books.map((book, i) => (
                        <span key={i} className="bg-accent/20 px-3 py-1 rounded-full text-sm">
                          {book}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Films I revisit</h4>
                    <div className="flex flex-wrap gap-2">
                      {films.map((film, i) => (
                        <span key={i} className="bg-accent/20 px-3 py-1 rounded-full text-sm">
                          {film}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Music that centers me</h4>
                    <div className="flex flex-wrap gap-2">
                      {music.map((item, i) => (
                        <span key={i} className="bg-accent/20 px-3 py-1 rounded-full text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">What inspires me lately</h4>
                    <div className="flex flex-wrap gap-2">
                      {inspiration.map((item, i) => (
                        <span key={i} className="bg-accent/20 px-3 py-1 rounded-full text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Button variant="outline" onClick={() => setShowPreview(false)} className="w-full">
                  Continue Editing
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setShowPreview(true)} className="w-full" size="lg">
                <Eye className="w-4 h-4 mr-2" />
                See How Your Story Reads
              </Button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl text-primary">
            Hearth
          </Link>
          <Button variant="ghost" onClick={saveDraft}>
            Save Draft
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[720px]">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Section {section} of 5
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressValue)}% complete
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          <div className="bg-card p-8 md:p-12 rounded-2xl shadow-card">
            {renderSection()}

            <div className="flex gap-4 mt-8">
              {section > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setSection((section - 1) as Section)}
                  size="lg"
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              {section < 5 ? (
                <Button onClick={handleNext} size="lg" className="flex-1">
                  Continue
                </Button>
              ) : (
                <Button onClick={handlePublish} size="lg" className="flex-1">
                  Publish Your Story
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileBuilder;
