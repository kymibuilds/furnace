import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer, Socket } from "socket.io";
import { registerUserEvents } from "./userEvents.ts";
import { registerChatEvents } from "./chatEvents.ts";
import conversation from "../models/conversation.ts";

dotenv.config();

export function initializeSocket(server: any): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  // auth middleware
  io.use((socket: Socket, next) => {
    console.log("Auth middleware triggered for socket:", socket.id);

    const token = socket.handshake.auth.token;
    console.log("Received token from client:", token);

    if (!token) {
      console.log("❌ No token provided");
      return next(new Error("authentication error: no token provided."));
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          console.log("❌ Token verification failed:", err.message);
          return next(new Error("authentication error: invalid token"));
        }

        console.log("✅ Token verified. Decoded payload:", decoded);

        socket.data = decoded;
        socket.data.userId = decoded.id;

        console.log("Socket user data set:", socket.data);

        next();
      }
    );
  });

  // on socket connection
  io.on("connection", async (socket: Socket) => {
    console.log(
      `🎉 New connection: ${socket.data.userId}, username: ${socket.data.name}, socketId: ${socket.id}`
    );

    // register events
    registerChatEvents(io, socket);
    registerUserEvents(io, socket);

    //join all the conversations the user is part of
    try {
      const conversations = await conversation
        .find({
          participants: socket.data.userId,
        })
        .select("_id");

        conversations.forEach(conversation=>{
          socket.join(conversation._id.toString());
        });
    } catch (error: any) {
      console.log("error", error);
    }

    socket.on("disconnect", (reason) => {
      console.log(
        `⚠️ User disconnected: ${socket.data.userId}, reason: ${reason}`
      );
    });
  });

  return io;
}
