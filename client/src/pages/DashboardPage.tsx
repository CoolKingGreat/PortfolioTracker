// import { useEffect, useState, type FormEvent } from "react";
// import Widget from "../components/WidgetMulti";
// import { useAuth } from "../context/AuthContext";
// import { getWidgets, addWidget, deleteWidget, getPortfolioSummary } from '../services/stockService';
// import { getCash, getMe } from "../services/authService";
// import { useNavigate } from "react-router-dom";


// const DashboardPage = () => {
//     const [summary, setSummary] = useState<any>(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [widgets, setWidgets] = useState([]);
//     const [selectedStock, setSelectedStock]: any = useState("");
//     const [cash, setCash]: any = useState("");
//     const { user, token } = useAuth();
//     const navigate = useNavigate();

//     const fetchSummary = async () => {
//         if (!token) return;
//         try {
//             const response = await getPortfolioSummary(token);
//             setSummary(response.data);
//         } catch (error) {
//             console.error('Failed to fetch portfolio summary:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchSummary();
//     }, [token]);


//     const fetchWidgets = async () => {
//         if (!token) return;
//         try {
//             const response = await getWidgets(token);
//             setWidgets(response.data);
//         } catch (error) {
//             console.error('Failed to fetch widgets:', error);
//         }
//     };

//     const fetchCash = async () => {
//         if (!token) return;
//         try {
//             console.log(user);
//             const response = await getCash(token);
//             const cash = response.data;
//             console.log(cash);
//             setCash(cash);
//         } catch (error) {
//             console.error('Failed to fetch cash:', error);
//         }
//     };

//     useEffect(() => {
//         fetchWidgets();
//         fetchCash();
//     }, [token]);

//     const handleAddWidget = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!selectedStock.trim() || !token) {
//             console.log("Invalid input/token");
//             return;
//         }

//         try {
//             console.log(selectedStock)
//             await addWidget(selectedStock, token);
//             setSelectedStock("");
//             fetchWidgets();
//         } catch (error) {
//             console.error('Failed to add widget:', error);
//         }
//     };

//     const handleDeleteWidget = async (assetId: string) => {
//         if (!token) return;
//         try {
//             await deleteWidget(assetId, token);
//             fetchWidgets();
//         } catch (error) {
//             console.error('Failed to delete widget:', error);
//         }
//     };

//     const handleWidgetClick = (ticker: string) => {
//         navigate(`/overview/${ticker}`);
//     };

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-4">
//             <div className="col-span-full flex justify-center items-center">
//                 <form onSubmit={handleAddWidget}>
//                     <input
//                         type="text"
//                         value={selectedStock}
//                         onChange={(e) => setSelectedStock(e.target.value)}
//                         placeholder="Enter Stock Ticker"
//                         className="min-w-0 py-2 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
//                     />
//                     <button
//                         type="submit"
//                         className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
//                         aria-label="Add ticker"
//                     >
//                         Add
//                     </button>
//                 </form>
//                 <p className="absolute right-5">${cash}</p>
//             </div>

//             {widgets.map((widget: any) => (
//                 <Widget
//                     key={widget.id}
//                     widget={widget}
//                     onClick={() => handleWidgetClick(widget.ticker)}
//                     onDelete={handleDeleteWidget}
//                 />
//             ))}
//         </div>
//     );
// }

// export default DashboardPage;