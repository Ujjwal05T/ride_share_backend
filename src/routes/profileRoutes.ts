import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import { authenticateWithToken } from "../middleware/authenticateWithToken";

const router = Router();

// Protected routes that require authentication
router.get("/get-profile", authenticateWithToken, getProfile);
router.post("/update-profile", authenticateWithToken, updateProfile);

export default router;