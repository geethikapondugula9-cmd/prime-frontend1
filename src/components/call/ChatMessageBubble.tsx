import React from "react";
import { format } from "date-fns";

export interface ChatMessageBubbleProps {
  message: {
    id: string;
    senderId: string;
    senderName: string;
    originalMessage: string;
    translatedMessage: string;
    sourceLanguage: string;
    targetLanguage: string;
    timestamp: number;
    isLocal?: boolean;
  };
  isOwn: boolean;
}

export default function ChatMessageBubble({ message, isOwn }: ChatMessageBubbleProps) {
  const displayText = isOwn ? message.originalMessage : message.translatedMessage;
  const timeLabel = format(new Date(message.timestamp), "hh:mm a");

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-sm ${
          isOwn
            ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white"
            : "bg-slate-800/80 text-slate-100"
        }`}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
            {isOwn ? "You" : message.senderName}
          </span>
          <span className="text-[10px] opacity-70">{timeLabel}</span>
        </div>
        <div className="text-sm leading-6 break-words">{displayText}</div>
        {!isOwn && (
          <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
            {message.sourceLanguage} → {message.targetLanguage}
          </div>
        )}
      </div>
    </div>
  );
}
