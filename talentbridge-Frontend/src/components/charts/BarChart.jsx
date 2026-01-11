import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Helper to get theme color
const getTextColor = () => {
    return document.documentElement.classList.contains("dark") ? "#cbd5e1" : "#475569";
};

// Default options with theme awareness
const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: getTextColor(),
            },
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

export default function BarChart({ data, options }) {
    // Merge passed options with defaults (simple merge)
    const finalOptions = { ...defaultOptions, ...options };
    // Re-evaluate colors on render (hacky but works for simple toggle)
    finalOptions.plugins.legend.labels.color = getTextColor();
    if (finalOptions.scales) {
        finalOptions.scales.y.ticks.color = getTextColor();
        finalOptions.scales.y.grid.color = document.documentElement.classList.contains("dark") ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
        finalOptions.scales.x.ticks.color = getTextColor();
    }

    return <Bar data={data} options={finalOptions} />;
}
