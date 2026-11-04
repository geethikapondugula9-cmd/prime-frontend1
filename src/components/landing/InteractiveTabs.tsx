import { useState } from "react";
import { Mic, Globe, Share2, Layers, CheckCircle2 } from "lucide-react";

export const InteractiveTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: "speech",
      icon: <Mic className="w-4 h-4" />,
      title: "Low Streaming Latency",
      subtitle: "Instant Speech-to-Speech",
      description: "Experience continuous real-time voice translation as you talk. PrimeTalker captures spoken phrases and instantly streams translated voice audio to your listener without delay.",
      bullets: [
        "Natural conversational flow without waiting between turns",
        "Adaptive silence detection tailored for Indian regional and global languages",
        "Queued audio playback ensuring smooth, uninterrupted voice output",
      ],
      image: "/images/audio_stream.jpg",
      imageAlt: "Real-Time AI Voice-to-Voice Translation Flow",
    },
    {
      id: "transcripts",
      icon: <Globe className="w-4 h-4" />,
      title: "Many Languages & Indian Regional Dialects",
      subtitle: "Live On-Screen Subtitles & Notes",
      description: "Both participants receive instant dual-language subtitles while speaking, followed by complete meeting transcript notes ready for easy post-call review and export.",
      bullets: [
        "Full support for Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali & global languages",
        "Side-by-side original and translated transcript notes display",
        "Export full meeting transcript notes post-call",
      ],
      image: "/images/transcripts.jpg",
      imageAlt: "Live Dual Subtitles & Transcripts Interface",
    },
    {
      id: "rooms",
      icon: <Share2 className="w-4 h-4" />,
      title: "Instant Room Sharing",
      subtitle: "Frictionless Access",
      description: "Create a secure meeting room in a single click and share your invite link. Guests join directly from any web browser without required app downloads.",
      bullets: [
        "One-click instant meeting link generation",
        "Automatic target language selection on joining",
        "Browser-native HD video calling with active speaker focus",
      ],
      image: "/images/room_share.jpg",
      imageAlt: "Instant Meeting Room Invitation Interface",
    },
  ];

  const current = tabs[activeTab];

  return (
    <section className="py-24 dark:bg-[#0B0F17] bg-white dark:text-white text-slate-900 border-y dark:border-slate-800/80 border-slate-200 relative transition-colors">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full dark:bg-indigo-500/10 bg-indigo-50 border dark:border-indigo-500/20 border-indigo-200 dark:text-indigo-300 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>How PrimeTalker Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold dark:text-white text-slate-900">
            Simple, Powerful Meeting Experience
          </h2>
          <p className="dark:text-slate-400 text-slate-600 text-base sm:text-lg">
            Discover how PrimeTalker delivers seamless multi-lingual video calls worldwide.
          </p>
        </div>

        {/* Tab Selection Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-10">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all border ${activeTab === idx
                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                : "dark:bg-slate-900/60 bg-slate-100 dark:text-slate-400 text-slate-600 dark:border-slate-800 border-slate-200 dark:hover:bg-slate-800 hover:bg-slate-200 dark:hover:text-white hover:text-slate-900"
                }`}
            >
              {tab.icon}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800/80 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center backdrop-blur-xl">
          {/* Left Text Detail */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-semibold">
                {current.subtitle}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold dark:text-white text-slate-900">
                {current.title}
              </h3>
            </div>

            <p className="dark:text-slate-400 text-slate-600 text-sm sm:text-base leading-relaxed">
              {current.description}
            </p>

            <div className="space-y-3 pt-2">
              {current.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-3 text-sm dark:text-slate-200 text-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Showcase Container */}
          <div className="lg:col-span-7">
            <div className="relative rounded-xl border dark:border-slate-800 border-slate-200 dark:bg-slate-950 bg-slate-100 overflow-hidden shadow-2xl group">
              <img
                src={current.image}
                alt={current.imageAlt}
                className="w-full h-auto object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
              />
              <div className="absolute bottom-3 left-3 dark:bg-slate-950/90 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md border dark:border-slate-800 border-slate-200 text-[11px] font-mono dark:text-slate-300 text-slate-700">
                {current.imageAlt}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
