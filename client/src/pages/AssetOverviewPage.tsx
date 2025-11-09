import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WidgetChart from "../components/WidgetChart";
import { getDetailedStockData, getUserAssetInfo, purchaseStock, sellStock } from "../services/stockService";

const AssetOverviewPage = () => {
    const { ticker } = useParams();
    const [stockData, setStockData] = useState<any[]>();
    const [isLoading, setIsLoading] = useState(true);
    const [quantityPurchased, setQuantityPurchased] = useState(0);
    const [costBasis, setCostBasis] = useState(0);
    const [selectedQuantity, setSelectedQuantity] = useState("");
    const [selectedStartDate, setSelectedStartDate] = useState((new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()).split('T')[0]);
    const [chosenStartDate, setChosenStartDate] = useState(selectedStartDate);
    const [endDate, setEndDate] = useState((new Date()).toISOString().split("T")[0]);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    const [selectedSellQuantity, setSelectedSellQuantity] = useState("");
    const [currentPrice, setCurrentPrice] = useState(0); 


    const fetchStockData = async () => {
        setIsLoading(true);
        setError(null)
        try {
            if (!ticker) {
                return;
            }
            const endDateAPI = (new Date(new Date(selectedStartDate).setMonth(new Date(selectedStartDate).getMonth() + 1)).toISOString()).split('T')[0];
            setEndDate(endDateAPI);
            const response = await getDetailedStockData(ticker, selectedStartDate, endDate, "6H");
            setStockData(response.data.bars[ticker]);
        } catch (error) {
            console.error('Faied to fetch data', error);
            setError("Failed to load data.");
        } finally {
            setIsLoading(false);
        }
    }

    const fetchLatestPrice = async () => {
            if (!ticker) return;
            if (stockData && stockData.length > 0) {
                const latestBar = stockData[0].c;
                setCurrentPrice(parseFloat(latestBar));
            }
        };
    
        

    const fetchUserAssetData = async () => {
        try {
            if (!ticker) {
                return;
            }
            const response = await getUserAssetInfo(ticker, token);
            if (response.data) {
                setQuantityPurchased(response.data.quantity);
                setCostBasis(response.data.costBasis);
            } else {
                setQuantityPurchased(0);
                setCostBasis(0);
            }
        } catch (error) {
            console.error('Faied to fetch data', error);
            setError("Failed to load data.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelectDate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStartDate.trim() || !token) {
            console.log("Invalid input/token");
            return;
        }
        setChosenStartDate(selectedStartDate);
        fetchStockData();
    };

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(selectedQuantity);
        if (!selectedQuantity.trim() || !token || !ticker || isNaN(Number(selectedQuantity)) || !stockData) {
            console.log("Invalid input/token");
            return;
        }
        try {
            await purchaseStock(ticker, Number(selectedQuantity), stockData[0].c, token);
            fetchUserAssetData();
            setSelectedQuantity("");
            setError("");
        } catch (error: any) {
            console.error('Faied to fetch data', error);
            setError(error.response.data.message || "Failed to fetch data.");
        }
    }

    const handleSell = async (e: React.FormEvent) => {
        e.preventDefault();
        const quantityToSell = Number(selectedSellQuantity);
        if (!quantityToSell || quantityToSell <= 0 || !ticker) return;
        if (quantityToSell > quantityPurchased) {
            setError("You cannot sell more shares than you own.");
            return;
        }

        try {
            await sellStock(ticker, quantityToSell, currentPrice, token);
            fetchUserAssetData();
            setSelectedSellQuantity("");
            setError("");
        } catch (error) {
            console.error('Failed to sell stock:', error);
            setError("Failed to process sale.");
        }
    };

    useEffect(() => {
        fetchLatestPrice();
    }, [ticker, stockData]);

    useEffect(() => {
        fetchStockData();
        fetchUserAssetData();
    }, [ticker, token]);


    return (
        <div className="grid grid-cols-1 gap-4 mx-30 my-4">
            <div className="bg-white p-4 w-full rounded-lg shadow-md justify-self-center">
                <h3 className="text-lg font-bold text-gray-700">{ticker}</h3>
                <div className="">
                    {isLoading && <p>Loading data...</p>}
                    {stockData && ticker && (
                        <WidgetChart
                            ticker={ticker}
                            stockData={stockData}
                        />
                    )}
                </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {stockData && <div><p>Price at {chosenStartDate}: ${stockData[0].c} / Quantity Purchased: {quantityPurchased} {quantityPurchased > 0 && `/ Avg. Price Per Share: ${(costBasis / quantityPurchased).toFixed(2)}`}</p></div>}
            <div className="grid grid-flow-col grid-cols-4 gap-4">
                <form onSubmit={handleSelectDate}>
                    <input
                        type="date"
                        value={selectedStartDate}
                        onChange={(e) => setSelectedStartDate(e.target.value)}
                        placeholder="Enter Stock Ticker"
                        className="min-w-0 py-2 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                    <button
                        type="submit"
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                        aria-label="Check"
                    >
                        Check
                    </button>
                </form>

                <form onSubmit={handlePurchase}>
                    <input
                        type="number"
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(e.target.value)}
                        placeholder="Quantity"
                        className="min-w-0 py-2 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                    <button
                        type="submit"
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                        aria-label="Purchase"
                    >
                        Purchase
                    </button>
                </form>

                <form onSubmit={handleSell}>
                    <input
                        type="number"
                        value={selectedSellQuantity}
                        onChange={(e) => setSelectedSellQuantity(e.target.value)}
                        placeholder="Quantity"
                        className="min-w-0 py-2 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                    />
                    <button
                        type="submit"
                        className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                        aria-label="Sell"
                    >
                        Sell
                    </button>
                </form>
            </div>
        </div>
    )
};

export default AssetOverviewPage;