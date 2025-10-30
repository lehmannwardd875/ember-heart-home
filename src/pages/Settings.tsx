import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, User, Lock, Bell, Shield } from "lucide-react";

const Settings = () => {
  const [invisibleMode, setInvisibleMode] = useState(false);
  const [shareReflections, setShareReflections] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [minAge, setMinAge] = useState("45");
  const [maxAge, setMaxAge] = useState("65");
  const [proximityRadius, setProximityRadius] = useState("50");

  const isVerified = localStorage.getItem("hearth_verified") === "true";

  const handleSave = () => {
    const settings = {
      invisibleMode,
      shareReflections,
      emailNotifications,
      preferences: {
        minAge: parseInt(minAge),
        maxAge: parseInt(maxAge),
        proximityRadius: parseInt(proximityRadius),
      },
    };

    localStorage.setItem("hearth_settings", JSON.stringify(settings));
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl text-primary">
            Hearth
          </Link>
          <Link to="/matches">
            <Button variant="ghost">Back to Matches</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-[720px]">
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-4xl font-semibold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile, privacy, and preferences
            </p>
          </div>

          {/* Profile Management */}
          <section className="bg-card p-6 rounded-lg border border-border space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Profile Management</h2>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Verification Status</p>
                <p className="text-sm text-muted-foreground">
                  {isVerified ? "Your profile is verified" : "Verification pending"}
                </p>
              </div>
              {isVerified && (
                <div className="flex items-center gap-2 text-accent">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Link to="/profile/create">
                <Button variant="outline" className="w-full">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </section>

          {/* Privacy Settings */}
          <section className="bg-card p-6 rounded-lg border border-border space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Privacy Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="invisible-mode">Invisible Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Take a break from new matches while staying connected with current conversations
                  </p>
                </div>
                <Switch
                  id="invisible-mode"
                  checked={invisibleMode}
                  onCheckedChange={setInvisibleMode}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="share-reflections">Share Reflections</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow shared excerpts to appear on match cards
                  </p>
                </div>
                <Switch
                  id="share-reflections"
                  checked={shareReflections}
                  onCheckedChange={setShareReflections}
                />
              </div>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-card p-6 rounded-lg border border-border space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Match Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-age">Min Age</Label>
                  <Input
                    id="min-age"
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    min="45"
                    max="65"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-age">Max Age</Label>
                  <Input
                    id="max-age"
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    min="45"
                    max="65"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proximity">Geographic Proximity (miles)</Label>
                <Input
                  id="proximity"
                  type="number"
                  value={proximityRadius}
                  onChange={(e) => setProximityRadius(e.target.value)}
                  min="10"
                  max="500"
                />
                <p className="text-sm text-muted-foreground">
                  Matches within this radius will be prioritized
                </p>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-card p-6 rounded-lg border border-border space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new matches and messages
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </section>

          {/* Account Actions */}
          <section className="bg-card p-6 rounded-lg border border-border space-y-4">
            <h2 className="text-xl font-semibold">Account</h2>

            <div className="space-y-2">
              <Button variant="outline" className="w-full" disabled>
                Change Password
              </Button>
              <Button variant="destructive" className="w-full" disabled>
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Account actions will be available after backend integration
              </p>
            </div>
          </section>

          <Button onClick={handleSave} size="lg" className="w-full">
            Save All Settings
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
