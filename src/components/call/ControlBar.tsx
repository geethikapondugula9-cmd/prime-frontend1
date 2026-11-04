// src/components/call/ControlBar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, Volume2, VolumeX, MessageSquare, Globe, Video, VideoOff, MonitorUp, MonitorOff } from "lucide-react";

export default function ControlBar({
  isAudioOn,
  isSpeakerOn,
  isChatOpen,
  isTranslationOpen,
  isVideoOn = true,

  // Message notification count
  unreadCount = 0,
  isScreenSharing = false,
  onToggleScreenShare,
  onToggleMute,
  onToggleSpeaker,
  onToggleChat,
  onToggleTranslation,
  onToggleVideo,
  onEndCall,
}: {
  isAudioOn: boolean;
  isSpeakerOn: boolean;
  isChatOpen?: boolean;
  isTranslationOpen?: boolean;
  isVideoOn?: boolean;
  unreadCount?: number;
  // Screen Sharing Feature - Screen sharing control props
  isScreenSharing?: boolean;
  onToggleScreenShare?: () => void;
  onToggleMute: () => void;
  onToggleSpeaker: () => void;
  onToggleChat?: () => void;
  onToggleTranslation?: () => void;
  onToggleVideo?: () => void;
  onEndCall: () => void;
}) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Mic toggle */}
      <Button
        variant="ghost"
        onClick={onToggleMute}
        className={`rounded-full px-3.5 sm:px-4 py-2.5 transition-all duration-200 ${
          isAudioOn
            ? "dark:bg-slate-800/80 bg-slate-100 dark:hover:bg-slate-700/80 hover:bg-slate-200 dark:text-slate-200 text-slate-800 border dark:border-slate-700/60 border-slate-300"
            : "bg-red-600/90 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 border border-red-500/50"
        }`}
      >
        {isAudioOn ? <Mic className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />}
        <span className="hidden sm:inline">{isAudioOn ? "Mute" : "Unmute"}</span>
      </Button>

      {/* Video toggle */}
      {onToggleVideo && (
        <Button
          variant="ghost"
          onClick={onToggleVideo}
          className={`rounded-full px-3.5 sm:px-4 py-2.5 transition-all duration-200 ${
            isVideoOn
              ? "dark:bg-slate-800/80 bg-slate-100 dark:hover:bg-slate-700/80 hover:bg-slate-200 dark:text-slate-200 text-slate-800 border dark:border-slate-700/60 border-slate-300"
              : "bg-red-600/90 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 border border-red-500/50"
          }`}
        >
          {isVideoOn ? <Video className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />}
          <span className="hidden sm:inline">{isVideoOn ? "Video" : "Video Off"}</span>
        </Button>
      )}

      {/* Screen Share toggle */}
      {onToggleScreenShare && (
        <Button
          variant="ghost"
          onClick={onToggleScreenShare}
          className={`rounded-full px-3.5 sm:px-4 py-2.5 transition-all duration-200 ${
            isScreenSharing
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
              : "dark:bg-slate-800/80 bg-slate-100 dark:hover:bg-slate-700/80 hover:bg-slate-200 dark:text-slate-200 text-slate-800 border dark:border-slate-700/60 border-slate-300"
          }`}
          title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
        >
          {isScreenSharing ? <MonitorOff className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" /> : <MonitorUp className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />}
          <span className="hidden sm:inline">{isScreenSharing ? "Stop Sharing" : "Share Screen"}</span>
        </Button>
      )}

      {/* Speaker toggle */}
      <Button
        variant="ghost"
        onClick={onToggleSpeaker}
        className="rounded-full px-3.5 sm:px-4 py-2.5 dark:bg-slate-800/80 bg-slate-100 dark:hover:bg-slate-700/80 hover:bg-slate-200 dark:text-slate-200 text-slate-800 border dark:border-slate-700/60 border-slate-300 transition-all duration-200"
      >
        {isSpeakerOn ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />}
        <span className="hidden sm:inline">{isSpeakerOn ? "Speaker" : "Speaker Off"}</span>
      </Button>

      {/* End Call button */}
      <Button
        variant="destructive"
        onClick={onEndCall}
        className="rounded-full px-4 sm:px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/40 border border-red-500/60 transition-all duration-200 font-semibold"
      >
        <Phone className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2 rotate-[135deg]" />
        <span className="hidden sm:inline">End Call</span>
      </Button>

      {/* Chat & Translation Electric Indigo Action Buttons */}
      <div className="ml-1 sm:ml-2 flex items-center gap-2 border-l dark:border-slate-800/80 border-slate-300 pl-2 sm:pl-3">
        <Button
          variant="ghost"
          onClick={onToggleChat}
          className={`rounded-full px-3.5 py-2.5 relative transition-all duration-300 ${
            isChatOpen
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400/40 scale-105"
              : "dark:bg-slate-800/80 bg-slate-100 dark:hover:bg-indigo-900/40 hover:bg-slate-200 dark:text-slate-300 text-slate-700 hover:text-indigo-600 border dark:border-slate-700/60 border-slate-300"
          }`}
          title="Toggle Chat"
        >
          <MessageSquare className="w-5 h-5 dark:text-white text-slate-800" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-red-600 text-[11px] font-extrabold text-white shadow-lg ring-2 ring-[#0B0F17] animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={onToggleTranslation}
          className={`rounded-full px-3.5 py-2.5 transition-all duration-300 ${
            isTranslationOpen
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400/40 scale-105"
              : "dark:bg-slate-800/80 bg-slate-100 dark:hover:bg-indigo-900/40 hover:bg-slate-200 dark:text-slate-300 text-slate-700 hover:text-indigo-600 border dark:border-slate-700/60 border-slate-300"
          }`}
          title="Toggle Translation"
        >
          <Globe className="w-5 h-5 dark:text-white text-slate-800" />
        </Button>
      </div>
    </div>
  );
}


