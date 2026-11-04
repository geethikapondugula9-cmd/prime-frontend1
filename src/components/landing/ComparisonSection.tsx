import { Check, X, Award } from "lucide-react";

export const ComparisonSection = () => {
  const comparisonData = [
    {
      feature: "Real-Time Neural Voice Playback",
      primeTalker: true,
      zoom: false,
      googleMeet: false,
      traditional: false,
      note: "Hears translated audio in partner's native language",
    },
    {
      feature: "Ultra-Low Streaming Latency",
      primeTalker: true,
      zoom: false,
      googleMeet: false,
      traditional: false,
      note: "WebSocket streaming voice translation pipeline",
    },
    {
      feature: "Many Languages & Indian Regional Dialects",
      primeTalker: true,
      zoom: false,
      googleMeet: true,
      traditional: true,
      note: "Telugu, Hindi, Tamil, Kannada, Bengali & global",
    },
    {
      feature: "HD SFU Video Calling Built-In",
      primeTalker: true,
      zoom: true,
      googleMeet: true,
      traditional: false,
      note: "Integrated Twilio WebRTC video grid",
    },
    {
      feature: "Zero App Download / Browser Native",
      primeTalker: true,
      zoom: false,
      googleMeet: true,
      traditional: false,
      note: "Instant link join `/join/:roomId`",
    },
    {
      feature: "Dual Live Subtitles + Export Logs",
      primeTalker: true,
      zoom: false,
      googleMeet: false,
      traditional: false,
      note: "Real-time dual subtitles & user guide download",
    },
  ];

  return (
    <section className="py-24 bg-[#0B0F17] text-white relative">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Why PrimeTalker Wins</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            How We Compare
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Unlike traditional meeting apps that only offer text subtitles after the meeting, PrimeTalker provides instant live voice translation during the call.
          </p>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl overflow-x-auto backdrop-blur-xl">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-xs font-mono text-slate-400 uppercase">
                <th className="p-4 sm:p-6 font-semibold text-white">Feature Capability</th>
                <th className="p-4 sm:p-6 bg-indigo-600/20 text-indigo-300 font-bold text-sm text-center border-x border-indigo-500/30">
                  PrimeTalker
                </th>
                <th className="p-4 sm:p-6 text-center">Zoom Captions</th>
                <th className="p-4 sm:p-6 text-center">Google Meet</th>
                <th className="p-4 sm:p-6 text-center">Translation Apps</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 sm:p-6 font-medium text-white">
                    <div>{row.feature}</div>
                    <div className="text-xs text-slate-400 font-normal mt-0.5">{row.note}</div>
                  </td>

                  {/* PrimeTalker Column */}
                  <td className="p-4 sm:p-6 bg-indigo-600/10 border-x border-indigo-500/20 text-center font-bold text-indigo-400">
                    <div className="flex items-center justify-center">
                      <span className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    </div>
                  </td>

                  {/* Zoom */}
                  <td className="p-4 sm:p-6 text-center text-slate-500">
                    {row.zoom ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-slate-600 mx-auto" />
                    )}
                  </td>

                  {/* Google Meet */}
                  <td className="p-4 sm:p-6 text-center text-slate-500">
                    {row.googleMeet ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-slate-600 mx-auto" />
                    )}
                  </td>

                  {/* Traditional Apps */}
                  <td className="p-4 sm:p-6 text-center text-slate-500">
                    {row.traditional ? (
                      <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-5 h-5 text-slate-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
