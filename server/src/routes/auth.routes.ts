import { Router } from "express";
import { login, register, getMe } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";
import { getPortfolioSummary, getUserCash } from "../controllers/asset.controller";

const router = Router();

router.post("/login", login);
router.post("/register", register)
router.get('/me', protect, getMe)
router.get('/cash', protect, getUserCash)


export default router;