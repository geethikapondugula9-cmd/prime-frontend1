import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does real-time voice translation work in PrimeTalker?",
      a: "As you speak, your microphone audio is converted to high-fidelity digital audio and streamed via WebSocket to our backend server. Google Speech-to-Text streams interim results, which are accumulated, translated via Google Translate, and synthesized into natural Neural voice audio sent directly to your call partner.",
    },
    {
      q: "Which languages and dialects are supported?",
      a: "PrimeTalker supports over 40 global languages, including Indian regional languages like Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Marathi, Punjabi, and Gujarati, as well as global languages like English, Spanish, French, German, Japanese, Mandarin, Arabic, and Russian.",
    },
    {
      q: "Do call guests need to create an account or download an app?",
      a: "No! Guests can join your meeting room instantly through a shared link (`/join/:roomId`) from any modern WebRTC-supported web browser (Chrome, Edge, Safari, Firefox). No software installation or sign-up required for guests.",
    },
    {
      q: "What is the typical audio translation delay (latency)?",
      a: "PrimeTalker is optimized for ultra-low streaming latency. We use singleton client connections, pre-warmed speech recognition streams, and adaptive silence detection tailored for both Indian regional and global languages.",
    },
    {
      q: "Is my voice data private and secure?",
      a: "Yes. Audio streams are processed strictly in-memory during active speech and never stored to disk. All WebRTC media streams are encrypted end-to-end, and user sessions are protected by Supabase authentication.",
    },
  ];

  return (
    <section className="py-24 dark:bg-[#0B0F17] bg-white dark:text-white text-slate-900 border-y dark:border-slate-800/80 border-slate-200 relative transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full dark:bg-indigo-500/10 bg-indigo-50 border dark:border-indigo-500/20 border-indigo-200 dark:text-indigo-300 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold dark:text-white text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="dark:text-slate-400 text-slate-600 text-base">
            Everything you need to know about PrimeTalker's real-time AI translation.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="dark:bg-slate-900/60 bg-slate-50 border dark:border-slate-800/80 border-slate-200 rounded-xl overflow-hidden transition-all backdrop-blur-xl"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 font-semibold dark:text-white text-slate-900 flex items-center justify-between gap-4 dark:hover:bg-slate-800/50 hover:bg-slate-100 transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 dark:text-slate-400 text-slate-600 text-sm leading-relaxed border-t dark:border-slate-800/60 border-slate-200 pt-4 dark:bg-slate-950/40 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
