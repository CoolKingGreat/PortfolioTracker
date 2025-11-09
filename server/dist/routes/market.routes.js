"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const market_controller_1 = require("../controllers/market.controller");
const router = (0, express_1.Router)();
router.get("/stock/:ticker", market_controller_1.getStockData);
router.get("/stock/detailed/:ticker/:start/:end/:timeframe", market_controller_1.getDetailedStockData);
exports.default = router;
//# sourceMappingURL=market.routes.js.map