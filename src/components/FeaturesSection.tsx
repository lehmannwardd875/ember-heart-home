import { BookOpen, Coffee, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import womanCity from "@/assets/woman-city.jpg";
import coupleCelebration from "@/assets/couple-celebration.jpg";
import coupleField from "@/assets/couple-field.jpg";

const features = [
  {
    icon: BookOpen,
    title: "Tell Your Story",
    description: "Your profile isn't a resume—it's a window into who you are. Share the books that moved you, the moments that shaped you, the life you're creating.",
    image: womanCity,
    highlight: "No swiping. Just stories.",
  },
  {
    icon: Coffee,
    title: "Curated Connections",
    description: "One or two thoughtful introductions per day. Like a trusted friend making a meaningful introduction, not an endless feed of faces.",
    image: coupleField,
    highlight: "Quality over quantity",
  },
  {
    icon: Sparkles,
    title: "Built for Life's Next Chapter",
    description: "Whether divorced, widowed, or simply seeking something real—Hearth understands that your past is part of your strength, not something to hide.",
    image: coupleCelebration,
    highlight: "Love that lasts",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
          <h2 className="font-serif text-4xl lg:text-5xl mb-6 text-foreground">
            Dating That Feels Like
            <br />
            <span className="italic text-primary">Coming Home</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every detail of Hearth is designed for adults who've lived deeply and are ready to love wisely.
          </p>
        </div>

        <div className="space-y-24 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-center animate-fade-in-up ${
                  isEven ? "" : "lg:grid-flow-dense"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Image */}
                <div className={`${isEven ? "" : "lg:col-start-2"} relative group`}>
                  <div className="absolute inset-0 bg-primary/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500" />
                  <div className="relative rounded-3xl overflow-hidden shadow-warm border-4 border-primary/10">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground px-6 py-3 rounded-full shadow-warm font-semibold">
                    {feature.highlight}
                  </div>
                </div>

                {/* Content */}
                <div className={`space-y-6 ${isEven ? "" : "lg:col-start-1 lg:row-start-1"}`}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>

                  <h3 className="font-serif text-3xl lg:text-4xl text-foreground">
                    {feature.title}
                  </h3>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="pt-4">
                    <Button variant="outline" size="lg" className="group">
                      Learn More
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
