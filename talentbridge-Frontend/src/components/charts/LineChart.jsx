import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const getTextColor = () => {
    return document.documentElement.classList.contains("dark") ? "#cbd5e1" : "#475569";
};

const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: { color: getTextColor() },
        },
    },
    scales: {
        y: {
            ticks: { color: getTextColor() },
            grid: { color: document.documentElement.classList.contains("dark") ? "#334155" : "#e2e8f0" },
        },
        x: {
            ticks: { color: getTextColor() },
            grid: { display: false },
        },
    },
};

export default function LineChart({ data, options }) {
    const finalOptions = { ...defaultOptions, ...options };
    finalOptions.plugins.legend.labels.color = getTextColor();
    if (finalOptions.scales) {
        if (finalOptions.scales.y) {
            finalOptions.scales.y.ticks = finalOptions.scales.y.ticks || {};
            finalOptions.scales.y.ticks.color = getTextColor();

            finalOptions.scales.y.grid = finalOptions.scales.y.grid || {};
            finalOptions.scales.y.grid.color = document.documentElement.classList.contains("dark") ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
        }

        if (finalOptions.scales.x) {
            finalOptions.scales.x.ticks = finalOptions.scales.x.ticks || {};
            finalOptions.scales.x.ticks.color = getTextColor();
        }
    }
    return <Line data={data} options={finalOptions} />;
}
