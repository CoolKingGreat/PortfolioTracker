"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const market_routes_1 = __importDefault(require("./routes/market.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const asset_routes_1 = __importDefault(require("./routes/asset.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/market", market_routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use("/api/assets", asset_routes_1.default);
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
//# sourceMappingURL=server.js.map