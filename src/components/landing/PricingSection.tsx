import { Check, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PricingSectionProps {
  user: any;
}

export const PricingSection = ({ user }: PricingSectionProps) => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter Free",
      price: "$0",
      period: "forever free",
      badge: "Get Started Instantly",
      description: "Ideal for individual voice calls, testing live translation, and short meetings.",
      features: [
        "Unlimited HD Video Calling",
        "Up to 60 Mins/Call Real-Time Translation",
        "40+ Languages & Regional Dialects",
        "Dual Live Captions & Transcripts",
        "Guest One-Click Room Join Links",
      ],
      ctaText: user ? "Go to Dashboard" : "Start Free Now",
      highlight: false,
    },
    {
      name: "Professional",
      price: "$19",
      period: "per user / month",
      badge: "Most Popular",
      description: "For teams, global professionals, and cross-border consultants needing unlimited translation.",
      features: [
        "Everything in Free, plus:",
        "Unlimited Real-Time Translation Minutes",
        "Neural2 Natural Voice Audio Synthesis",
        "Custom Silence Threshold Tuning",
        "Export Transcript Notes & User Guides",
        "Priority WebRTC Audio Bandwidth",
      ],
      ctaText: "Get Pro Access",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "tailored SLA",
      badge: "Dedicated Media SFU",
      description: "For global enterprises requiring custom voice models, dedicated SFU servers, and SOC2 compliance.",
      features: [
        "Everything in Pro, plus:",
        "Dedicated Twilio Video SFU Instance",
        "Custom Voice Cloning & Tone Tuning",
        "On-Premises / Private Cloud Deployment",
        "Dedicated Account Support & SLA",
        "Zero-Log Audit Certification",
      ],
      ctaText: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Simple Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground">
            Start Free, Scale As You Grow
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            No credit card required to begin calling with real-time translation.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl bg-card border p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.highlight
                  ? "border-primary shadow-2xl shadow-primary/20 scale-[1.03] bg-card/90"
                  : "border-border/80 hover:border-border hover:shadow-xl"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-xs text-muted-foreground font-mono">/ {plan.period}</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/60">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm text-foreground">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Button
                  onClick={() => (user ? navigate("/rooms") : navigate("/auth"))}
                  className={`w-full py-6 rounded-xl font-semibold gap-2 ${
                    plan.highlight
                      ? "shadow-lg shadow-primary/25"
                      : "variant-outline"
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
