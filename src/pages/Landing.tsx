import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Video, Globe, Mic, Shield, Download, User, Pencil, Camera, Settings, BookOpen, LogOut, X, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import PremiumBackground from "@/components/PremiumBackground";
import ProfileMenu from "@/components/ProfileMenu";
import ProfileDrawer from "@/components/ProfileDrawer";

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("prime_user");
    navigate("/");
  };


  // // Profile menu - just the avatar button
  // const ProfileMenu = ({ user }: { user: any }) => {
  //   return (
  //     <img
  //       src={user.user_metadata?.avatar_url || "/default-avatar.svg"}
  //       className="w-10 h-10 rounded-full border cursor-pointer hover:scale-105 transition"
  //       onClick={() => setDrawerOpen(!drawerOpen)}
  //     />
  //   );
  // };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <PremiumBackground />

      {/* NAVIGATION BAR */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">

          {/* LEFT - LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/landing")}
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="w-28 sm:w-40 h-auto object-contain select-none"
            />
          </div>

          {/* RIGHT - PROFILE / BUTTONS */}
          {user ? (
            <div className="flex items-center gap-3">
              <ProfileMenu
                user={user}
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-sm"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-sm">
                Sign In
              </Button>
              <Button onClick={() => navigate("/auth")} size="sm" className="shadow-primary text-sm">
                Get Started
              </Button>
            </div>
          )}

        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="container mx-auto px-4 py-12 sm:py-20 text-center animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
            Break Language Barriers in
            <span className="text-transparent bg-clip-text bg-gradient-primary">
              {" "}Real-Time
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with anyone, anywhere. PrimeTalker provides instant translation
            during calls, making global communication seamless.
          </p>

          {/* START MEETING BUTTON */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => (user ? navigate("/rooms") : navigate("/auth"))}
              className="shadow-primary text-lg px-8"
            >
              Start Meeting
            </Button>
            <a
              href="/PrimeTalker-User-Guide.html"
              download="PrimeTalker-User-Guide.html"
              className="inline-flex"
            >
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 gap-2"
              >
                <Download className="w-5 h-5" />
                Download Guide
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Video className="w-8 h-8" />}
            title="HD Voice Calls"
            description="Crystal clear quality powered by Twilio Voice SDK."
          />
          <FeatureCard
            icon={<Globe className="w-8 h-8" />}
            title="Real-Time Translation"
            description="Instant translation in 100+ languages."
          />
          <FeatureCard
            icon={<Mic className="w-8 h-8" />}
            title="Voice Recognition"
            description="Advanced STT using Deepgram/Google Cloud."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Secure Platform"
            description="Encrypted communication for safe meetings."
          />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-card rounded-2xl p-12 text-center shadow-primary border border-border">
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Connect Globally?
          </h3>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users breaking language barriers every day.
          </p>

          {/* CTA BUTTON - SAME BEHAVIOR AS START MEETING */}
          <Button
            size="lg"
            onClick={() => (user ? navigate("/rooms") : navigate("/auth"))}
            className="shadow-primary text-lg px-8"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* PROFILE DRAWER - rendered at page level for proper state management */}
      {user && (
        <ProfileDrawer
          user={user}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </div>
  );
};

/* FEATURE CARD */
const FeatureCard = ({ icon, title, description }: any) => (
  <div className="bg-card rounded-xl p-6 border border-border hover:shadow-primary transition-all duration-300 hover:-translate-y-1">
    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
      {icon}
    </div>
    <h4 className="text-xl font-semibold text-foreground mb-2">{title}</h4>
    <p className="text-muted-foreground">{description}</p>
  </div>
);
export default Landing;
