// src/pages/Meeting.tsx
// WebSocket-based Meeting Page with Twilio Video

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { joinRoom, BASE_URL } from "@/lib/utils";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useTwilioVideo } from "@/hooks/useTwilioVideo";
import { useUsername } from "@/hooks/useUsername";

import { Globe, Users } from "lucide-react";

import ParticipantTile from "@/components/call/ParticipantTile";
import ControlBar from "@/components/call/ControlBar";
import RightPanel from "@/components/call/RightPanel";
import MeetingChatPanel, { type ChatMessage } from "@/components/call/MeetingChatPanel";

const ROOMINFO_POLL = 2000;

export default function Meeting() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { username } = useUsername();

  const role = (localStorage.getItem("role") || "caller") as "caller" | "receiver";
  const myLanguage = localStorage.getItem("myLanguage") || "en";
  const myVoice = localStorage.getItem("myVoice") || "male";
  // Use sessionStorage first (set during room creation/join), then Supabase username, then fallback
  const myName = sessionStorage.getItem("meetingUsername") || username || "You";

  // UI state
  const [status, setStatus] = useState("Click Start to Join");
  const [started, setStarted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTranslationOpen, setIsTranslationOpen] = useState(window.innerWidth >= 768);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isTranslationOn, setIsTranslationOn] = useState(true);

  // Partner state
  const [partnerName, setPartnerName] = useState("Partner");
  const [partnerLanguage, setPartnerLanguage] = useState<string | null>(null);
  const [partnerJoined, setPartnerJoined] = useState(false);

  // WebSocket hook
  const {
    status: wsStatus,
    isConnected,
    isAudioOn,
    localLevel,
    partnerLevel,
    transcripts,
    interimText,
    partnerInterimText,
    chatMessages,
    isChatSending,
    connect,
    disconnect,
    toggleMute,
    sendChatMessage,
  } = useWebSocket({
    roomId: roomId || "",
    userType: role,
    myLanguage,
    myVoice,
    myName,
    isSpeakerOn,
    onPartnerJoined: (name, language) => {
      setPartnerJoined(true);
      setPartnerName(name || "Partner");
      setPartnerLanguage(language || null);
    },
    onPartnerLeft: () => {
      setPartnerJoined(false);
    },
  });
  console.log("WebSocket connect function:", connect);

  // Twilio Video hook (for video only - audio is handled by WebSocket)
  const {
    isConnected: isVideoConnected,
    isVideoOn,
    // Screen Sharing Feature - Get screen sharing state and control
    isScreenSharing,
    toggleScreenShare,
    localVideoTrack,
    remoteVideoTrack,
    // Screen Sharing Feature - Receive the remote participant's shared screen
    remoteScreenTrack,
    error: videoError,
    connect: connectVideo,
    disconnect: disconnectVideo,
    toggleVideo,
  } = useTwilioVideo({
    roomId: roomId || "",
    identity: `${myName}-${role}`,
  });

  // Update status from WebSocket
  useEffect(() => {
    setStatus(wsStatus);
  }, [wsStatus]);

  // Fetch room info
  const fetchRoomInfo = useCallback(async () => {
    console.log("================================");
    console.log("🚀 fetchRoomInfo CALLED");
    console.log("Room ID:", roomId);
    console.log("BASE_URL:", BASE_URL);
    console.log("================================");
    try {
      if (!roomId) return;
      console.log("BASE_URL =", BASE_URL);
      console.log("Fetching =", `${BASE_URL}/room-info?roomId=${roomId}`);
      const url = `${BASE_URL}/room-info?roomId=${roomId}`;

      console.log("Fetching:", url);

      const res = await fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Accept": "application/json",
        },
      });

      console.log("Status:", res.status);
      console.log("Content-Type:", res.headers.get("content-type"));

      if (res.status === 404) {
        endCall();
        return;
      }

      const json = await res.json();
      setPartnerJoined(Boolean(json.participantLanguage));

      if (role === "caller" && json.participantName) {
        setPartnerName(json.participantName);
        setPartnerLanguage(json.participantLanguage || null);
      } else if (role === "receiver" && json.creatorName) {
        setPartnerName(json.creatorName);
        setPartnerLanguage(json.creatorLanguage || null);
      }
    } catch (err) {
      console.warn("room-info fetch failed", err);
    }
  }, [roomId, role]);

  // Poll room info
  useEffect(() => {
    console.log("================================");
    console.log("started =", started);
    console.log("================================");
    if (!started) return;
    fetchRoomInfo();
    const id = window.setInterval(fetchRoomInfo, ROOMINFO_POLL);
    return () => window.clearInterval(id);
  }, [started, fetchRoomInfo]);

  // Join room as receiver
  useEffect(() => {
    if (started && role === "receiver" && roomId) {
      joinRoom(roomId, myLanguage, myVoice)
        .then(() => console.log("Receiver joined room successfully"))
        .catch((err) => console.error("joinRoom failed:", err));
    }
  }, [started, role, roomId, myLanguage, myVoice]);

  // Start meeting
  const startMeeting = async () => {
    console.log("🚀 startMeeting() called");

    setStarted(true);

    console.log("📞 Calling connect()");
    await connect();
    console.log("📞 connect() returned");

    console.log("📹 Calling connectVideo()");
    connectVideo();

    fetchRoomInfo();
  };

  // End call
  const endCall = async () => {
    try {
      if (roomId) {
        await fetch(`${BASE_URL}/leave-room`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, userType: role }),
        }).catch(console.warn);
      }

      disconnect(); // Audio WebSocket
      disconnectVideo(); // Twilio Video
    } catch (e) {
      console.warn("endCall error", e);
    } finally {
      setPartnerJoined(false);
      navigate("/rooms");
    }
  };

  const toggleChatPanel = () => {
    setIsChatOpen((prev) => {
      const next = !prev;
      if (next) setIsTranslationOpen(false);
      return next;
    });
  };

  const toggleTranslationPanel = () => {
    setIsTranslationOpen((prev) => {
      const next = !prev;
      if (next) setIsChatOpen(false);
      return next;
    });
  };

  const closePanels = () => {
    setIsChatOpen(false);
    setIsTranslationOpen(false);
  };

  const isSidebarOpen = isChatOpen || isTranslationOpen;

  // Toggle speaker
  const toggleSpeaker = () => {
    setIsSpeakerOn((s) => {
      const next = !s;
      const audios = Array.from(document.querySelectorAll("audio")) as HTMLAudioElement[];
      audios.forEach((a) => {
        try {
          a.volume = next ? 1 : 0;
        } catch { }
      });
      return next;
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      disconnectVideo();
    };
  }, [disconnect, disconnectVideo]);

  // Convert transcripts for RightPanel
  const formattedTranscripts = transcripts.map((t) => ({
    originalText: t.originalText,
    translatedText: t.translatedText,
    userType: t.fromUser, // RightPanel expects userType
    sourceLang: t.fromLanguage,
    targetLang: t.toLanguage,
    timestamp: t.timestamp,
  }));

  // Participants with video tracks
  const participantsToRender = [
    {
      id: "you",
      name: myName,
      isLocal: true,
      muted: !isAudioOn,
      level: localLevel,
      language: myLanguage,
      videoTrack: localVideoTrack,
      isVideoOn: isVideoOn,
    },
    ...(partnerJoined
      ? [{
        id: "partner",
        name: partnerName,
        isLocal: false,
        muted: false,
        level: partnerLevel,
        language: partnerLanguage,
        videoTrack: remoteVideoTrack,
        isVideoOn: true, // Remote video is always considered "on" if track exists
      }]
      : []),
  ];

  // Screen Sharing Feature - Only the participant receiving a remote screen share
  // switches to the expanded viewer layout. The person sharing keeps the normal layout.
  const isViewingScreenShare = Boolean(remoteScreenTrack);

  // Pre-join view
  if (!started) {
    console.log("🟢 Rendering PRE-JOIN screen");
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-6">
        <div className="max-w-xl w-full text-center space-y-6">
          <h1 className="text-3xl font-semibold text-white">
            Join Meeting
          </h1>
          <p className="text-slate-300">
            Room: {roomId} • {role} • {myLanguage}
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={async () => {
                console.log("================================");
                console.log("BUTTON CLICKED");
                console.log("connect =", connect);
                console.log("connectVideo =", connectVideo);

                try {
                  console.log("Calling connect()");
                  await connect();
                  console.log("connect() finished");
                } catch (e) {
                  console.error("connect() threw:", e);
                }

                try {
                  console.log("Calling connectVideo()");
                  await connectVideo();
                  console.log("connectVideo() finished");
                } catch (e) {
                  console.error("connectVideo() threw:", e);
                }

                setStarted(true);
                fetchRoomInfo();
              }}
            >
              Start Meeting
            </Button>
          </div>
          <p className="text-slate-400 mt-2">{status}</p>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold">PrimeTalker Meeting</div>
            <div className="text-sm text-slate-400">Room: {roomId}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={isConnected ? "bg-green-600" : "bg-slate-800"}>
            {status}
          </Badge>
          <Button variant="ghost" onClick={toggleTranslationPanel} className="text-slate-200">
            <Users />
          </Button>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 p-2 sm:p-4 overflow-hidden flex flex-col">
          <div className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-2 lg:gap-4 justify-center items-stretch min-h-0 pb-24">
            {participantsToRender.length === 0 ? (
              <div className="text-slate-400 flex items-center justify-center w-full">
                Waiting for participants...
              </div>
            ) : isViewingScreenShare ? (
              /*
               * Screen Sharing Feature - Viewer layout.
               * Only the participant receiving the remote screen share sees this layout.
               * The sharer's own layout remains unchanged because remoteScreenTrack is absent there.
               */
              <div className="flex flex-1 min-h-0 min-w-0 gap-2 lg:gap-3">

                {/* Screen Sharing Feature - Keep both participants visible
        in a compact vertical column while viewing the shared screen. */}
                <div className="w-[28%] max-w-[280px] min-w-[180px] flex flex-col gap-2 min-h-0">

                  {participantsToRender.map((p) => (
                    <div
                      key={p.id}
                      className="flex-1 min-h-0 min-w-0"
                    >
                      <ParticipantTile
                        name={p.name}
                        isLocal={p.isLocal}
                        muted={p.muted}
                        level={p.level}
                        language={p.language || undefined}
                        videoTrack={p.videoTrack}
                        isVideoOn={p.isVideoOn}
                      />
                    </div>
                  ))}

                </div>

                {/* Screen Sharing Feature - Give the received screen the
        primary viewing area without changing the translation sidebar. */}
                <div className="flex-1 min-w-0 min-h-0 overflow-hidden rounded-xl">

                  <ParticipantTile
                    name="Shared Screen"
                    isLocal={false}
                    muted={true}
                    level={0}
                    language={undefined}
                    videoTrack={remoteScreenTrack}
                    isVideoOn={true}

                    // Screen Sharing Feature - Render the remote shared screen as a dedicated viewer tile.
                    isScreenShare={true}
                  />

                </div>

              </div>
            ) : (
              /*
               * Screen Sharing Feature - Normal layout.
               * This is intentionally kept as the existing layout so the user
               * who is sharing their screen does not get moved into viewer mode.
               */
              <>
                {participantsToRender.map((p) => (
                  <div
                    key={p.id}
                    className="flex-1 w-full min-h-0 min-w-0"
                  >
                    <ParticipantTile
                      name={p.name}
                      isLocal={p.isLocal}
                      muted={p.muted}
                      level={p.level}
                      language={p.language || undefined}
                      videoTrack={p.videoTrack}
                      isVideoOn={p.isVideoOn}
                    />
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Interim transcripts */}
          {(interimText || partnerInterimText) && (
            <div className="mt-6 flex flex-col gap-2 max-w-2xl mx-auto w-full px-4">
              {partnerInterimText && (
                <div className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-3 rounded-2xl rounded-tl-sm self-start max-w-[80%] animate-pulse shadow-md">
                  <div className="text-xs text-slate-500 mb-1 font-medium">{partnerName} is typing...</div>
                  {partnerInterimText}...
                </div>
              )}
              {interimText && (
                <div className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-200 px-4 py-3 rounded-2xl rounded-tr-sm self-end max-w-[80%] animate-pulse shadow-md">
                  {interimText}...
                </div>
              )}
            </div>
          )}

          {/* Video Error Message */}
          {videoError && (
            <div className="mt-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl max-w-2xl mx-auto w-full text-center text-sm shadow-md">
              <span className="font-semibold block mb-1">Video Error:</span>
              {videoError}
            </div>
          )}

          {/* Waiting hint */}
          {!partnerJoined && (
            <div className="mt-8 text-center text-slate-400">
              Waiting for partner to join…
            </div>
          )}

          {/* Floating control bar */}
          <div className="fixed left-0 right-0 bottom-6 flex justify-center pointer-events-none">
            <div className="pointer-events-auto bg-slate-800/80 backdrop-blur rounded-3xl px-6 py-3 flex items-center gap-6 shadow-2xl border border-slate-700">
              <ControlBar
                isAudioOn={isAudioOn}
                isSpeakerOn={isSpeakerOn}
                isChatOpen={isChatOpen}
                isTranslationOpen={isTranslationOpen}
                isVideoOn={isVideoOn}

                // Screen Sharing Feature - Pass screen sharing state and action
                isScreenSharing={isScreenSharing}
                onToggleScreenShare={toggleScreenShare}
                onToggleMute={toggleMute}
                onToggleSpeaker={toggleSpeaker}
                onToggleChat={toggleChatPanel}
                onToggleTranslation={toggleTranslationPanel}
                onToggleVideo={toggleVideo}
                onEndCall={endCall}
              />
            </div>
          </div>
        </main>

        {/* Backdrop for mobile */}
        {
          isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closePanels}
            />
          )
        }

        {/* Chat Sidebar - Fixed overlay on mobile, inline on desktop */}
        <aside
          className={`
            fixed lg:relative inset-y-0 right-0 z-50
            w-[85vw] sm:w-80 lg:w-96 h-full
            max-h-screen lg:max-h-full
            border-l border-slate-800 bg-slate-900 
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {isChatOpen ? (
            <MeetingChatPanel
              messages={chatMessages as ChatMessage[]}
              onClose={closePanels}
              onSendMessage={(message) => sendChatMessage(message)}
              isSending={isChatSending}
              myLanguage={myLanguage}
              myName={myName}
              partnerName={partnerName}
            />
          ) : (
            <RightPanel
              transcripts={formattedTranscripts}
              onClose={closePanels}
              isTranslationOn={isTranslationOn}
              toggleTranslation={() => setIsTranslationOn((s) => !s)}
            />
          )}
        </aside>
      </div >


    </div >
  );
}
