import { Zap, Globe, Volume2, Video, FileText, ShieldCheck, Cpu } from "lucide-react";

export const FeatureMatrix = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-indigo-400" />,
      title: "Low Streaming Latency",
      description: "Speak naturally in your native language and hear your partner's translated response in real-time with virtually zero speech interruption or waiting time.",
      badge: "Instant Speech Flow",
    },
    {
      icon: <Globe className="w-6 h-6 text-sky-400" />,
      title: "Many Languages & Indian Regional Dialects",
      description: "Break language barriers effortlessly across global teams with full support for Indian regional languages including Telugu, Hindi, Tamil, Kannada, Malayalam, and Bengali.",
      badge: "Regional & Global",
    },
    {
      icon: <Volume2 className="w-6 h-6 text-purple-400" />,
      title: "Natural AI Voice Playback",
      description: "Experience human-sounding voice translation audio spoken directly in your partner's native language, creating natural conversation instead of silent text reading.",
      badge: "Voice-to-Voice",
    },
    {
      icon: <Video className="w-6 h-6 text-emerald-400" />,
      title: "HD Video & Studio Audio",
      description: "Enjoy high-definition video conferencing with noise-filtered studio audio clarity and intelligent active speaker focus during every meeting.",
      badge: "Crystal Clear HD",
    },
    {
      icon: <FileText className="w-6 h-6 text-blue-400" />,
      title: "Smart Transcripts & Notes",
      description: "Automatically capture live dual-language transcript notes throughout your call, making it effortless to review, copy, and export full conversation summaries.",
      badge: "Live Summary Notes",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-400" />,
      title: "Bank-Grade Security & Privacy",
      description: "Communicate with complete peace of mind through fully encrypted video calling channels and a strict zero audio data storage privacy guarantee.",
      badge: "Zero-Data Retention",
    },
  ];

  return (
    <section className="py-24 dark:bg-[#0B0F17] bg-slate-50/70 dark:text-white text-slate-900 relative overflow-hidden border-t dark:border-slate-800/80 border-slate-200 transition-colors">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full dark:bg-indigo-500/10 bg-indigo-50 border dark:border-indigo-500/20 border-indigo-200 dark:text-indigo-300 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Core Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold dark:text-white text-slate-900 tracking-tight">
            Designed for Natural Global Conversations
          </h2>
          <p className="dark:text-slate-400 text-slate-600 text-base sm:text-lg">
            Everything you need for seamless, multi-lingual voice calls and video meetings in one unified platform.
          </p>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl dark:bg-slate-900/60 bg-white border dark:border-slate-800/80 border-slate-200 p-8 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl dark:bg-slate-800/80 bg-slate-100 border dark:border-slate-700/60 border-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {feat.icon}
                  </div>
                  <span className="text-[11px] font-mono dark:bg-slate-800/90 bg-slate-100 dark:text-slate-300 text-slate-700 px-2.5 py-1 rounded-md border dark:border-slate-700/60 border-slate-200">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feat.title}
                </h3>
                <p className="dark:text-slate-400 text-slate-600 text-sm leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
