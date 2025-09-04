import { Request, Response } from "express";
import "dotenv/config";
import axios from "axios";
import { prisma } from "../lib/prisma";

export const getStockData = async (req: Request, res: Response) => {
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
        const alpacaResponse = (await axios.request(alpacaGet));
        return res.status(200).json(alpacaResponse.data)

    } catch (err) {
        console.error("Error w/ stock data");
        res.status(500).json({ message: "Error fetching stock data" });
    }
}

export const getDetailedStockData = async (req: Request, res: Response) => {
    try {
        const { ticker, start, end, timeframe } = req.params;
        const ALPACA_KEY = process.env.ALPACA_KEY;
        const ALPACA_SECRET = process.env.ALPACA_SECRET;
        const alpacaGet = {
            method: 'GET',
            url: `https://data.alpaca.markets/v2/stocks/bars?symbols=${ticker}&timeframe=${timeframe}&start=${start}T00:00:00Z&end=${end}&limit=1000&adjustment=all&feed=iex&sort=asc`,
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': `${ALPACA_KEY}`,
                'APCA-API-SECRET-KEY': `${ALPACA_SECRET}`
            }
        };
        const alpacaResponse = (await axios.request(alpacaGet));
        return res.status(200).json(alpacaResponse.data)

    } catch (err) {
        console.error("Error w/ stock data");
        res.status(500).json({ message: "Error fetching stock data" });
    }
}