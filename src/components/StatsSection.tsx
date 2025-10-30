import { Heart, Shield, Users } from "lucide-react";

const stats = [
  {
    icon: Shield,
    title: "Verification First",
    description: "Every member is verified through video and identity confirmation",
    stat: "100% verified",
  },
  {
    icon: Heart,
    title: "Meaningful Connections",
    description: "Quality matches based on shared values and life experience",
    stat: "Real relationships",
  },
  {
    icon: Users,
    title: "Your Community",
    description: "Join thoughtful professionals who value authenticity",
    stat: "Ages 45-65",
  },
];

const StatsSection = () => {
  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="font-serif text-4xl lg:text-5xl mb-6 text-foreground">
            Built on Trust, Grounded in Reality
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            This isn't another dating app. It's a home for hearts with history—
            a place where emotional maturity meets genuine connection.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-card hover:shadow-warm transition-all duration-500 border border-border/50 group animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                
                <div className="space-y-3">
                  <div className="inline-block px-4 py-1 rounded-full bg-accent/20 text-accent font-semibold text-sm">
                    {item.stat}
                  </div>
                  
                  <h3 className="font-serif text-2xl text-foreground">
                    {item.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">
              Your privacy and safety are our foundation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
