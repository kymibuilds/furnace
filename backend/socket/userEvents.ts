import { Socket, Server as SocketIOServer } from "socket.io";
import User from "../models/user.ts";
import { generateToken } from "../utils/token.ts";

export function registerUserEvents(io: SocketIOServer, socket: Socket) {
  socket.on("testSocket", (data) => {
    socket.emit("testSocket", { msg: "its working" });
  });

  socket.on(
    "updateProfile",
    async (data: { name?: string; avatar?: string }) => {
      console.log("updateprofileevent: ", data);
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
          { new: true } //will return user with updated values
        );
        if (!updatedUser) {
          socket.emit("updateProfile", {
            success: false,
            msg: "user not found",
          });
          return;
        }

        //gen token with updatedvalue
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
}
