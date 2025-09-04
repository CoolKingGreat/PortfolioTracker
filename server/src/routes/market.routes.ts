import { Router } from "express";
import { getDetailedStockData, getStockData } from "../controllers/market.controller";

const router = Router();

router.get("/stock/:ticker", getStockData)
router.get("/stock/detailed/:ticker/:start/:end/:timeframe", getDetailedStockData)

export default router;