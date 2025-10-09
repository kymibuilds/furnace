import { Server as SocketIOServer, Socket } from "socket.io";
import Conversation from "../models/conversation.ts";

interface NewConversationData {
  type: "dm" | "group";
  participants: string[];
  name?: string;
  avatar?: string;
}

export function registerChatEvents(io: SocketIOServer, socket: Socket) {
  // Fetch all conversations of the current user
  socket.on("getConversations", async () => {
    console.log("getConversations event triggered");

    try {
      const userId = socket.data.userId;
      if (!userId) {
        return socket.emit("getConversations", {
          success: false,
          msg: "Unauthorized",
        });
      }

      const conversations = await Conversation.find({
        participants: userId,
      })
        .populate({ path: "participants", select: "name avatar email" })
        .sort({ updatedAt: -1 })
        .lean();

      console.log("Fetched conversations:", conversations);

      socket.emit("getConversations", {
        success: true,
        data: conversations,
      });
    } catch (error: any) {
      console.log("getConversations error:", error);
      socket.emit("getConversations", {
        success: false,
        msg: "Failed to fetch conversations",
      });
    }
  });

  // Create a new DM or group conversation
  socket.on("newConversation", async (data: NewConversationData) => {
    console.log("newConversation event:", data);

    try {
      if (data.type === "dm") {
        // Check if DM already exists
        const existingConversation = await Conversation.findOne({
          type: "dm",
          participants: { $all: data.participants, $size: 2 },
        })
          .populate({ path: "participants", select: "name avatar email" })
          .lean();

        if (existingConversation) {
          console.log("DM already exists:", existingConversation);
          return socket.emit("newConversation", {
            success: true,
            data: { ...existingConversation, isNew: false },
          });
        }

        // Create new DM
        const newConversation = await Conversation.create({
          type: "dm",
          participants: data.participants,
          name: data.name || "",
          avatar: data.avatar || "",
          createdBy: socket.data.userId,
        });

        const populatedConversation = await Conversation.findById(newConversation._id)
          .populate({ path: "participants", select: "name avatar email" })
          .lean();

        console.log("Created new DM:", populatedConversation);

        // Make all online participants join the room
        const connectedSockets = Array.from(io.sockets.sockets.values()).filter((s) =>
          data.participants.includes(s.data.userId)
        );

        connectedSockets.forEach((s) => s.join(newConversation._id.toString()));

        console.log(
          "Participants joined DM room:",
          connectedSockets.map((s) => s.data.userId)
        );

        socket.emit("newConversation", {
          success: true,
          data: { ...populatedConversation, isNew: true },
        });
      } else if (data.type === "group") {
        if (!data.name || !data.participants || data.participants.length === 0) {
          return socket.emit("newConversation", {
            success: false,
            msg: "Group must have a name and at least one participant",
          });
        }

        // Create new group
        const newGroup = await Conversation.create({
          type: "group",
          participants: data.participants,
          name: data.name,
          avatar: data.avatar || "",
          createdBy: socket.data.userId,
        });

        const populatedGroup = await Conversation.findById(newGroup._id)
          .populate({ path: "participants", select: "name avatar email" })
          .lean();

        console.log("Created new group:", populatedGroup);

        const connectedSockets = Array.from(io.sockets.sockets.values()).filter((s) =>
          data.participants.includes(s.data.userId)
        );

        connectedSockets.forEach((s) => s.join(newGroup._id.toString()));

        console.log(
          "Group participants joined room:",
          connectedSockets.map((s) => s.data.userId)
        );

        socket.emit("newConversation", {
          success: true,
          data: { ...populatedGroup, isNew: true },
        });
      }
    } catch (error: any) {
      console.log("newConversation error:", error);
      socket.emit("newConversation", {
        success: false,
        msg: "Failed to create conversation",
      });
    }
  });
}
