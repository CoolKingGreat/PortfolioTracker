import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartDataState {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        pointRadius: number;
    }[];
}

const WidgetChart = ({ ticker, stockData }: { ticker: string, stockData: any }) => {
    const [chartData, setChartData] = useState<ChartDataState>({
        labels: [],
        datasets: [],
    });

    useEffect(() => {
        if (stockData) {
            const labels = stockData.map((bar: { t: string; }) => bar.t.split("T")[0])
            const data = stockData.map((bar: { c: string; }) => parseFloat(bar.c))

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: ticker,
                        data: data,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        pointRadius: 1,
                    },
                ],
            });
        }
    }, [ticker, stockData])

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: ticker || '',
            },
        },
        x: {
            ticks: {
                maxTicksLimit: 10,
            }
        }
    }

    return <Line options={chartOptions} data={chartData} />;
};

export default WidgetChart;