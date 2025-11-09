"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const asset_controller_1 = require("../controllers/asset.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.route("/").get(asset_controller_1.getUserAssets).post(asset_controller_1.addUserAsset);
router.route("/purchase").post(asset_controller_1.purchaseAsset);
router.route("/sell").post(asset_controller_1.sellAsset);
router.delete("/:assetId", asset_controller_1.removeUserAsset);
router.get('/assetInfo/:ticker', auth_middleware_1.protect, asset_controller_1.getUserAssetInfo);
router.get("/summary", asset_controller_1.getPortfolioSummary);
exports.default = router;
//# sourceMappingURL=asset.routes.js.map