"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortfolioSummary = exports.removeUserAsset = exports.sellAsset = exports.purchaseAsset = exports.addUserAsset = exports.getUserAssetInfo = exports.getUserCash = exports.getUserAssets = void 0;
const prisma_1 = require("../lib/prisma");
const library_1 = require("@prisma/client/runtime/library");
const axios_1 = __importDefault(require("axios"));
const getUserAssets = async (req, res) => {
    try {
        const widgets = await prisma_1.prisma.asset.findMany({
            where: { userId: req.user.id },
            orderBy: { updatedAt: 'desc' }
        });
        res.json(widgets);
    }
    catch (error) {
        res.status(500).json({ message: "Server error during fetch" });
    }
};
exports.getUserAssets = getUserAssets;
const getUserCash = async (req, res) => {
    try {
        const currUser = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id }
        });
        res.json(currUser?.cash);
    }
    catch (error) {
        res.status(500).json({ message: "Server error during fetch" });
    }
};
exports.getUserCash = getUserCash;
const getUserAssetInfo = async (req, res) => {
    const { ticker } = req.params;
    try {
        const findAsset = await prisma_1.prisma.asset.findUnique({
            where: {
                userId_ticker: {
                    ticker,
                    userId: req.user.id,
                },
            },
        });
        res.status(200).json(findAsset);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during stock purchase.' });
    }
};
exports.getUserAssetInfo = getUserAssetInfo;
const addUserAsset = async (req, res) => {
    const { ticker } = req.body;
    try {
        const newAsset = await prisma_1.prisma.asset.create({
            data: {
                ticker,
                userId: req.user.id,
                type: "stock"
            },
        });
        res.status(201).json(newAsset);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during widget addition.' });
    }
};
exports.addUserAsset = addUserAsset;
const purchaseAsset = async (req, res) => {
    const { ticker, quantity, price } = req.body;
    const totalCost = new library_1.Decimal(quantity).times(price);
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            select: { cash: true },
        });
        if (!user)
            return res.status(404).json({ message: "User not found." });
        if (quantity < 0) {
            return res.status(400).json({ message: "Cannot purchase a negative quantity." });
        }
        if (new library_1.Decimal(user.cash).lessThan(totalCost)) {
            return res.status(400).json({ message: "Insufficient funds for this purchase." });
        }
        const [updatedAsset, updatedUser] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.asset.upsert({
                where: {
                    userId_ticker: {
                        ticker: ticker,
                        userId: req.user.id,
                    },
                },
                update: {
                    quantity: { increment: quantity },
                    costBasis: { increment: totalCost }
                },
                create: {
                    ticker: ticker,
                    userId: req.user.id,
                    type: "stock",
                    quantity: quantity,
                    costBasis: totalCost
                }
            }),
            prisma_1.prisma.user.update({
                where: { id: req.user.id },
                data: {
                    cash: { decrement: totalCost }
                }
            })
        ]);
        res.status(201).json(updatedAsset);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during stock purchase.' });
    }
};
exports.purchaseAsset = purchaseAsset;
const sellAsset = async (req, res) => {
    const { ticker, quantity, price } = req.body;
    const proceeds = new library_1.Decimal(quantity).times(price);
    try {
        const asset = await prisma_1.prisma.asset.findUnique({
            where: {
                userId_ticker: {
                    ticker: ticker,
                    userId: req.user.id,
                },
            },
        });
        if (!asset)
            return res.status(404).json({ message: "Asset not found." });
        if (asset.quantity < quantity) {
            return res.status(400).json({ message: "Insufficient shares to sell." });
        }
        const costBasisReduction = asset.costBasis.times(new library_1.Decimal(quantity).dividedBy(asset.quantity));
        const [updatedAsset, updatedUser] = await prisma_1.prisma.$transaction([
            prisma_1.prisma.asset.update({
                where: {
                    userId_ticker: {
                        ticker: ticker,
                        userId: req.user.id,
                    },
                },
                data: {
                    quantity: { decrement: quantity },
                    costBasis: { decrement: costBasisReduction }
                }
            }),
            prisma_1.prisma.user.update({
                where: { id: req.user.id },
                data: {
                    cash: { increment: proceeds }
                }
            })
        ]);
        res.status(201).json(updatedAsset);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during stock sell.' });
    }
};
exports.sellAsset = sellAsset;
const removeUserAsset = async (req, res) => {
    const { assetId } = req.params;
    try {
        const widget = await prisma_1.prisma.asset.findUnique({ where: { id: assetId } });
        if (!widget || widget.userId !== req.user.id) {
            return res.status(404).json({ message: 'Widget not found or not authorized.' });
        }
        await prisma_1.prisma.asset.delete({
            where: { id: assetId },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during widget deletion' });
    }
};
exports.removeUserAsset = removeUserAsset;
const getPortfolioSummary = async (req, res) => {
    try {
        const userWithAssets = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id },
            include: { assets: { where: { quantity: { gte: 0 } } } }
        });
        if (!userWithAssets) {
            return res.status(404).json({ message: "User not found" });
        }
        if (userWithAssets.assets.length === 0) {
            return res.json({
                totalPortfolioValue: userWithAssets.cash.toFixed(2),
                totalGainLoss: "0.00",
                cash: userWithAssets.cash.toFixed(2),
                holdings: []
            });
        }
        const tickers = userWithAssets.assets.map(asset => asset.ticker).join(',');
        const alpacaResponse = await axios_1.default.get(`https://data.alpaca.markets/v2/stocks/trades/latest?symbols=${tickers}`, {
            headers: { 'APCA-API-KEY-ID': process.env.ALPACA_KEY, 'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET }
        });
        const latestPrices = alpacaResponse.data.trades;
        let currentTotalStockValue = new library_1.Decimal(0);
        let totalCostBasis = new library_1.Decimal(0);
        const holdings = [];
        const watchlist = [];
        for (const asset of userWithAssets.assets) {
            const tradeInfo = latestPrices[asset.ticker];
            const currentPrice = new library_1.Decimal((tradeInfo && typeof tradeInfo.p === 'number') ? tradeInfo.p : 0);
            if (asset.quantity > 0) {
                const currentValue = currentPrice.times(asset.quantity);
                currentTotalStockValue = currentTotalStockValue.add(currentValue);
                totalCostBasis = totalCostBasis.add(asset.costBasis);
                holdings.push({
                    ticker: asset.ticker,
                    quantity: asset.quantity,
                    avgCost: asset.costBasis.dividedBy(asset.quantity).toFixed(2),
                    currentPrice: currentPrice.toFixed(2),
                    totalValue: currentValue.toFixed(2)
                });
            }
            else {
                watchlist.push({
                    id: asset.id,
                    ticker: asset.ticker,
                    currentPrice: currentPrice.toFixed(2)
                });
            }
        }
        // const holdings = userWithAssets.assets.map(asset => {
        //     const tradeInfo = latestPrices[asset.ticker];
        //     const priceValue = (tradeInfo && typeof tradeInfo.p === 'number') ? tradeInfo.p : 0;
        //     const currentPrice = new Decimal(priceValue);
        //     const currentValue = currentPrice.times(asset.quantity);
        //     currentTotalStockValue = currentTotalStockValue.add(currentValue);
        //     totalCostBasis = totalCostBasis.add(asset.costBasis);
        //     const avgCost = asset.quantity > 0 ? asset.costBasis.dividedBy(asset.quantity) : new Decimal(0);
        //     return {
        //         ticker: asset.ticker,
        //         quantity: asset.quantity,
        //         avgCost: avgCost.toFixed(2),
        //         currentPrice: currentPrice.toFixed(2),
        //         totalValue: currentValue.toFixed(2)
        //     };
        // });
        const totalPortfolioValue = currentTotalStockValue.add(userWithAssets.cash);
        const totalGainLoss = currentTotalStockValue.minus(totalCostBasis);
        res.json({
            totalPortfolioValue: totalPortfolioValue.toFixed(2),
            totalGainLoss: totalGainLoss.toFixed(2),
            cash: userWithAssets.cash.toFixed(2),
            holdings,
            watchlist
        });
    }
    catch (error) {
        console.error("Error in getPortfolioSummary:", error);
        res.status(500).json({ message: "Error fetching portfolio summary." });
    }
};
exports.getPortfolioSummary = getPortfolioSummary;
//# sourceMappingURL=asset.controller.js.map