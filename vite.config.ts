import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_URL || "https://live-translation-backend.azurewebsites.net";
  const wsTarget = apiTarget.startsWith("https")
    ? apiTarget.replace("https://", "wss://")
    : apiTarget.replace("http://", "ws://");
  console.log("================================");
  console.log("VITE_API_URL =", env.VITE_API_URL);
  console.log("apiTarget    =", apiTarget);
  console.log("wsTarget     =", wsTarget);
  console.log("================================");

  return {
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/create-room": { target: apiTarget, changeOrigin: true, secure: false },
        "/join-room": { target: apiTarget, changeOrigin: true, secure: false },
        "/leave-room": { target: apiTarget, changeOrigin: true, secure: false },
        "/room-info": { target: apiTarget, changeOrigin: true, secure: false },
        "/api": { target: apiTarget, changeOrigin: true, secure: false },
        "/health": { target: apiTarget, changeOrigin: true, secure: false },
        "/audio-stream": { target: wsTarget, ws: true, changeOrigin: true, secure: false },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
