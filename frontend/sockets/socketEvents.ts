import { getSocket } from "./socket";

export const testSocket = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("socket is not connected");
    return;
  }

  if (off) {
    //turn off listening to this event
    socket.off("testSocket", payload); //payload is the callback.
  } else if (typeof payload == "function") {
    socket.on("testSocket", payload); // callback for this event.
  } else {
    socket.emit("testSocket", payload); //sending payload as data.
  }
};

export const updateProfile = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) {
    console.log("socket is not connected");
    return;
  }

  if (off) {
    socket.off("updateProfile", payload);
  } else if (typeof payload === "function") {
    socket.on("updateProfile", payload);
  } else {
    socket.emit("updateProfile", payload);
  }
};

