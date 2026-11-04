import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileDrawer from "@/components/ProfileDrawer";

import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureMatrix } from "@/components/landing/FeatureMatrix";
import { InteractiveTabs } from "@/components/landing/InteractiveTabs";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
// import { FAQSection } from "@/components/landing/FAQSection";
import { CTABanner } from "@/components/landing/CTABanner";

const Landing = () => {
  const [user, setUser] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  return (
    <div className="min-h-screen dark:bg-[#0B0F17] bg-white dark:text-white text-slate-900 flex flex-col font-sans selection:bg-indigo-600 selection:text-white transition-colors">
      {/* Navigation Header */}
      <Navbar user={user} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      {/* 1. HERO SECTION */}
      <HeroSection user={user} />

      {/* 2. CORE FEATURES MATRIX */}
      <FeatureMatrix />

      {/* 3. UNDER THE HOOD */}
      <InteractiveTabs />

      {/* 4. COMPARISON MATRIX (PrimeTalker vs Zoom / Meet) */}
      <ComparisonSection />

      {/* 5. USE CASES ACROSS INDUSTRIES */}
      <UseCasesSection user={user} />

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      {/* <FAQSection /> */}

      {/* 7. BOTTOM CONVERSION CTA BANNER */}
      <CTABanner user={user} />

      {/* FOOTER */}
      <Footer />

      {/* PROFILE DRAWER FOR LOGGED IN USERS */}
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

export default Landing;

