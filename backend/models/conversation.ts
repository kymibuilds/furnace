import mongoose from "mongoose";
import type { ConversationProps } from "../types.js";

const conversationSchema = new mongoose.Schema<ConversationProps>(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    name: {
      type: String,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // auto-manages createdAt & updatedAt
  }
);

// optional: ensure updatedAt refreshes before save
conversationSchema.pre("save", function (this: ConversationProps, next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ConversationProps>(
  "Conversation",
  conversationSchema
);
