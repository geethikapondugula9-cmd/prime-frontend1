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

  // Screen Sharing Feature - Receive screen sharing state and action
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
    <>
      <Button variant={isAudioOn ? "default" : "destructive"} onClick={onToggleMute} className="rounded-full px-4 py-3">
        {isAudioOn ? <Mic className="mr-2" /> : <MicOff className="mr-2" />} {isAudioOn ? "Mute" : "Unmute"}
      </Button>

      {onToggleVideo && (
        <Button variant={isVideoOn ? "default" : "destructive"} onClick={onToggleVideo} className="rounded-full px-4 py-3">
          {isVideoOn ? <Video className="mr-2" /> : <VideoOff className="mr-2" />} {isVideoOn ? "Video" : "Video Off"}
        </Button>
      )}
      {/* Screen Sharing Feature - Share or stop sharing the user's screen */}
      {onToggleScreenShare && (
        <Button
          variant={isScreenSharing ? "secondary" : "default"}
          onClick={onToggleScreenShare}
          className="rounded-full px-4 py-3"
          title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
        >
          {isScreenSharing ? (
            <MonitorOff className="mr-2" />
          ) : (
            <MonitorUp className="mr-2" />
          )}
          {isScreenSharing ? "Stop Sharing" : "Share Screen"}
        </Button>
      )}

      <Button variant="outline" onClick={onToggleSpeaker} className="rounded-full px-4 py-3">
        {isSpeakerOn ? <Volume2 className="mr-2" /> : <VolumeX className="mr-2" />} {isSpeakerOn ? "Speaker" : "Speaker Off"}
      </Button>

      <Button variant="destructive" onClick={onEndCall} className="rounded-full px-6 py-3">
        <Phone className="mr-2" /> End Call
      </Button>

      <div className="ml-4 flex gap-2">
        <Button
          variant={isChatOpen ? "secondary" : "ghost"}
          onClick={onToggleChat}
          className="rounded-full px-3 py-2"
          title="Toggle Chat"
        >
          <MessageSquare />
        </Button>
        <Button
          variant={isTranslationOpen ? "secondary" : "ghost"}
          onClick={onToggleTranslation}
          className="rounded-full px-3 py-2"
          title="Toggle Translation"
        >
          <Globe />
        </Button>
      </div>
    </>
  );
}

