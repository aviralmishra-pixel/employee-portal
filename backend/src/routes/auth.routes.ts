import { Router } from "express";
import { login, logout, register, getProfile, refreshTokens } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshTokens); // 👈 New route for silent token swapping
router.post("/logout", logout);
router.get("/profile", authenticateToken, getProfile);
 
export default router;