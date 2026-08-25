// src/lib/utils.ts
// Utility functions for PrimeTalker

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// ---------------------------------------------
// 🔹 UI Utility Function
// ---------------------------------------------
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------
// 🔹 BACKEND BASE URL
// Use a relative git checkout in development so Vite proxy can forward requests to ngrok.
// In production, use VITE_API_URL or fallback to the ngrok host.
// ---------------------------------------------
export const BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_URL || "https://live-translation-backend.azurewebsites.net";
console.log("BASE_URL:", BASE_URL || "[relative root]");

// ---------------------------------------------
// 🔹 WebSocket URL Helper
// ---------------------------------------------
export function getWebSocketURL(): string {
  const url = new URL(BASE_URL || window.location.origin);
  const wsProtocol = url.protocol === "https:" ? "wss:" : "ws:";
  const basePath = url.pathname.replace(/\/$/, "");
  return `${wsProtocol}//${url.host}${basePath}/audio-stream`;
}

// ---------------------------------------------
// 🔹 API Helpers
// ---------------------------------------------

// Basic GET helper
export async function apiGet(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true",
      "Accept": "application/json",
    },
  });
  if (!res.ok) {
    console.error(`GET ${endpoint} failed`, await res.text());
    throw new Error(`GET ${endpoint} failed`);
  }
  return res.json();
}

// Basic POST helper
export async function apiPost(endpoint: string, data: any) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error(`POST ${endpoint} failed`, await res.text());
    throw new Error(`POST ${endpoint} failed`);
  }
  return res.json();
}
// ---------------------------------------------
// 🔹 ROOM APIs
// ---------------------------------------------

// Create a new room
export function createRoom(language: string, voice?: string) {
  // Get username from sessionStorage (set when creating room) or fallback
  const creatorName = sessionStorage.getItem("meetingUsername") || "User";
  const creatorVoice = voice || localStorage.getItem("myVoice") || "male";

  // FEATURE: speaker voice belongs to the creator/speaker, not the listener; the backend must
  // persist creatorVoice and use it when generating translated TTS for that speaker.
  return apiPost("/create-room", {
    creatorLanguage: language,
    creatorName,
    creatorVoice,
  });
}

// Join an existing room
export function joinRoom(roomId: string, language: string, voice: string) {
  // Get username from sessionStorage (set when joining room) or fallback
  const participantName = sessionStorage.getItem("meetingUsername") || "User";
  return apiPost("/join-room", {
    roomId,
    participantLanguage: language,
    participantVoice: voice,
    participantName,
  });
}

// Get room info
export function getRoomInfo(roomId: string) {
  return apiGet(`/room-info?roomId=${roomId}`);
}

// Leave room
export function leaveRoom(roomId: string, userType: string) {
  return apiPost("/leave-room", { roomId, userType });
}
