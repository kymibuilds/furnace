import type { Request, Response } from "express";
import User from "../models/user.ts";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.ts";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password, name, avatar } = req.body as {
    email: string;
    password: string;
    name: string;
    avatar?: string;
  };
  try {
    //check if user exists
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ success: false, msg: "user already exists" });
      return;
    }

    //create new user
    user = new User({
      email,
      password,
      name,
      avatar: avatar || "",
    });

    //hasing the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //save user
    await user.save();

    //gen token
    const token = generateToken(user);

    //send back data
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ success: false, msg: "server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };
  try {
    //find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ success: false, msg: "no user found with this email." });
      return;
    }

    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ success: false, msg: "invalid password" });
    }

    //gen token
    const token = generateToken(user);

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ success: false, msg: "server error" });
  }
};
