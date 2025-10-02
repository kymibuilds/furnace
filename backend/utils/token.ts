import type { UserProps } from "../types.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (user: UserProps) => {
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };

  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};
