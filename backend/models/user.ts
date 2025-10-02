import mongoose from "mongoose";
import type { UserProps } from "../types.js";

const userSchema = new mongoose.Schema<UserProps>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    avatar: { type: String, required: false, default: "" },
    created: {
      type: Date,
      default: Date.now,
    },
  },

  { timestamps: true }
);

const User = mongoose.model<UserProps>("User", userSchema);
export default User;
