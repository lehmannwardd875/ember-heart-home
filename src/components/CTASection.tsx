import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useSmartRedirect } from "@/hooks/useSmartRedirect";

const CTASection = () => {
  const { handleRedirect, isChecking } = useSmartRedirect();

  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary-foreground blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-accent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          {/* Heart Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/20 backdrop-blur-sm mb-4">
            <Heart className="w-10 h-10 text-primary-foreground fill-current" />
          </div>

          {/* Heading */}
          <h2 className="font-serif text-4xl lg:text-6xl text-primary-foreground leading-tight">
            You Are Safe Enough
            <br />
            <span className="italic">To Hope Again</span>
          </h2>

          {/* Description */}
          <p className="text-xl lg:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Whether you're rediscovering yourself after loss or simply tired of shallow connections—
            Hearth is your space to be seen, valued, and met with kindness.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-10 py-7 shadow-warm hover:scale-105 transition-all font-semibold"
              onClick={handleRedirect}
              disabled={isChecking}
            >
              Begin Your Story
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-7 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all"
            >
              See How It Works
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Bottom Quote */}
          <div className="pt-12 border-t border-primary-foreground/20 max-w-2xl mx-auto">
            <p className="font-serif text-xl italic text-primary-foreground/95 leading-relaxed">
              "Real love feels calm. It doesn't rush. It waits. It understands."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
