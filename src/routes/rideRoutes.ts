import { Router } from "express";
import { getRides, offerRide } from "../controllers/rideController";
import { authenticateWithToken } from "../middleware/authenticateWithToken";


const router = Router();

router.get("/",authenticateWithToken, getRides);
router.post("/offer",authenticateWithToken, offerRide);



export default router;