import { getSocket } from "./socket";

// Test socket
export const testSocket = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) return;

  if (off) socket.off("testSocket", payload);
  else if (typeof payload === "function") socket.on("testSocket", payload);
  else socket.emit("testSocket", payload);
};

// Update profile
export const updateProfile = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) return;

  if (off) socket.off("updateProfile", payload);
  else if (typeof payload === "function") socket.on("updateProfile", payload);
  else socket.emit("updateProfile", payload);
};

// Get contacts
export const getContacts = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) return;

  if (off) socket.off("getContacts", payload);
  else if (typeof payload === "function") socket.on("getContacts", payload);
  else socket.emit("getContacts", payload);
};

// Get all conversations
export const getConversations = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) return;

  if (off) socket.off("getConversations", payload);
  else if (typeof payload === "function") socket.on("getConversations", payload);
  else socket.emit("getConversations", payload);
};

// New conversation
export const newConversation = (payload: any, off: boolean = false) => {
  const socket = getSocket();
  if (!socket) return;

  if (off) socket.off("newConversation", payload);
  else if (typeof payload === "function") socket.on("newConversation", payload);
  else socket.emit("newConversation", payload);
};
