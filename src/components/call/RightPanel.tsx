// src/components/call/RightPanel.tsx
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RightPanel({
  transcripts,
  onClose,
  isTranslationOn,
  toggleTranslation,
}: {
  transcripts: any[];
  onClose: () => void;
  isTranslationOn: boolean;
  toggleTranslation: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive (Instagram-style)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  return (
    <div className="h-full max-h-screen flex flex-col dark:bg-[#0B0F17] bg-white dark:text-white text-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b dark:border-slate-800/80 border-slate-200 dark:bg-[#0B0F17]/90 bg-slate-50/90 shrink-0">
        <div className="text-lg font-semibold dark:text-white text-slate-900">Live Translation</div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 dark:text-indigo-300 bg-indigo-500/10">
            {isTranslationOn ? "On" : "Off"}
          </Badge>
          <Button variant="ghost" size="icon" onClick={onClose} className="dark:hover:bg-slate-800/60 hover:bg-slate-200 dark:text-slate-300 text-slate-700">
            <X size={18} />
          </Button>
        </div>
      </div>

      {/* Messages container - flex-1 with overflow scroll */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0"
      >
        {transcripts.length === 0 && (
          <div className="dark:text-slate-400 text-slate-500 text-center py-8">
            Start speaking to see translations...
          </div>
        )}

        {transcripts.map((t: any, i: number) => {
          const isYou = t.userType === localStorage.getItem("role");
          return (
            <div
              key={i}
              className={`p-3.5 rounded-2xl max-w-[85%] break-words overflow-hidden shadow-md ${isYou
                ? "ml-auto bg-indigo-600 text-white shadow-indigo-600/20"
                : "mr-auto dark:bg-slate-900/60 bg-slate-100 dark:border-slate-800 border-slate-200 dark:text-slate-100 text-slate-800 border"
                }`}
            >
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-xs font-semibold opacity-90">
                  {isYou ? "You" : "Partner"}
                </span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-indigo-400/30 text-indigo-500 dark:text-indigo-200">
                  {t.sourceLang} → {t.targetLang}
                </Badge>
              </div>
              <div className="text-xs opacity-75 italic mb-1 break-words">{t.originalText}</div>
              <div className="text-sm font-medium break-words">{t.translatedText}</div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t dark:border-slate-800/80 border-slate-200 dark:bg-[#0B0F17]/90 bg-slate-50/90 shrink-0">
        <Button
          size="sm"
          onClick={toggleTranslation}
          className={`w-full py-2.5 rounded-xl font-medium transition-all duration-200 ${
            isTranslationOn
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
              : "dark:bg-slate-800/80 bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-800 border dark:border-slate-700/60 border-slate-300"
          }`}
        >
          {isTranslationOn ? "Pause Translation" : "Resume Translation"}
        </Button>
      </div>
    </div>
  );
}
