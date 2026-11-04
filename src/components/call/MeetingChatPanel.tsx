import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, MessageCircle } from "lucide-react";
import ChatMessageBubble from "@/components/call/ChatMessageBubble";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  originalMessage: string;
  translatedMessage: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
  isLocal?: boolean;
}

interface MeetingChatPanelProps {
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (message: string) => void;
  isSending: boolean;
  myLanguage: string;
  myName: string;
  partnerName?: string;
}

export default function MeetingChatPanel({
  messages,
  onClose,
  onSendMessage,
  isSending,
  myLanguage,
  myName,
  partnerName,
}: MeetingChatPanelProps) {
  // console.log("MeetingChatPanel isSending:", isSending);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setDraft("");
  };

  const headerLabel = useMemo(() => {
    if (partnerName) {
      return `Chat with ${partnerName}`;
    }
    return "Meeting Chat";
  }, [partnerName]);

  return (
    <div className="flex h-full max-h-screen flex-col overflow-hidden dark:bg-[#0B0F17] bg-white dark:text-white text-slate-900">
      <div className="flex items-center justify-between border-b dark:border-slate-800/80 border-slate-200 px-4 py-3 shrink-0 dark:bg-[#0B0F17]/90 bg-slate-50/90">
        <div>
          <div className="text-lg font-semibold dark:text-white text-slate-900">{headerLabel}</div>
          <div className="text-xs dark:text-slate-400 text-slate-500">{myName} • {myLanguage}</div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="dark:hover:bg-slate-800/60 hover:bg-slate-200 dark:text-slate-300 text-slate-700">
          <X size={18} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed dark:border-slate-800 border-slate-300 dark:bg-slate-900/60 bg-slate-50 backdrop-blur-xl px-6 py-10 text-center dark:text-slate-400 text-slate-600">
            <MessageCircle className="mb-3 h-8 w-8 text-indigo-500 dark:text-indigo-400" />
            <div className="text-sm font-medium dark:text-slate-200 text-slate-800">Start the conversation.</div>
            <div className="mt-1 text-xs dark:text-slate-400 text-slate-500">Messages will be translated into your partner’s selected language.</div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === "local" || message.isLocal}
            />
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t dark:border-slate-800/80 border-slate-200 p-3 shrink-0 dark:bg-[#0B0F17]/90 bg-slate-50/90">
        <div className="flex items-center gap-2">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message"
            className="dark:bg-slate-900/60 bg-white dark:border-slate-800 border-slate-300 dark:text-white text-slate-900 dark:placeholder:text-slate-400 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
            disabled={isSending}
          />
          <Button
            onClick={handleSend}
            disabled={isSending || !draft.trim()}
            size="icon"
            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 rounded-xl"
          >
            {isSending ? <span className="text-xs">…</span> : <Send size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
