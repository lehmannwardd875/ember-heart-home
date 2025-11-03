import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { useState } from "react";
import { useSmartRedirect } from "@/hooks/useSmartRedirect";
import { useLoginRedirect } from "@/hooks/useLoginRedirect";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { handleRedirect, isChecking } = useSmartRedirect();
  const { handleLoginRedirect, isChecking: isCheckingLogin } = useLoginRedirect();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
            <span className="font-serif text-2xl text-foreground font-bold">Hearth</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors font-medium">
              How It Works
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              Our Story
            </a>
            <a href="#safety" className="text-foreground hover:text-primary transition-colors font-medium">
              Safety
            </a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              className="text-foreground"
              onClick={handleLoginRedirect}
              disabled={isCheckingLogin}
            >
              Log In
            </Button>
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary/90"
              onClick={handleRedirect}
              disabled={isChecking}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-border/50 animate-fade-in">
            <a href="#how-it-works" className="block text-foreground hover:text-primary transition-colors font-medium py-2">
              How It Works
            </a>
            <a href="#about" className="block text-foreground hover:text-primary transition-colors font-medium py-2">
              Our Story
            </a>
            <a href="#safety" className="block text-foreground hover:text-primary transition-colors font-medium py-2">
              Safety
            </a>
            <div className="pt-4 space-y-3">
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={handleLoginRedirect}
                disabled={isCheckingLogin}
              >
                Log In
              </Button>
              <Button 
                variant="default" 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleRedirect}
                disabled={isChecking}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
