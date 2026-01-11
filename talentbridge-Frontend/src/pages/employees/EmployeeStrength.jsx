import { useEffect, useState } from "react";
import { getUserStats } from "../../api/userApi";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function EmployeeStrength() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getUserStats();
    setStats(data);
  };

  if (!stats) return <p>Loading...</p>;

  // FIXED KEYS
  const roleCounts = stats.countByRole || {};
  const statusCounts = stats.countByStatus || {};

  const barData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        label: "Employees",
        data: Object.values(roleCounts),
        backgroundColor: "rgba(37,99,235,0.7)",
      },
    ],
  };

  const pieData = {
    labels: Object.keys(roleCounts),
    datasets: [
      {
        data: Object.values(roleCounts),
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Employee Strength</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your workforce distribution and status.</p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-200">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Employees</h3>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalUsers}
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-200">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Active</h3>
          <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
            {statusCounts.ACTIVE || 0}
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:scale-105 transition-transform duration-200">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Inactive</h3>
          <p className="text-4xl font-bold text-red-600 dark:text-red-400">
            {statusCounts.INACTIVE || 0}
          </p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Role-wise Employee Count</h3>
          <div className="h-80">
            <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8' } } }, scales: { y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Employee Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8' } } } }} />
          </div>
        </div>
      </div>
    </div>
  );
}
