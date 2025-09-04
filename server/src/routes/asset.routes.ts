import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { addUserAsset, getPortfolioSummary, getUserAssetInfo, getUserAssets, purchaseAsset, removeUserAsset, sellAsset } from "../controllers/asset.controller";

const router = Router();

router.use(protect);

router.route("/").get(getUserAssets).post(addUserAsset)
router.route("/purchase").post(purchaseAsset)
router.route("/sell").post(sellAsset)
router.delete("/:assetId", removeUserAsset)
router.get('/assetInfo/:ticker', protect, getUserAssetInfo)
router.get("/summary", getPortfolioSummary)


export default router;