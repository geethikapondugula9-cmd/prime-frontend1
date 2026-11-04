import { Users, Briefcase, Stethoscope, GraduationCap, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UseCasesSectionProps {
  user: any;
}

export const UseCasesSection = ({ user }: UseCasesSectionProps) => {
  const navigate = useNavigate();

  const cases = [
    {
      icon: <Users className="w-6 h-6 text-sky-400" />,
      title: "Global Distributed Teams",
      subtitle: "Engineering & Operations",
      description: "Unify developers and operations teams across India, US, Europe, and Japan. Engineers speak in their primary language while code reviews and standups flow effortlessly.",
      badge: "Global Collaboration",
    },
    {
      icon: <Briefcase className="w-6 h-6 text-emerald-400" />,
      title: "Cross-Border Sales & Deals",
      subtitle: "International Business",
      description: "Close high-stakes contracts with international clients in South America, Asia, or Europe without hiring expensive third-party human interpreters.",
      badge: "Accelerated Closing",
    },
    {
      icon: <Stethoscope className="w-6 h-6 text-rose-400" />,
      title: "Healthcare & Telehealth",
      subtitle: "Medical Consultations",
      description: "Provide compassionate medical care to patients regardless of native language. Instant speech synthesis ensures clear instructions and zero misunderstandings.",
      badge: "HIPAA-Safe Flow",
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-purple-400" />,
      title: "Global Tutoring & Education",
      subtitle: "Online Classrooms",
      description: "Empower educators to lecture global students seamlessly. Students receive real-time translated voice audio and live captions during live lectures.",
      badge: "Multi-Language Learning",
    },
  ];

  return (
    <section className="py-24 dark:bg-[#0B0F17] bg-slate-50/70 dark:text-white text-slate-900 border-y dark:border-slate-800/80 border-slate-200 relative transition-colors">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full dark:bg-indigo-500/10 bg-indigo-50 border dark:border-indigo-500/20 border-indigo-200 dark:text-indigo-300 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            <span>Built For Every Industry</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold dark:text-white text-slate-900">
            Powering Multi-Lingual Conversations Worldwide
          </h2>
          <p className="dark:text-slate-400 text-slate-600 text-base sm:text-lg">
            See how organizations rely on PrimeTalker to break communication barriers every day.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {cases.map((item, idx) => (
            <div
              key={idx}
              className="dark:bg-slate-900/60 bg-white border dark:border-slate-800/80 border-slate-200 rounded-2xl p-8 hover:border-indigo-500/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between backdrop-blur-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl dark:bg-slate-800/80 bg-slate-100 border dark:border-slate-700 border-slate-200 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono font-semibold dark:bg-indigo-500/10 bg-indigo-50 dark:text-indigo-300 text-indigo-700 border dark:border-indigo-500/20 border-indigo-200 px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono dark:text-slate-400 text-slate-500 uppercase tracking-wider">
                    {item.subtitle}
                  </span>
                  <h3 className="text-2xl font-bold dark:text-white text-slate-900 mt-1">
                    {item.title}
                  </h3>
                </div>

                <p className="dark:text-slate-400 text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t dark:border-slate-800/60 border-slate-200 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (user ? navigate("/rooms") : navigate("/auth"))}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 p-0 gap-1 hover:bg-transparent"
                >
                  <span>Start a Meeting for {item.title}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
