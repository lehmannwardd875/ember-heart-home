import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  age: z.number().min(45, "Hearth is designed for adults 45+").max(65, "Hearth is designed for adults 45-65"),
  email: z.string().email("Please enter a valid email"),
});

const Welcome = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = onboardingSchema.parse({
        fullName,
        age: parseInt(age),
        email,
      });

      // Store in localStorage temporarily (until backend)
      localStorage.setItem("hearth_onboarding", JSON.stringify(validated));
      
      toast({
        title: "Welcome to Hearth",
        description: "Let's continue your journey",
      });

      navigate("/verify");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Please check your information",
          description: error.issues[0].message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="font-serif text-2xl text-primary">
            Hearth
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[720px] animate-fade-in-up">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Welcome Home to Hearth
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              You've lived, loved, and learned — that's your story. Let's write the next chapter together.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 md:p-12 rounded-2xl shadow-card">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="h-12 text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-base">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Between 45-65"
                min="45"
                max="65"
                className="h-12 text-base"
                required
              />
              <p className="text-sm text-muted-foreground">
                Hearth is designed for adults 45-65
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-12 text-base"
                required
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base"
              >
                Begin Your Journey
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
