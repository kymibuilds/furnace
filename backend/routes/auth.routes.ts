import { Router } from "express";
import { loginUser, registerUser } from "../controller/auth.controller.ts";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
