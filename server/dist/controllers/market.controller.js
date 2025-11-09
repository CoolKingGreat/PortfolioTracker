"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDetailedStockData = exports.getStockData = void 0;
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const redis_1 = __importDefault(require("../lib/redis"));
const getStockData = async (req, res) => {
    try {
        const { ticker } = req.params;
        const ALPACA_KEY = process.env.ALPACA_KEY;
        const ALPACA_SECRET = process.env.ALPACA_SECRET;
        const alpacaGet = {
            method: 'GET',
            url: `https://data.alpaca.markets/v2/stocks/bars?symbols=${ticker}&timeframe=1M&start=2024-01-01&limit=1000&adjustment=all&feed=iex&sort=asc`,
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': `${ALPACA_KEY}`,
                'APCA-API-SECRET-KEY': `${ALPACA_SECRET}`
            }
        };
        const alpacaResponse = (await axios_1.default.request(alpacaGet));
        return res.status(200).json(alpacaResponse.data);
    }
    catch (err) {
        console.error("Error w/ stock data");
        res.status(500).json({ message: "Error fetching stock data" });
    }
};
exports.getStockData = getStockData;
const getDetailedStockData = async (req, res) => {
    try {
        const { ticker, start, end, timeframe } = req.params;
        const ALPACA_KEY = process.env.ALPACA_KEY;
        const ALPACA_SECRET = process.env.ALPACA_SECRET;
        const cacheKey = `stock:${ticker}:${start}:${end}:${timeframe}`;
        if (redis_1.default.isReady) {
            const cachedData = await redis_1.default.get(cacheKey);
            if (cachedData) {
                console.log("CACHE HIT:", cacheKey);
                return res.status(200).json(JSON.parse(cachedData));
            }
        }
        console.log("CACHE MISS:", cacheKey);
        const alpacaGet = {
            method: 'GET',
            url: `https://data.alpaca.markets/v2/stocks/bars?symbols=${ticker}&timeframe=${timeframe}&start=${start}T00:00:00Z&end=${end}&limit=1000&adjustment=all&feed=iex&sort=asc`,
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': `${ALPACA_KEY}`,
                'APCA-API-SECRET-KEY': `${ALPACA_SECRET}`
            }
        };
        const alpacaResponse = (await axios_1.default.request(alpacaGet));
        if (redis_1.default.isReady) {
            await redis_1.default.set(cacheKey, JSON.stringify(alpacaResponse.data), {
                EX: 3600
            });
        }
        return res.status(200).json(alpacaResponse.data);
    }
    catch (err) {
        console.error("Error w/ stock data");
        res.status(500).json({ message: "Error fetching stock data" });
    }
};
exports.getDetailedStockData = getDetailedStockData;
//# sourceMappingURL=market.controller.js.map