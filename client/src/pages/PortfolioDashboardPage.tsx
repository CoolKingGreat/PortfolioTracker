import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addWidget, deleteWidget, getPortfolioSummary } from '../services/stockService';
import PreviewWidget from "../components/PreviewWidget";

const PortfolioDashboardPage = () => {
    const [summary, setSummary] = useState<any>(null);
    const [selectedStock, setSelectedStock] = useState("");
    const [debouncedTicker, setDebouncedTicker] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleAddWidget = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStock.trim() || !token) {
            return;
        }

        try {
            await addWidget(selectedStock, token);
            setSelectedStock("");
            fetchSummary();
        } catch (error) {
            console.error('Failed to add widget:', error);
        }
    };

    const fetchSummary = async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            const response = await getPortfolioSummary(token);
            setSummary(response.data);
        } catch (error) {
            console.error('Failed to fetch portfolio summary:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWidgetClick = (ticker: string) => {
        navigate(`/overview/${ticker}`);
    };

    const handleDeleteWidget = async (assetId: string) => {
        if (!token) return;
        try {
            await deleteWidget(assetId, token);
            fetchSummary();
        } catch (error) {
            console.error('Failed to delete widget:', error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTicker(selectedStock);
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [selectedStock]);

    useEffect(() => {
        fetchSummary();
    }, [token]);

    if (isLoading || !summary) {
        return <div className="text-center p-10">Loading Portfolio...</div>;
    }

    const gainLoss = parseFloat(summary.totalGainLoss);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm font-medium">TOTAL PORTFOLIO VALUE</h2>
                    <p className="text-3xl md:text-4xl font-bold mt-1">${summary.totalPortfolioValue}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm font-medium">TOTAL GAIN/LOSS</h2>
                    <p className={`text-3xl md:text-4xl font-bold mt-1 ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {gainLoss >= 0 ? '+' : ''}${summary.totalGainLoss}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-gray-500 text-sm font-medium">CASH BALANCE</h2>
                    <p className="text-3xl md:text-4xl font-bold mt-1">${summary.cash}</p>
                </div>
            </div>

            <div className="col-span-full flex justify-center items-center mb-6">
                <form onSubmit={handleAddWidget}>
                    <input
                        type="text"
                        value={selectedStock}
                        onChange={(e) => setSelectedStock(e.target.value)}
                        placeholder="Enter Stock Ticker"
                        className="min-w-0 py-2 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                    <button
                        type="submit"
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                        aria-label="Add ticker"
                    >
                        Add
                    </button>
                </form>
            </div>

            <div className="flex justify-center">
                {debouncedTicker && (
                    <PreviewWidget
                        widget={{ ticker: debouncedTicker }}
                        onClick={() => handleWidgetClick(debouncedTicker)}
                        onDelete={() => setSelectedStock("")}
                    />
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto mt-6">
                <h3 className="text-xl font-bold p-6">Your Holdings</h3>
                <table className="min-w-full">
                    <thead>
                <tr className="w-full h-16 border-gray-300 border-b">
                    <th className="text-left pl-4">Ticker</th>
                    <th className="text-right">Shares</th>
                    <th className="text-right">Avg. Cost</th>
                    <th className="text-right">Current Price</th>
                    <th className="text-right pr-4">Total Value</th>
                </tr>
            </thead>
                    <tbody>
                        {summary.holdings && summary.holdings.map((asset: any) => (
                            <tr
                                key={asset.ticker}
                                className="h-14 border-gray-200 border-b cursor-pointer hover:bg-gray-100"
                                onClick={() => navigate(`/overview/${asset.ticker}`)}
                            >
                                <td className="text-left pl-6 font-bold">{asset.ticker}</td>
                                <td className="text-right">{asset.quantity}</td>
                                <td className="text-right">${asset.avgCost}</td>
                                <td className="text-right font-semibold">${asset.currentPrice}</td>
                                <td className="text-right pr-6">${asset.totalValue}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {(!summary.holdings || summary.holdings.length === 0) && (
                    <p className="text-center text-gray-500 py-10">You don't have any holdings yet.</p>
                )}
            </div>
            <div className="bg-white rounded-lg shadow overflow-x-auto mt-8">
                <h3 className="text-xl font-bold p-6">Your Watchlist</h3>
                <table className="min-w-full">
                    <tbody>
                        {summary.watchlist && summary.watchlist.map((asset: any) => (
                            <tr key={asset.id} className="h-14 border-gray-200 border-b">
                                <td 
                                    className="text-left pl-6 font-bold cursor-pointer hover:text-blue-600"
                                    onClick={() => navigate(`/overview/${asset.ticker}`)}
                                >
                                    {asset.ticker}
                                </td>
                                <td className="text-right pr-6">
                                    <button 
                                        onClick={() => handleDeleteWidget(asset.id)}
                                        className="text-gray-400 hover:text-red-500 font-bold"
                                        aria-label={`Untrack ${asset.ticker}`}
                                    >
                                        &times;
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!summary.watchlist || summary.watchlist.length === 0) && (
                    <p className="text-center text-gray-500 py-10">Use the form above to track new stocks.</p>
                )}
            </div>
        </div>
    );
}

export default PortfolioDashboardPage;