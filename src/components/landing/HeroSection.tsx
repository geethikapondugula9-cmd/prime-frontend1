import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Globe, Download, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  user: any;
}

export const HeroSection = ({ user }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [activeLangIndex, setActiveLangIndex] = useState(0);

  const languages = [
    { source: "English", target: "Spanish", text: "Hello! Welcome to our global meeting.", translation: "¡Hola! Bienvenido a nuestra reunión global." },
    { source: "English", target: "Telugu", text: "We deliver real-time voice translation across borders.", translation: "మేము సరిహద్దులు దాటి నిజసమయ వాయిస్ అనువాదాన్ని అందిస్తున్నాము." },
    { source: "English", target: "Japanese", text: "Experience instant low latency translation.", translation: "リアルタイムの低遅延翻訳をご体験ください。" },
    { source: "English", target: "German", text: "Encrypted HD video calling powered by WebRTC.", translation: "Verschlüsselte HD-Videoanrufe mit WebRTC." },
    { source: "English", target: "Hindi", text: "Connect naturally in your own native language.", translation: "अपनी मातृभाषा में सहजता से जुड़ें।" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLangIndex((prev) => (prev + 1) % languages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [languages.length]);

  const currentLang = languages[activeLangIndex];

  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden dark:bg-[#0B0F17] bg-white dark:text-white text-slate-900 transition-colors">
      {/* JotMe Style Glow Background Ambient Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Badge - JotMe Style Glassmorphism */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border dark:border-indigo-500/30 border-indigo-500/20 dark:bg-indigo-500/10 bg-indigo-50 text-xs sm:text-sm font-medium dark:text-indigo-300 text-indigo-700 shadow-sm backdrop-blur-md">
            <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Next-Gen Real-Time AI Speech Translation</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="hidden sm:inline-block text-xs font-normal dark:text-slate-400 text-slate-500">Many Global Languages</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight dark:text-white text-slate-900 leading-[1.15]">
            Break Every Language Barrier in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-600 dark:from-indigo-400 dark:via-purple-400 dark:to-sky-400">
              Real-Time Video Calls
            </span>
          </h1>

          <p className="text-lg sm:text-xl dark:text-slate-400 text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Instant streaming voice translation, live subtitles, and crystal-clear HD video conferencing. Speak your native language, hear them in yours.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => (user ? navigate("/rooms") : navigate("/auth"))}
              className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:scale-[1.01] transition-all gap-2 group border-0"
            >
              <span>{user ? "Go to Dashboard & Rooms" : "Start Meeting Free"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* User Guide button - opens the in-app User Guide page */}
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/user-guide")}
              className="w-full sm:w-auto text-base sm:text-lg px-7 py-6 rounded-xl dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-white dark:hover:bg-slate-800/80 hover:bg-slate-100 dark:text-slate-200 text-slate-800 dark:hover:text-white hover:text-slate-900 gap-2 backdrop-blur-md shadow-sm"
            >
              <Download className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
              <span>User Guide</span>
            </Button>
          </div>

          {/* Key Points */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm dark:text-slate-400 text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Low Streaming Latency</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No App Download Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>

        {/* Hero Product Preview with 2-Person PrimeTalker Graphic */}
        <div className="mt-12 md:mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900/60 bg-white p-2 sm:p-4 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Generated High-Quality Product Image */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/9] border dark:border-slate-800 border-slate-200">
              <img
                src="/images/hero_preview.jpg"
                alt="PrimeTalker 1-on-1 HD Video Meeting with Real-Time Subtitles"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t dark:from-slate-950/90 from-slate-900/40 dark:via-slate-950/20 via-transparent to-transparent pointer-events-none" />

              {/* Dynamic Live Subtitle Banner Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 dark:bg-slate-950/90 bg-white/95 backdrop-blur-md border dark:border-slate-800 border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">LIVE SPEECH TRANSLATION ACTIVE</span>
                  </div>
                  <div className="text-xs font-mono dark:bg-indigo-500/20 bg-indigo-50 dark:text-indigo-300 text-indigo-700 border dark:border-indigo-500/30 border-indigo-200 px-2.5 py-1 rounded-md">
                    {currentLang.source} ➔ {currentLang.target}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-[11px] font-mono dark:text-slate-400 text-slate-500 block mb-0.5 uppercase">Spoken Voice:</span>
                    <p className="dark:text-white text-slate-900 font-medium">"{currentLang.text}"</p>
                  </div>
                  <div className="border-t sm:border-t-0 sm:border-l dark:border-slate-800 border-slate-200 pt-2 sm:pt-0 sm:pl-4">
                    <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-300 block mb-0.5 uppercase">Translated Audio Output:</span>
                    <p className="text-indigo-700 dark:text-indigo-200 font-semibold">{currentLang.translation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
