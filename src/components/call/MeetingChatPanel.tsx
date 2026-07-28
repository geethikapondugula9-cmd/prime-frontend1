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
    <div className="flex h-full max-h-screen flex-col overflow-hidden bg-slate-900 text-white">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 shrink-0">
        <div>
          <div className="text-lg font-semibold">{headerLabel}</div>
          <div className="text-xs text-slate-400">{myName} • {myLanguage}</div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-10 text-center text-slate-400">
            <MessageCircle className="mb-3 h-8 w-8 text-slate-500" />
            <div className="text-sm">Start the conversation.</div>
            <div className="mt-1 text-xs">Messages will be translated into your partner’s selected language.</div>
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

      <div className="border-t border-slate-800 p-3 shrink-0">
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
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            disabled={isSending}
          />
          <Button onClick={handleSend} disabled={isSending || !draft.trim()} size="icon">
            {isSending ? <span className="text-xs">…</span> : <Send size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
