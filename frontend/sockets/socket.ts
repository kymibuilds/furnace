import { API_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
  console.log("connectSocket() called");

  // Get token from storage
  const token = await AsyncStorage.getItem("token");
  console.log("Retrieved token from AsyncStorage:", token);

  if (!token) {
    throw new Error("No token found. User must login first");
  }

  // Only create a new socket if one doesn't exist
  if (!socket) {
    console.log("Creating new socket instance to:", API_URL);

    socket = io(API_URL, {
      auth: { token },
      transports: ["websocket"], // force websocket in RN
      autoConnect: true,
    });

    console.log("Socket created, waiting for connect...");

    await new Promise<void>((resolve, reject) => {
      socket?.on("connect", () => {
        console.log("✅ Socket connected with id:", socket?.id);
        resolve();
      });

      socket?.on("connect_error", (err) => {
        console.error("❌ Socket connect_error:", err.message);
        console.error("Full error object:", err);
        reject(err);
      });

      socket?.on("disconnect", (reason) => {
        console.warn("⚠️ Socket disconnected:", reason);
      });
    });

    // Optional: Log any incoming events globally for debugging
    socket.onAny((event, ...args) => {
      console.log(`Received socket event: "${event}"`, args);
    });
  } else {
    console.log("Reusing existing socket:", socket.id);
  }

  return socket;
}

export function getSocket(): Socket | null {
  console.log("getSocket() called, returning:", socket?.id ?? null);
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    console.log("disconnectSocket() called, closing socket:", socket.id);
    socket.disconnect();
    socket = null;
  } else {
    console.log("disconnectSocket() called, but no active socket");
  }
}
