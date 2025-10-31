import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Please enter your full name').max(100),
  age: z.number().min(45, 'You must be at least 45 years old').max(65, 'You must be 65 or younger'),
});

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/welcome');
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === 'SIGNED_IN') {
        navigate('/welcome');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = signUpSchema.safeParse({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        age: parseInt(age),
      });

      if (!result.success) {
        toast({
          title: "Validation Error",
          description: result.error.issues[0].message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: result.data.fullName,
            age: result.data.age,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome to Hearth",
          description: "Please check your email to confirm your account.",
        });
        // Navigate to profile creation after successful signup
        navigate('/profile/create');
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = signInSchema.safeParse({
        email: email.trim(),
        password,
      });

      if (!result.success) {
        toast({
          title: "Validation Error",
          description: result.error.issues[0].message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Welcome back",
          description: "You've successfully signed in.",
        });
        navigate('/welcome');
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = resetSchema.safeParse({ email: email.trim() });

      if (!result.success) {
        toast({
          title: "Validation Error",
          description: result.error.issues[0].message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(result.data.email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        toast({
          title: "Reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        });
        setMode('signin');
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-serif font-semibold text-foreground mb-3">
            Welcome to Hearth
          </h1>
          <p className="text-muted-foreground text-lg">
            {mode === 'signup' && "You've lived, loved, and learned — that's your story."}
            {mode === 'signin' && "Welcome back. Your journey continues here."}
            {mode === 'reset' && "Let's help you get back in."}
          </p>
        </div>

        <Card className="shadow-warm border-border animate-scale-in">
          <CardHeader>
            <CardTitle className="font-serif text-2xl">
              {mode === 'signup' && 'Create Your Account'}
              {mode === 'signin' && 'Sign In'}
              {mode === 'reset' && 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-base">
              {mode === 'signup' && 'Trust begins when we show up as ourselves.'}
              {mode === 'signin' && 'Continue your journey with Hearth.'}
              {mode === 'reset' && 'Enter your email to receive a reset link.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-base">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    disabled={loading}
                    className="mt-1.5 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-base">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Your age (45-65)"
                    min="45"
                    max="65"
                    required
                    disabled={loading}
                    className="mt-1.5 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                    className="mt-1.5 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-base">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    disabled={loading}
                    className="mt-1.5 text-base"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-base"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            )}

            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-base">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                    className="mt-1.5 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-base">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    required
                    disabled={loading}
                    className="mt-1.5 text-base"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-base"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  disabled={loading}
                >
                  Forgot your password?
                </button>
              </form>
            )}

            {mode === 'reset' && (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-base">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={loading}
                    className="mt-1.5 text-base"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-base"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center space-y-2">
              {mode !== 'signup' && (
                <button
                  onClick={() => setMode('signup')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block w-full"
                  disabled={loading}
                >
                  Don't have an account? <span className="text-primary font-medium">Sign up</span>
                </button>
              )}
              {mode !== 'signin' && (
                <button
                  onClick={() => setMode('signin')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors block w-full"
                  disabled={loading}
                >
                  Already have an account? <span className="text-primary font-medium">Sign in</span>
                </button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors block text-center">
                ← Back to home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
