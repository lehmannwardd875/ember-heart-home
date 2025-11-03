import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Upload, Video, Linkedin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type VerificationStep = "selfie" | "video" | "linkedin" | "success";

const Verification = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<VerificationStep>("selfie");
  const [selfie, setSelfie] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploading, setUploading] = useState(false);

  const progressValue = {
    selfie: 25,
    video: 50,
    linkedin: 75,
    success: 100,
  }[step];

  const selfieGuidelines = [
    "Natural lighting works best",
    "Face clearly visible",
    "No sunglasses or hats",
    "Be yourself — authenticity is beautiful",
  ];

  const videoGuidelines = [
    "15 seconds to introduce yourself",
    "Share what you're looking for",
    "Speak from the heart",
    "No rehearsal needed — just be you",
  ];

  const uploadImageToStorage = async (file: File) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Must be logged in to upload');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/selfie-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const uploadVideoToStorage = async (file: File) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Must be logged in to upload');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/video-intro-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('video-intros')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('video-intros')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Video upload error:', error);
      throw error;
    }
  };

  const handleSelfieUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const url = await uploadImageToStorage(file);
        setSelfie(file);
        setSelfieUrl(url);
        toast({
          title: "Photo uploaded",
          description: "Looking great!",
        });
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const url = await uploadVideoToStorage(file);
        setVideo(file);
        setVideoUrl(url);
        toast({
          title: "Video uploaded",
          description: "Perfect!",
        });
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Must be logged in');
      }

      // Update profile with verification data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          selfie_url: selfieUrl,
          video_intro_url: videoUrl,
          linkedin_url: linkedinUrl || null,
          linkedin_verified: !!linkedinUrl,
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      localStorage.setItem("hearth_verified", "true");
      setStep("success");
      
      toast({
        title: "Verification complete!",
        description: "Your profile is now verified",
      });
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "selfie":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-3xl font-semibold mb-2">
                Upload Your Photo
              </h2>
              <p className="text-muted-foreground">
                Let others see your genuine smile
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-medium mb-3">Guidelines:</h3>
              <ul className="space-y-2">
                {selfieGuidelines.map((guideline, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <Label htmlFor="selfie" className="cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors text-center">
                  {uploading ? (
                    <div className="space-y-2">
                      <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                  ) : selfie ? (
                    <div className="space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-accent mx-auto" />
                      <p className="text-sm font-medium">{selfie.name}</p>
                      <p className="text-xs text-muted-foreground">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
                <Input
                  id="selfie"
                  type="file"
                  accept="image/*"
                  onChange={handleSelfieUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </Label>

              <Button
                onClick={() => setStep("video")}
                disabled={!selfie || uploading}
                size="lg"
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "video":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Video className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-3xl font-semibold mb-2">
                Short Video Introduction
              </h2>
              <p className="text-muted-foreground">
                15 seconds to share your story
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-medium mb-3">Guidelines:</h3>
              <ul className="space-y-2">
                {videoGuidelines.map((guideline, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span>{guideline}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <Label htmlFor="video" className="cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors text-center">
                  {uploading ? (
                    <div className="space-y-2">
                      <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                  ) : video ? (
                    <div className="space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-accent mx-auto" />
                      <p className="text-sm font-medium">{video.name}</p>
                      <p className="text-xs text-muted-foreground">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Video className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm font-medium">Click to upload</p>
                      <p className="text-xs text-muted-foreground">MP4, MOV up to 50MB</p>
                    </div>
                  )}
                </div>
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </Label>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("selfie")}
                  size="lg"
                  className="flex-1"
                  disabled={uploading}
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep("linkedin")}
                  disabled={!video || uploading}
                  size="lg"
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        );

      case "linkedin":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <Linkedin className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="font-serif text-3xl font-semibold mb-2">
                LinkedIn Verification
              </h2>
              <p className="text-muted-foreground">
                Optional: Strengthen your profile authenticity
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile URL (Optional)</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  This helps verify your professional background
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep("video")}
                  size="lg"
                  className="flex-1"
                  disabled={isVerifying}
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerification}
                  disabled={isVerifying}
                  size="lg"
                  className="flex-1"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Complete Verification"
                  )}
                </Button>
              </div>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="space-y-6 animate-scale-in text-center">
            <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <CheckCircle2 className="w-12 h-12 text-accent" />
            </div>
            
            <div>
              <h2 className="font-serif text-3xl font-semibold mb-2">
                You're Verified!
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                Welcome to Hearth's community of hearts with history. Your journey begins now.
              </p>
            </div>

            <Button
              onClick={() => navigate("/profile/create")}
              size="lg"
              className="w-full max-w-sm mx-auto"
            >
              Create Your Profile
            </Button>
          </div>
        );
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
        <div className="w-full max-w-[720px]">
          {step !== "success" && (
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-2 text-center">
                Trust begins when we show up as ourselves
              </p>
              <Progress value={progressValue} className="h-2" />
            </div>
          )}

          <div className="bg-card p-8 md:p-12 rounded-2xl shadow-card">
            {renderStep()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Verification;
