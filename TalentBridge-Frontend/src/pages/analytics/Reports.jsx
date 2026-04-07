import { useEffect, useState } from "react";
import BarChart from "../../components/charts/BarChart";
import PieChart from "../../components/charts/PieChart";
import LineChart from "../../components/charts/LineChart";
import { getAllProjects } from "../../api/projectApi";
import { getAssignments } from "../../api/assignmentApi";

export default function Reports() {
    const [projectStats, setProjectStats] = useState(null);
    const [utilizationStats, setUtilizationStats] = useState(null);
    const [monthlyProjectStats, setMonthlyProjectStats] = useState(null);
    const [yearlyProjectStats, setYearlyProjectStats] = useState(null);
    const [trendView, setTrendView] = useState("month"); // 'month' | 'year'
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const [projects, assignments] = await Promise.all([
                    getAllProjects(),
                    getAssignments()
                ]);

                /* ----------------------- 1️⃣ PROJECT STATUS PIE CHART ----------------------- */

                const projectStatusData = {
                    labels: ["OPEN", "ONGOING", "COMPLETED", "ON HOLD"],
                    datasets: [
                        {
                            label: "Projects",
                            data: [
                                projects.filter((p) => p.status === "OPEN").length,
                                projects.filter((p) => p.status === "ONGOING").length,
                                projects.filter((p) => p.status === "COMPLETED").length,
                                projects.filter((p) => p.status === "ON HOLD").length,
                            ],
                            backgroundColor: [
                                "rgba(54, 162, 235, 0.7)",   // OPEN
                                "rgba(255, 159, 64, 0.7)",   // ONGOING
                                "rgba(75, 192, 192, 0.7)",   // COMPLETED
                                "rgba(255, 206, 86, 0.7)",   // ON HOLD
                            ],
                        },
                    ],
                };

                setProjectStats(projectStatusData);

                /* ----------------------- 2️⃣ MONTHLY PROJECT CREATION LINE CHART ----------------------- */

                // Extract years first
                const yearsSet = new Set();
                projects.forEach(p => {
                    if (p.startDate) {
                        yearsSet.add(new Date(p.startDate).getFullYear());
                    }
                });
                const yearsList = Array.from(yearsSet).sort((a, b) => b - a); // Descending
                setAvailableYears(yearsList);

                // Default to current year if available, else first available
                let currentYear = new Date().getFullYear();
                if (yearsList.length > 0 && !yearsList.includes(currentYear)) {
                    currentYear = yearsList[0];
                    setSelectedYear(currentYear);
                }

                const calculateMonthlyStats = (year) => {
                    const monthlyCount = new Array(12).fill(0);
                    projects.forEach((p) => {
                        if (p.startDate) {
                            const d = new Date(p.startDate);
                            if (d.getFullYear() === year) {
                                monthlyCount[d.getMonth()]++;
                            }
                        }
                    });
                    return {
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        datasets: [{
                            label: `Projects Started in ${year}`,
                            data: monthlyCount,
                            borderColor: "rgb(75, 192, 192)",
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                        }]
                    };
                };

                setMonthlyProjectStats(calculateMonthlyStats(selectedYear));

                /* ----------------------- 2.5 YEARLY PROJECT CREATION LINE CHART ----------------------- */
                const yearCounts = {};
                projects.forEach((p) => {
                    if (p.startDate) {
                        const year = new Date(p.startDate).getFullYear();
                        yearCounts[year] = (yearCounts[year] || 0) + 1;
                    }
                });

                const years = Object.keys(yearCounts).sort();
                const yearlyData = {
                    labels: years,
                    datasets: [
                        {
                            label: "Projects Started",
                            data: years.map(y => yearCounts[y]),
                            borderColor: "rgb(153, 102, 255)",
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                        },
                    ],
                };
                setYearlyProjectStats(yearlyData);

                /* ----------------------- 3️ RESOURCE UTILIZATION BAR CHART ----------------------- */

                // Count active assignments by month
                const monthlyAssignments = new Array(12).fill(0);

                assignments.forEach((a) => {
                    if (a.assignedAt) {
                        const month = new Date(a.assignedAt).getMonth();
                        monthlyAssignments[month]++;
                    }
                });

                const utilizationData = {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [
                        {
                            label: "Active Assignments",
                            data: monthlyAssignments,
                            backgroundColor: "rgba(153, 102, 255, 0.6)",
                        },
                    ],
                };

                setUtilizationStats(utilizationData);

            } catch (error) {
                console.error("Analytics Load Failed", error);
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, [selectedYear]); 
    
    if (loading) return <div className="p-6 text-lg">Loading Reports...</div>;

    const chartOptions = {
        scales: {
            y: {
                ticks: {
                    stepSize: 1,
                    precision: 0
                },
                beginAtZero: true
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Analytics Reports</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* 1️⃣ Project Status Pie Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow transition-colors">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Project Status Distribution</h2>
                    <div className="h-72">
                        <PieChart data={projectStats} />
                    </div>
                </div>

                {/* 2️⃣ Resource Utilization Bar Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow transition-colors">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Resource Utilization</h2>
                    <div className="h-72">
                        <BarChart data={utilizationStats} />
                    </div>
                </div>

                {/* 3️⃣ Project Trend Line Chart */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow col-span-2 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold dark:text-white">
                            Project Trend ({trendView === 'month' ? 'Month-wise' : 'Year-wise'})
                        </h2>
                        <div className="flex gap-2">
                            {trendView === 'month' && (
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
                                >
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            )}
                            <button
                                onClick={() => setTrendView(prev => prev === 'month' ? 'year' : 'month')}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Show {trendView === 'month' ? 'Year-wise' : 'Month-wise'}
                            </button>
                        </div>
                    </div>
                    <div className="h-72">
                        <LineChart data={trendView === 'month' ? monthlyProjectStats : yearlyProjectStats} options={chartOptions} />
                    </div>
                </div>

            </div>
        </div>
    );
}
