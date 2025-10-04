import { API_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
  console.log("connectSocket() called");

  const token = await AsyncStorage.getItem("token"); // <-- must be awaited
  console.log("Retrieved token from AsyncStorage:", token);

  if (!token) {
    throw new Error("No token found. User must login first");
  }

  if (!socket) {
    console.log("Creating new socket instance to:", API_URL);

    socket = io(API_URL, {
      auth: { token },
      transports: ["websocket"], // force websocket in RN
    });

    console.log("Socket created, waiting for connect...");

    await new Promise((resolve, reject) => {
      socket?.on("connect", () => {
        console.log("✅ Socket connected:", socket?.id);
        resolve(true);
      });

      socket?.on("connect_error", (err) => {
        console.log("❌ Socket connect_error:", err.message);
        console.log("Full error object:", err);
        reject(err);
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Socket disconnected:", reason);
    });
  } else {
    console.log("Reusing existing socket:", socket.id);
  }

  return socket;
}

export function getSocket(): Socket | null {
  console.log("getSocket() called, returning:", socket?.id);
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
