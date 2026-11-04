import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Globe, Video } from "lucide-react";

interface CTABannerProps {
  user: any;
}

export const CTABanner = ({ user }: CTABannerProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-20 dark:bg-[#0B0F17] bg-slate-50/70 text-white relative overflow-hidden transition-colors">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-800 dark:from-indigo-900 dark:via-indigo-700 dark:to-purple-900 p-10 sm:p-16 text-center text-white shadow-2xl overflow-hidden border border-white/10">
          {/* Ambient Background Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/30 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider border border-white/20">
              <Globe className="w-3.5 h-3.5 text-indigo-300" />
              <span>Ready to Experience PrimeTalker?</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Start Your First Multi-Lingual Video Call Today
            </h2>

            <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Connect effortlessly across languages. Create a room, share your link, and start talking in seconds.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                onClick={() => (user ? navigate("/rooms") : navigate("/auth"))}
                className="bg-white text-slate-950 hover:bg-slate-100 text-base sm:text-lg font-bold px-9 py-6 rounded-xl shadow-xl gap-2 hover:scale-[1.02] transition-all border-0"
              >
                <Video className="w-5 h-5 text-indigo-600" />
                <span>{user ? "Open Rooms Dashboard" : "Create Free Meeting Room"}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
