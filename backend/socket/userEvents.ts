import { Socket, Server as SocketIOServer } from "socket.io";
import User from "../models/user.ts";
import { generateToken } from "../utils/token.ts";

export function registerUserEvents(io: SocketIOServer, socket: Socket) {
  socket.on("testSocket", () => {
    socket.emit("testSocket", { msg: "its working" });
  });

  socket.on(
    "updateProfile",
    async (data: { name?: string; avatar?: string }) => {
      console.log("updateProfile event:", data);
      const userId = socket.data.userId;

      if (!userId) {
        return socket.emit("updateProfile", {
          success: false,
          msg: "failed to fetch",
        });
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { name: data.name, avatar: data.avatar },
          { new: true } // returns updated document
        );

        if (!updatedUser) {
          return socket.emit("updateProfile", {
            success: false,
            msg: "user not found",
          });
        }

        const newToken = generateToken(updatedUser);

        socket.emit("updateProfile", {
          success: true,
          data: { token: newToken },
          msg: "profile updated successfully",
        });
      } catch (error) {
        console.log("error updating the profile", error);
        socket.emit("updateProfile", {
          success: false,
          msg: "error updating profile",
        });
      }
    }
  );

  socket.on("getContacts", async () => {
    try {
      const currentUserId = socket.data.userId;

      if (!currentUserId) {
        socket.emit("getContacts", {
          success: false,
          msg: "unauthorized",
        });
        return;
      }

      // ✅ Use the correct model name (User, not users)
      const users = await User.find(
        { _id: { $ne: currentUserId } }, // exclude current user
        { password: 0 } // exclude password field
      ).lean();

      // ✅ Map properly (variable case corrected)
      const contacts = users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
      }));

      socket.emit("getContacts", {
        success: true,
        data: contacts,
      });
    } catch (error) {
      console.log("error fetching contacts", error);
      socket.emit("getContacts", {
        success: false,
        msg: "failed to fetch contacts",
      });
    }
  });
}
