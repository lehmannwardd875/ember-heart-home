import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-couple.jpg";
import { Heart } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Couple in warm embrace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Message */}
          <div className="text-primary-foreground space-y-8 animate-fade-in-up pt-12 lg:pt-16">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20">
              <Heart className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">Come home to real love</span>
            </div>
            
            <h1 className="font-serif text-5xl lg:text-7xl leading-tight">
              Love With
              <br />
              <span className="italic">Life Experience</span>
            </h1>
            
            <p className="text-xl lg:text-2xl leading-relaxed opacity-95 max-w-xl">
              You've lived, loved, and learned. That's not baggage—that's wisdom. 
              Connect with others who understand your rhythm and value depth over swipes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="w-full sm:w-auto text-lg px-8 py-6 shadow-warm hover:scale-105 transition-all"
                >
                  Start Your Journey
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all"
              >
                How It Works
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Verified Members Only</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Safe & Private</span>
              </div>
            </div>
          </div>

          {/* Right Column - Experience Selector Preview */}
          <div className="lg:ml-auto w-full max-w-md animate-scale-in">
            <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-8 shadow-warm border border-border/50">
              <h3 className="font-serif text-2xl mb-6 text-foreground">
                What brings you here today?
              </h3>
              
              <div className="space-y-3">
                {[
                  "I'm ready for real connection",
                  "I want to take things slow",
                  "I value depth and authenticity"
                ].map((option, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary cursor-pointer transition-all bg-background/50 hover:bg-background group"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <div className="w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-foreground font-medium">{option}</span>
                  </label>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mt-6 text-center leading-relaxed">
                Real love feels calm. You belong here among people who understand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
