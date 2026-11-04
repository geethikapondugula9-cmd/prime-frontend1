// src/components/call/ParticipantTile.tsx
import React, { useRef, useEffect } from "react";
import MicLevel from "./MicLevel";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { LocalVideoTrack, RemoteVideoTrack } from "twilio-video";

// Language display names
const languageNames: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German", pt: "Portuguese",
  it: "Italian", ru: "Russian", zh: "Chinese", ja: "Japanese", ko: "Korean",
  ar: "Arabic", hi: "Hindi", te: "Telugu", ta: "Tamil", bn: "Bengali",
  gu: "Gujarati", kn: "Kannada", ml: "Malayalam", mr: "Marathi", pa: "Punjabi",
  vi: "Vietnamese", th: "Thai", id: "Indonesian", ms: "Malay", fil: "Filipino",
  tr: "Turkish", nl: "Dutch", pl: "Polish", sv: "Swedish", da: "Danish",
  no: "Norwegian", fi: "Finnish", el: "Greek", cs: "Czech", ro: "Romanian",
  hu: "Hungarian", uk: "Ukrainian", he: "Hebrew", fa: "Persian", af: "Afrikaans",
};

// Language flag emojis (approximate)
const languageFlags: Record<string, string> = {
  en: "🇺🇸", es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪", pt: "🇧🇷", it: "🇮🇹", ru: "🇷🇺",
  zh: "🇨🇳", ja: "🇯🇵", ko: "🇰🇷", ar: "🇸🇦", hi: "🇮🇳", te: "🇮🇳", ta: "🇮🇳",
  bn: "🇮🇳", gu: "🇮🇳", kn: "🇮🇳", ml: "🇮🇳", mr: "🇮🇳", pa: "🇮🇳",
  vi: "🇻🇳", th: "🇹🇭", id: "🇮🇩", tr: "🇹🇷", nl: "🇳🇱", pl: "🇵🇱",
};

export default function ParticipantTile({
  name,
  isLocal = false,
  muted = false,
  level = 0,
  language,
  videoTrack,
  isVideoOn = true,

  // Screen Sharing Feature - Identifies when this tile is rendering a shared screen.
  isScreenShare = false,
}: {
  name: string;
  isLocal?: boolean;
  muted?: boolean;
  level?: number;
  language?: string;
  videoTrack?: LocalVideoTrack | RemoteVideoTrack | null;
  isVideoOn?: boolean;
  // Screen Sharing Feature - Optional flag so normal participant tiles remain unchanged.
  isScreenShare?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attach video track to video element
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !videoTrack) return;

    // Attach the track to the video element
    const attachedElement = videoTrack.attach(videoElement);
    console.log("📹 Video track attached to element");

    return () => {
      videoTrack.detach(videoElement);
      console.log("📹 Video track detached from element");
    };
  }, [videoTrack]);

  const langCode = language?.split("-")[0] || "en";
  const langDisplay = languageNames[langCode] || language || "Unknown";
  const langFlag = languageFlags[langCode] || "🌐";

  // Generate avatar initials
  const initials = name.split(" ").map(s => s[0]?.toUpperCase()).slice(0, 2).join("") || "?";

  // Determine if speaking based on audio level
  const isSpeaking = !muted && level > 15;

  const hasVideo = videoTrack && isVideoOn;

  return (
    <div
      className={`
        w-full h-full relative rounded-2xl overflow-hidden flex flex-col
        dark:bg-slate-900/60 bg-white backdrop-blur-xl
        border-2 transition-all duration-300 shadow-xl
        ${isSpeaking ? "border-indigo-500 shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/30" : "dark:border-slate-800 border-slate-200"}
      `}
    >
      {/* Video element - always render if videoTrack exists so attach() isn't disrupted */}
      {videoTrack && (
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal} // Mute local video to prevent echo
            className={`w-full h-full ${isScreenShare
              ? "object-contain dark:bg-[#0B0F17] bg-slate-900"
              : `object-contain dark:bg-[#0B0F17] bg-slate-900 ${isLocal ? "scale-x-[-1]" : ""}`
              }`}
          />
        </div>
      )}

      {/* Top Right Mic Off Floating Badge */}
      {muted && (
        <div className="absolute top-3 right-3 z-30 bg-red-600/90 text-white border border-red-500/50 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md animate-in fade-in duration-200">
          <MicOff size={13} />
          <span>Mic Off</span>
        </div>
      )}

{/* Name and selected language displayed on the meeting tile */}
      {isVideoOn && (
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <span className="bg-black/60 px-3 py-1 rounded-full text-white text-sm font-medium">
            {name} {isLocal && "(You)"}
          </span>

          <span className="bg-black/60 px-3 py-1 rounded-full text-white text-sm font-medium">
            {langDisplay}
          </span>
        </div>
      )}

      {/* Avatar overlay when video is OFF */}
      {!isVideoOn && (
        <div className="absolute inset-0 w-full h-full dark:bg-[#0B0F17]/90 bg-slate-100/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 z-20">
          {/* Avatar circle */}
          <div
            className={`
              w-24 h-24 rounded-full flex items-center justify-center 
              text-3xl font-bold text-white mb-4
              transition-all duration-300 shadow-xl
              ${isLocal
                ? "bg-indigo-600 shadow-indigo-600/30 border border-indigo-400/30"
                : "dark:bg-slate-800 bg-slate-300 dark:border-slate-700/80 border-slate-400 dark:text-indigo-300 text-indigo-700"
              }
              ${isSpeaking ? "ring-4 ring-indigo-500/50 scale-105" : ""}
            `}
          >
            {initials}
          </div>

          {/* Name */}
          <h3 className="dark:text-white text-slate-900 text-xl font-semibold mb-1">
            {name}
            {isLocal && <span className="text-indigo-500 dark:text-indigo-400 text-sm ml-2">(You)</span>}
          </h3>

          {/* Language */}
          <div className="flex items-center gap-2 dark:text-slate-300 text-slate-600">
            <span className="text-lg">{langFlag}</span>
            <span className="text-sm">{langDisplay}</span>
          </div>

          {/* Status indicators (Camera Off / Mic Off) */}
          <div className="mt-3 flex items-center gap-2 flex-wrap justify-center">
            <div className="flex items-center gap-1.5 dark:text-slate-400 text-slate-600 text-xs px-2.5 py-1 rounded-full dark:bg-slate-800/80 bg-slate-200 border dark:border-slate-700/60 border-slate-300 font-medium">
              <VideoOff size={13} />
              <span>Camera Off</span>
            </div>
            {muted && (
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 font-semibold shadow-sm">
                <MicOff size={13} />
                <span>Mic Off</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom status bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t dark:from-[#0B0F17]/90 dark:via-[#0B0F17]/50 from-slate-900/80 via-slate-900/40 to-transparent p-4">
        <div className="flex items-center justify-between">
          {/* Mic status */}
          <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md border shadow-sm
            ${muted
              ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-600/20"
              : isSpeaking
                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                : "dark:bg-slate-800/60 bg-white/80 dark:border-slate-700/50 border-slate-200 dark:text-slate-400 text-slate-700"
            }
          `}>
            {muted ? (
              <>
                <MicOff size={16} />
                <span>Muted (Mic Off)</span>
              </>
            ) : (
              <>
                <Mic size={16} className={isSpeaking ? "animate-pulse" : ""} />
                <span>{isSpeaking ? "Speaking" : "Ready"}</span>
              </>
            )}
          </div>

          {/* Audio level indicator */}
          <MicLevel level={level} />
        </div>
      </div>

      {/* Speaking indicator ring animation */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-2xl border-2 border-indigo-500 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}

