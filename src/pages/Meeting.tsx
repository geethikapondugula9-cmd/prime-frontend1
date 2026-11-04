// src/pages/Meeting.tsx
// WebSocket-based Meeting Page with Twilio Video

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { joinRoom, BASE_URL } from "@/lib/utils";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useTwilioVideo } from "@/hooks/useTwilioVideo";
import { useUsername } from "@/hooks/useUsername";

import { Globe, Users, MessageSquare, X, Phone } from "lucide-react";

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
  const [myVoice, setMyVoice] = useState(() => localStorage.getItem("myVoice") || "male");
  // Use sessionStorage first (set during room creation/join), then Supabase username, then fallback
  const myName = sessionStorage.getItem("meetingUsername") || username || "You";

  useEffect(() => {
    const storedVoice = localStorage.getItem("myVoice") || "male";
    setMyVoice(storedVoice);
    localStorage.setItem("myVoice", storedVoice);
  }, []);

  // UI state
  const [status, setStatus] = useState("Click Start to Join");
  const [started, setStarted] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTranslationOpen, setIsTranslationOpen] = useState(window.innerWidth >= 768);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isTranslationOn, setIsTranslationOn] = useState(true);
  const [showEndCallConfirm, setShowEndCallConfirm] = useState(false);
  // Meeting Duration Feature - Track meeting time after the meeting starts.
  const [meetingDuration, setMeetingDuration] = useState(0);

  // FEATURE: Track the actual start time to calculate elapsed meeting duration.
  const meetingStartTimeRef = useRef<number | null>(null);

  // Store the meeting summary before navigating to the Meeting Ended page.
  const [endedMeetingSummary, setEndedMeetingSummary] = useState<{
    duration: number;
    myName: string;
    myLanguage: string;
    partnerName: string;
    partnerLanguage: string;
  } | null>(null);

  useEffect(() => {
    if (!started) return;

    const timer = setInterval(() => {
      setMeetingDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started]);

  // Message notification popup state
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestMessageToast, setLatestMessageToast] = useState<{
    senderName: string;
    text: string;
  } | null>(null);

  // Partner state
  const [partnerName, setPartnerName] = useState("Partner");
  const [partnerLanguage, setPartnerLanguage] = useState<string | null>(null);
  const [partnerJoined, setPartnerJoined] = useState(false);
  const [showSameLangPopup, setShowSameLangPopup] = useState(true);

  // WebSocket hook
  const {
    status: wsStatus,
    isConnected,
    isAudioOn,
    partnerMuted,
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

      // FEATURE: Record the meeting start time when the other participant joins.
      if (meetingStartTimeRef.current === null) {
        meetingStartTimeRef.current = Date.now();
      }
    },
    onPartnerLeft: () => {
      setPartnerJoined(false);
    },


    // FEATURE: Automatically show the guest's summary when the creator ends the meeting.
    onMeetingEnded: (creatorName, creatorLanguage) => {

      // DEBUG: Check the guest's timer values when the creator ends the meeting.
      console.log("🔍 Meeting ended duration debug:", {
        meetingStartTime: meetingStartTimeRef.current,
        meetingDuration,
        started,
        currentTime: Date.now(),
      });

      // Calculate elapsed seconds from the recorded meeting start time.
      const startTime = meetingStartTimeRef.current;
      const actualDuration = startTime
        ? Math.max(0, Math.floor((Date.now() - startTime) / 1000))
        : meetingDuration;

      // Build the summary from the guest's perspective.
      const summary = {
        duration: actualDuration,
        myName: myName || "You",
        myLanguage: myLanguage || "Unknown",
        partnerName: creatorName || partnerName || "Creator",
        partnerLanguage: creatorLanguage || partnerLanguage || "Unknown",
      };

      // Save and log the summary before navigating.
      setEndedMeetingSummary(summary);
      console.log("Meeting Ended summary (guest):", summary);

      // Navigate directly without calling /leave-room again.
      navigate("/meeting-ended", {
        state: { meetingSummary: summary },
      });
    },



  });
  console.log("WebSocket connect function:", connect);

  // Language check: detect if both participants are of the same language
  const isSameLang = Boolean(
    partnerJoined &&
    partnerLanguage &&
    myLanguage &&
    myLanguage.toLowerCase().trim().split(/[\s-(]/)[0] === partnerLanguage.toLowerCase().trim().split(/[\s-(]/)[0]
  );

  // Automatically close live translation if both participants speak the same language
  useEffect(() => {
    if (isSameLang) {
      setIsTranslationOpen(false);
    }
  }, [isSameLang]);

  // Monitor incoming chat messages for notification popups and unread badge count
  const prevChatCountRef = useRef(chatMessages.length);
  useEffect(() => {
    if (chatMessages.length > prevChatCountRef.current) {
      const newMsg = chatMessages[chatMessages.length - 1];
      if (!isChatOpen && newMsg && newMsg.senderId !== "local") {
        setUnreadCount((prev) => prev + 1);
        setLatestMessageToast({
          senderName: newMsg.senderName || partnerName || "Participant",
          text: newMsg.translatedMessage || newMsg.originalMessage,
        });
      }
    }
    prevChatCountRef.current = chatMessages.length;
  }, [chatMessages, isChatOpen, partnerName]);

  // Auto-dismiss notification toast after 4.5 seconds
  useEffect(() => {
    if (!latestMessageToast) return;
    const timer = setTimeout(() => {
      setLatestMessageToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [latestMessageToast]);

  // Twilio Video hook (for video only - audio is handled by WebSocket)
  const {
    isConnected: isVideoConnected,
    isVideoOn,
    // Screen Sharing Feature - Get screen sharing state and control
    isScreenSharing,
    toggleScreenShare,
    localVideoTrack,
    localScreenTrack,
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

      // FEATURE: The creator may have deleted the room after ending the meeting.
      // Do not call endCall() here, because the meeting-ended event handles navigation.
      if (res.status === 404) {
        console.warn("Room not found; it may have already been ended by the creator.");
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

    // FEATURE: Record the meeting start time for accurate duration calculation.
    if (meetingStartTimeRef.current === null) {
      meetingStartTimeRef.current = Date.now();
    }

    setStarted(true);

    console.log("📞 Calling connect()");
    await connect();
    console.log("📞 connect() returned");

    console.log("📹 Calling connectVideo()");
    connectVideo();

    fetchRoomInfo();
  };


  // End call and capture the meeting summary before disconnecting.
  const endCall = async () => {
    // Prepare the meeting summary before leaving the meeting page.
    const summary = {
      // FEATURE: Calculate the actual elapsed meeting time when ending the call.
      duration: meetingStartTimeRef.current
        ? Math.max(0, Math.floor((Date.now() - meetingStartTimeRef.current) / 1000))
        : meetingDuration,
      myName: myName || "You",
      myLanguage: myLanguage || "Unknown",
      partnerName: partnerName || "Partner",
      partnerLanguage: partnerLanguage || "Unknown",
    };

    setEndedMeetingSummary(summary);

    // Debug: verify the summary values before navigating to Meeting Ended.
    console.log("Meeting Ended summary:", summary);

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
      navigate("/meeting-ended", {
        state: { meetingSummary: summary },
      });
    }
  };

  const toggleChatPanel = () => {
    setIsChatOpen((prev) => {
      const next = !prev;
      if (next) {
        setIsTranslationOpen(false);
        setUnreadCount(0);
        setLatestMessageToast(null);
      }
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
        muted: partnerMuted,
        level: partnerLevel,
        language: partnerLanguage,
        videoTrack: remoteVideoTrack,
        isVideoOn: Boolean(remoteVideoTrack),
      }]
      : []),
  ];

  // Screen Sharing Feature - Check active screen share track (local or remote)
  const activeScreenTrack = remoteScreenTrack || localScreenTrack;
  const isScreenSharingActive = Boolean(activeScreenTrack);
  const screenSharePresenterName = remoteScreenTrack
    ? `${partnerName}'s Screen`
    : `${myName}'s Screen`;

  // Pre-join view (Start Meeting for Host, Join Meeting for Guest)
  if (!started) {
    const isHost = role === "caller";
    console.log("🟢 Rendering PRE-JOIN screen - isHost:", isHost);
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#0B0F17] bg-slate-100 dark:text-white text-slate-900 p-6 transition-colors duration-200">
        <div className="max-w-md w-full dark:bg-slate-900/80 bg-white border dark:border-slate-800 border-slate-200 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <Globe className="w-8 h-8 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold dark:text-white text-slate-900 mb-2 tracking-tight">
              {isHost ? "Start Meeting" : "Join Meeting"}
            </h1>
            <p className="text-sm dark:text-slate-400 text-slate-600">
              Room: <span className="font-mono dark:text-slate-200 text-slate-800 font-semibold">{roomId}</span>
            </p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Badge variant="outline" className="border-indigo-500/40 text-indigo-600 dark:text-indigo-300 bg-indigo-500/10">
                {isHost ? "Host" : "Participant"}
              </Badge>
              <Badge variant="outline" className="border-indigo-500/40 text-indigo-600 dark:text-indigo-300 bg-indigo-500/10">
                Language: {myLanguage.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              size="lg"
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-6 shadow-lg shadow-indigo-600/30 transition-all duration-200"
              onClick={async () => {
                console.log("================================");
                console.log("START/JOIN BUTTON CLICKED");

                // FEATURE: Record the meeting start time for duration calculation.
                if (meetingStartTimeRef.current === null) {
                  meetingStartTimeRef.current = Date.now();
                }

                try {
                  await connect();
                } catch (e) {
                  console.error("connect() threw:", e);
                }

                try {
                  await connectVideo();
                } catch (e) {
                  console.error("connectVideo() threw:", e);
                }

                setStarted(true);
                fetchRoomInfo();
              }}
            >
              {isHost ? "Start Meeting" : "Join Meeting"}
            </Button>
          </div>
          <p className="text-xs dark:text-slate-400 text-slate-500 font-medium">{status}</p>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col dark:bg-[#0B0F17] bg-slate-100 dark:text-white text-slate-900 relative transition-colors duration-200">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b dark:border-slate-800/80 border-slate-200/80 dark:bg-[#0B0F17]/80 bg-white/90 backdrop-blur-xl shrink-0 transition-colors shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold dark:text-white text-slate-900 tracking-tight">PrimeTalker Meeting</div>
            <div className="text-sm dark:text-slate-400 text-slate-600 font-medium">Room: {roomId}</div>
            {/* Meeting Duration Feature - Display the running meeting timer. */}
            <div className="text-xs font-mono dark:text-indigo-400 text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md mt-0.5 inline-block">
              {String(Math.floor(meetingDuration / 60)).padStart(2, "0")}:
              {String(meetingDuration % 60).padStart(2, "0")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge className={isConnected ? "bg-emerald-600 text-white shadow-sm" : "dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300"}>
            {status}
          </Badge>
          <Button variant="ghost" onClick={toggleTranslationPanel} className="dark:text-slate-200 text-slate-700 dark:hover:bg-slate-800/60 hover:bg-slate-100 rounded-xl transition-colors">
            <Users />
          </Button>
        </div>
      </header>

      {/* Same Language Direct Audio Bypassed Notification Popup */}
      {isSameLang && showSameLangPopup && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] dark:bg-slate-900/95 bg-white/95 backdrop-blur-xl border border-indigo-500/30 dark:border-indigo-500/40 shadow-2xl rounded-2xl p-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold text-base shadow-sm">
                ⚡
              </div>
              <div>
                <div className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                  Same Language Mode (Direct Audio)
                </div>
                <p className="text-xs dark:text-slate-300 text-slate-600 mt-1 leading-relaxed">
                  Both participants speak <span className="font-semibold dark:text-indigo-400 text-indigo-600">{myLanguage.toUpperCase()}</span>. Audio translation is bypassed for direct real-time communication.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSameLangPopup(false)}
              className="dark:text-slate-400 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 overflow-hidden relative min-h-0">
        <main className="flex-1 p-2 sm:p-4 overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-2 lg:gap-4 justify-center items-stretch min-h-0 pb-24">
            {participantsToRender.length === 0 ? (
              <div className="dark:text-slate-400 text-slate-500 flex items-center justify-center w-full font-medium">
                Waiting for participants...
              </div>
            ) : isScreenSharingActive ? (
              /*
               * Dedicated Screen Sharing Tile (Google Meet Style).
               * Displayed whenever a user (local presenter or remote participant) shares their screen.
               */
              <div className="flex flex-1 min-h-0 min-w-0 gap-2 lg:gap-3">
                {/* Participant list column */}
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

                {/* Main Screen Share Tile */}
                <div className="flex-1 min-w-0 min-h-0 overflow-hidden rounded-xl">
                  <ParticipantTile
                    name={screenSharePresenterName}
                    isLocal={!remoteScreenTrack}
                    muted={true}
                    level={0}
                    language={undefined}
                    videoTrack={activeScreenTrack}
                    isVideoOn={true}
                    isScreenShare={true}
                  />
                </div>
              </div>
            ) : (
              /* Normal Participant Layout */
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

          {/* Interim transcripts - user's own interim text */}
          {interimText && (
            <div className="mt-2 max-h-24 overflow-y-auto flex flex-col gap-2 max-w-2xl mx-auto w-full px-4 shrink-0">
              <div className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-200 px-4 py-2.5 rounded-2xl rounded-tr-sm self-end max-w-[80%] animate-pulse shadow-md text-sm font-medium">
                {interimText}...
              </div>
            </div>
          )}

          {/* Video Error Message */}
          {videoError && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl max-w-2xl mx-auto w-full text-center text-sm shadow-md shrink-0 font-medium">
              <span className="font-semibold block mb-1">Video Error:</span>
              {videoError}
            </div>
          )}

          {/* Waiting hint */}
          {!partnerJoined && (
            <div className="mt-4 text-center dark:text-slate-400 text-slate-500 shrink-0 font-medium text-sm">
              Waiting for partner to join…
            </div>
          )}

          {/* Message Notification Toast Popup */}
          {latestMessageToast && !isChatOpen && (
            <div
              onClick={() => {
                setIsChatOpen(true);
                setIsTranslationOpen(false);
                setUnreadCount(0);
                setLatestMessageToast(null);
              }}
              className="fixed left-4 sm:left-6 bottom-20 sm:bottom-24 z-50 max-w-xs sm:max-w-sm dark:bg-slate-900/95 bg-white/98 backdrop-blur-xl border border-indigo-500/40 shadow-2xl rounded-2xl p-3.5 flex items-start gap-3 cursor-pointer dark:hover:bg-slate-800/90 hover:bg-slate-50 transition-all animate-in slide-in-from-bottom-5 duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
                  <span>{latestMessageToast.senderName}</span>
                  <span className="text-[10px] dark:text-slate-400 text-slate-500 font-normal">New Message</span>
                </div>
                <p className="text-xs dark:text-slate-200 text-slate-800 font-medium truncate mt-0.5">
                  {latestMessageToast.text}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLatestMessageToast(null);
                }}
                className="dark:text-slate-400 text-slate-400 hover:text-slate-800 dark:hover:text-white p-0.5"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Floating control bar moved to bottom left */}
          <div className="fixed left-4 sm:left-6 bottom-4 sm:bottom-6 pointer-events-none z-30">
            <div className="pointer-events-auto dark:bg-slate-900/90 bg-white/95 backdrop-blur-xl rounded-full px-4 py-2.5 sm:px-5 sm:py-3 flex items-center gap-3 sm:gap-4 shadow-2xl border dark:border-slate-800/80 border-slate-200/90">
              <ControlBar
                isAudioOn={isAudioOn}
                isSpeakerOn={isSpeakerOn}
                isChatOpen={isChatOpen}
                isTranslationOpen={isTranslationOpen}
                isVideoOn={isVideoOn}
                unreadCount={unreadCount}
                // Screen Sharing Feature - Pass screen sharing state and action
                isScreenSharing={isScreenSharing}
                onToggleScreenShare={toggleScreenShare}
                onToggleMute={toggleMute}
                onToggleSpeaker={toggleSpeaker}
                onToggleChat={toggleChatPanel}
                onToggleTranslation={toggleTranslationPanel}
                onToggleVideo={toggleVideo}
                onEndCall={() => setShowEndCallConfirm(true)}
              />
            </div>
          </div>
        </main>

        {/* End Call Confirmation Modal Dialog */}
        {showEndCallConfirm && (
          <div
            className="fixed inset-0 bg-slate-950/40 dark:bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setShowEndCallConfirm(false)}
          >
            <div
              className="relative bg-white dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl shadow-slate-900/15 dark:shadow-black/70 space-y-5 animate-in zoom-in-95 duration-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowEndCallConfirm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header Icon Badge */}
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center pt-1">
                <div className="absolute inset-0 rounded-full bg-red-500/20 dark:bg-red-500/15 animate-ping opacity-25" />
                <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/15 border border-red-200/90 dark:border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center shadow-lg shadow-red-500/10 dark:shadow-red-900/30 relative">
                  <Phone className="w-7 h-7 rotate-[135deg]" />
                </div>
              </div>

              {/* Text Header & Subtext */}
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">
                  Exit Meeting
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Are you sure you want to exit the meeting?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowEndCallConfirm(false)}
                  className="flex-1 rounded-2xl bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80 py-3 text-sm font-semibold transition-all duration-150 shadow-sm active:scale-[0.98]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowEndCallConfirm(false);
                    endCall();
                  }}
                  className="flex-1 rounded-2xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg shadow-red-600/25 dark:shadow-red-600/40 border border-red-500/40 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.98]"
                >
                  Exit
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Backdrop for mobile */}
        {
          isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={closePanels}
            />
          )
        }

        {/* Chat Sidebar - Fixed overlay on mobile, inline on desktop when open */}
        {isSidebarOpen && (
          <aside
            className={`
              fixed lg:relative inset-y-0 right-0 z-50
              w-[85vw] sm:w-80 lg:w-96 h-full
              max-h-screen lg:max-h-full
              border-l dark:border-slate-800/80 border-slate-200/80 dark:bg-[#0B0F17] bg-white
              transition-transform duration-300 ease-in-out shrink-0 shadow-lg
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
        )}
      </div >
    </div >
  );
}
