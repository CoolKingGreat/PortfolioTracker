import { useEffect, useState } from "react";
import { getStockData } from "../services/stockService";
import WidgetChart from "./WidgetChart";
import { useAuth } from "../context/AuthContext";


/*
{
    "bars": {
        "TSLA": [
            {
                "c": 187.24,
                "h": 251.17,
                "l": 180.07,
                "n": 188947,
                "o": 250.1,
                "t": "2024-01-01T05:00:00Z",
                "v": 14707285,
                "vw": 209.916638
            },
            {
                "c": 201.81,
                "h": 205.5,
                "l": 175.02,
                "n": 144911,
                "o": 188.51,
                "t": "2024-02-01T05:00:00Z",
                "v": 11585763,
                "vw": 190.979137
            },
            {
                "c": 175.72,
                "h": 204.43,
                "l": 160.54,
                "n": 183785,
                "o": 200.53,
                "t": "2024-03-01T05:00:00Z",
                "v": 13545370,
                "vw": 175.453322
            },
            {
                "c": 183.34,
                "h": 198.86,
                "l": 138.855,
                "n": 255417,
                "o": 176.13,
                "t": "2024-04-01T04:00:00Z",
                "v": 21403656,
                "vw": 168.211327
            },
            {
                "c": 178.12,
                "h": 187.52,
                "l": 167.75,
                "n": 136481,
                "o": 181.97,
                "t": "2024-05-01T04:00:00Z",
                "v": 10554137,
                "vw": 177.52963
            },
            {
                "c": 197.99,
                "h": 203.115,
                "l": 167.46,
                "n": 135415,
                "o": 178.03,
                "t": "2024-06-01T04:00:00Z",
                "v": 11016611,
                "vw": 183.146009
            },
            {
                "c": 232,
                "h": 270.8,
                "l": 200.93,
                "n": 223529,
                "o": 201,
                "t": "2024-07-01T04:00:00Z",
                "v": 18029462,
                "vw": 239.726666
            },
            {
                "c": 214.2,
                "h": 231.845,
                "l": 182.01,
                "n": 207625,
                "o": 227.4,
                "t": "2024-08-01T04:00:00Z",
                "v": 15602089,
                "vw": 209.52999
            },
            {
                "c": 261.68,
                "h": 264.74,
                "l": 209.65,
                "n": 191412,
                "o": 215.19,
                "t": "2024-09-01T04:00:00Z",
                "v": 14173169,
                "vw": 235.454424
            },
            {
                "c": 249.82,
                "h": 273.49,
                "l": 212.14,
                "n": 275665,
                "o": 262.73,
                "t": "2024-10-01T04:00:00Z",
                "v": 20417618,
                "vw": 240.978763
            },
            {
                "c": 345.13,
                "h": 361.81,
                "l": 238.955,
                "n": 329770,
                "o": 251.93,
                "t": "2024-11-01T04:00:00Z",
                "v": 20667134,
                "vw": 317.544895
            },
            {
                "c": 403.74,
                "h": 488.45,
                "l": 348.22,
                "n": 266316,
                "o": 352.44,
                "t": "2024-12-01T05:00:00Z",
                "v": 15227292,
                "vw": 419.777755
            },
            {
                "c": 404.68,
                "h": 439.66,
                "l": 373.2,
                "n": 219053,
                "o": 390.43,
                "t": "2025-01-01T05:00:00Z",
                "v": 12562577,
                "vw": 403.374876
            },
            {
                "c": 293.27,
                "h": 393.94,
                "l": 273.64,
                "n": 273417,
                "o": 386.68,
                "t": "2025-02-01T05:00:00Z",
                "v": 15802933,
                "vw": 333.580613
            },
            {
                "c": 259.14,
                "h": 303.89,
                "l": 218.17,
                "n": 449984,
                "o": 300.585,
                "t": "2025-03-01T05:00:00Z",
                "v": 31845919,
                "vw": 254.637095
            },
            {
                "c": 282.07,
                "h": 294.83,
                "l": 214.35,
                "n": 515411,
                "o": 263.82,
                "t": "2025-04-01T04:00:00Z",
                "v": 35536728,
                "vw": 252.524248
            },
            {
                "c": 345.76,
                "h": 367.59,
                "l": 271.03,
                "n": 350854,
                "o": 280.23,
                "t": "2025-05-01T04:00:00Z",
                "v": 19012433,
                "vw": 325.315572
            },
            {
                "c": 317.76,
                "h": 357.45,
                "l": 273.33,
                "n": 334215,
                "o": 343.64,
                "t": "2025-06-01T04:00:00Z",
                "v": 21483255,
                "vw": 320.551997
            },
            {
                "c": 308.665,
                "h": 337.91,
                "l": 288.82,
                "n": 316486,
                "o": 298.46,
                "t": "2025-07-01T04:00:00Z",
                "v": 20041879,
                "vw": 311.987127
            },
            {
                "c": 302.68,
                "h": 309.235,
                "l": 297.86,
                "n": 13472,
                "o": 306.205,
                "t": "2025-08-01T04:00:00Z",
                "v": 824765,
                "vw": 303.815534
            }
        ]
    },
    "next_page_token": null
}
*/

const PreviewWidget = ({ widget, onDelete, onClick }: any) => {
    const [stockData, setStockData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();


    const fetchStockData = async () => {
        setIsLoading(true);
        setError(null)
        try {
            const response = await getStockData(widget.ticker);
            setStockData(response.data.bars[widget.ticker]);
        } catch (error) {
            console.error('Faied to fetch data', error);
            setError("Failed to load data.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchStockData();
    }, [widget.ticker, token]);


    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full w-1/2" onClick={onClick}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-700">{widget.ticker}</h3>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(widget.id);
                    }}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Delete
                </button>
            </div>

            <div className="flex-grow relative">
                {isLoading && <p>Loading data...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {stockData && (
                    <WidgetChart
                        ticker={widget.ticker}
                        stockData={stockData}
                    />
                )}
            </div>
        </div>
    )
}

export default PreviewWidget;