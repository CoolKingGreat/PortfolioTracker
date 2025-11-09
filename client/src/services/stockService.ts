import axios from "axios";

// const ASSET_API_URL = `${process.env.REACT_APP_API_URL}/api/assets`;
// const STOCK_API_URL = `${process.env.REACT_APP_API_URL}/api/market/stock`;

// const ASSET_API_URL = 'http://localhost:3000/api/assets';
// const STOCK_API_URL = 'http://localhost:3000/api/market/stock';

const ASSET_API_URL = `${import.meta.env.VITE_API_URL}/api/assets`;
const STOCK_API_URL = `${import.meta.env.VITE_API_URL}/api/market/stock`;

const getAuthHeaders = (token: any) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getWidgets = (token: any) => {
  return axios.get(ASSET_API_URL, getAuthHeaders(token));
};

export const addWidget = (ticker: string, token: any) => {
  return axios.post(ASSET_API_URL, { ticker }, getAuthHeaders(token));
};

export const deleteWidget = (assetId: string, token: any) => {
  return axios.delete(`${ASSET_API_URL}/${assetId}`, getAuthHeaders(token));
};

export const getStockData = (ticker: string) => {
    return axios.get(`${STOCK_API_URL}/${ticker}`);
}

export const getDetailedStockData = (ticker: string, start: string, end: string, timeframe: string) => {
    return axios.get(`${STOCK_API_URL}/detailed/${ticker}/${start}/${end}/${timeframe}`);
}

export const getUserAssetInfo = (ticker: string, token: any) => {
    return axios.get(`${ASSET_API_URL}/assetInfo/${ticker}`, getAuthHeaders(token));
}


export const purchaseStock = (ticker: string, quantity: number, price: number, token: any) => {
  return axios.post(`${ASSET_API_URL}/purchase`, { ticker, quantity, price }, getAuthHeaders(token));
};

export const sellStock = (ticker: string, quantity: number, price: number, token: any) => {
  return axios.post(`${ASSET_API_URL}/sell`, { ticker, quantity, price }, getAuthHeaders(token));
};

export const getPortfolioSummary = (token: any) => {
  return axios.get(`${ASSET_API_URL}/summary`, getAuthHeaders(token));
};