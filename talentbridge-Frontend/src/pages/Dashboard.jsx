// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarChart from "../components/charts/BarChart";
import PieChart from "../components/charts/PieChart";
import LineChart from "../components/charts/LineChart";

import { getUserStats, getAllUsers } from "../api/userApi";
import { getAllProjects } from "../api/projectApi";
import { getAssignments } from "../api/assignmentApi";
import { getAllSkills } from "../api/skillApi";

import MetricCard from "../components/dashboard/MetricCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import Shortcuts from "../components/dashboard/Shortcuts";
import { Users, Briefcase, Layers, Wrench, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    totalProjects: 0,
    totalSkills: 0,
    activeAssignments: 0,
  });

  const [charts, setCharts] = useState({
    projectStatus: null,
    employeeRoles: null,
    projectTrend: null,
  });

  const [recent, setRecent] = useState({
    recentProjects: [],
    recentAssignments: [],
  });

  const [settings, setSettings] = useState({
    showStatsCards: true,
    showRecentActivity: true,
    showQuickInsights: true,
  });

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem("simpleSettings");
      if (saved) {
        setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
      }
    };

    loadSettings();
    window.addEventListener("settingsChanged", loadSettings);
    return () => window.removeEventListener("settingsChanged", loadSettings);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const [
          userStatsRes,
          usersRes,
          projectsRes,
          assignmentsRes,
          skillsRes,
        ] = await Promise.allSettled([
          getUserStats(),
          getAllUsers(),
          getAllProjects(),
          getAssignments(),
          getAllSkills(),
        ]);

        // METRICS
        const totalEmployees =
          userStatsRes.status === "fulfilled" && userStatsRes.value.totalUsers !== undefined
            ? userStatsRes.value.totalUsers
            : (usersRes.status === "fulfilled" ? usersRes.value.length : 0);

        const totalProjects =
          projectsRes.status === "fulfilled" ? projectsRes.value.length : 0;

        const totalSkills =
          skillsRes.status === "fulfilled" ? skillsRes.value.length : 0;

        const activeAssignments =
          assignmentsRes.status === "fulfilled"
            ? assignmentsRes.value.filter(
              (a) =>
                a.status === "ASSIGNED" ||
                a.status === "ONGOING" ||
                a.status === "ACTIVE"
            ).length
            : 0;

        setMetrics({
          totalEmployees,
          totalProjects,
          totalSkills,
          activeAssignments,
        });

        // PROJECT STATUS PIE CHART
        const projectRows =
          projectsRes.status === "fulfilled" ? projectsRes.value : [];
        const statusCounts = {
          OPEN: 0,
          ONGOING: 0,
          COMPLETED: 0,
          "ON HOLD": 0,
          CLOSED: 0,
        };

        projectRows.forEach((p) => {
          const st = (p.status || "").toUpperCase();
          if (statusCounts[st] !== undefined) statusCounts[st]++;
          else statusCounts.OPEN++;
        });

        const projectStatusData = {
          labels: ["OPEN", "ONGOING", "COMPLETED", "ON HOLD"],
          datasets: [
            {
              data: [
                statusCounts.OPEN,
                statusCounts.ONGOING,
                statusCounts.COMPLETED,
                statusCounts["ON HOLD"],
              ],
              backgroundColor: [
                "rgba(59, 130, 246, 0.8)", // Blue
                "rgba(249, 115, 22, 0.8)", // Orange
                "rgba(16, 185, 129, 0.8)", // Emerald
                "rgba(234, 179, 8, 0.8)",  // Yellow
              ],
              borderWidth: 0,
            },
          ],
        };

        // EMPLOYEE ROLE BAR CHART
        let roleCounts = {};
        if (
          userStatsRes.status === "fulfilled" &&
          userStatsRes.value.countByRole
        ) {
          roleCounts = userStatsRes.value.countByRole;
        } else if (usersRes.status === "fulfilled") {
          usersRes.value.forEach((u) => {
            const r = (u.role || "EMPLOYEE").toUpperCase();
            roleCounts[r] = (roleCounts[r] || 0) + 1;
          });
        }

        const roleLabels = Object.keys(roleCounts);
        const employeeRolesData = {
          labels: roleLabels,
          datasets: [
            {
              label: "Employees by Role",
              data: roleLabels.map((k) => roleCounts[k]),
              backgroundColor: "rgba(99, 102, 241, 0.7)", // Indigo
              borderRadius: 6,
            },
          ],
        };

        // PROJECT TREND LINE CHART
        const monthBins = new Array(12).fill(0);
        projectRows.forEach((p) => {
          const start = p.startDate || p.createdAt || p.start_date;
          if (start) {
            const d = new Date(start);
            if (!isNaN(d)) monthBins[d.getMonth()]++;
          }
        });

        const projectTrendData = {
          labels: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
          ],
          datasets: [
            {
              label: "Projects Started",
              data: monthBins,
              fill: true,
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderColor: "rgba(59, 130, 246, 1)",
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: "#fff",
              pointBorderColor: "rgba(59, 130, 246, 1)",
              pointBorderWidth: 2,
            },
          ],
        };

        setCharts({
          projectStatus: projectStatusData,
          employeeRoles: employeeRolesData,
          projectTrend: projectTrendData,
        });

        setRecent({
          recentProjects: projectRows.slice(0, 6),
          recentAssignments:
            assignmentsRes.status === "fulfilled"
              ? assignmentsRes.value.slice(0, 6)
              : [],
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Here's what's happening at TalentBridge today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Shortcuts />
        </div>
      </div>

      {/* METRIC CARDS */}
      {settings.showStatsCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Total Employees" value={metrics.totalEmployees} icon={<Users />} color="blue" />
          <MetricCard title="Active Projects" value={metrics.totalProjects} icon={<Briefcase />} color="orange" />
          <MetricCard title="Total Skills" value={metrics.totalSkills} icon={<Layers />} color="purple" />
          <MetricCard title="Active Assignments" value={metrics.activeAssignments} icon={<Wrench />} color="green" />
        </div>
      )}

      {/* CHARTS — SIDE BY SIDE PIE + LINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Project Insights</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* PIE */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Status Distribution</h3>
              <div className="h-64 relative">
                {charts.projectStatus ? (
                  <PieChart data={charts.projectStatus} />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No project data
                  </div>
                )}
              </div>
            </div>

            {/* LINE */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Growth Trend</h3>
              <div className="h-64 flex items-center">
                {charts.projectTrend ? (
                  <LineChart data={charts.projectTrend} />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* BAR */}
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Role Distribution</h2>
          <div className="h-80">
            {charts.employeeRoles ? (
              <BarChart data={charts.employeeRoles} />
            ) : (
              <div className="text-gray-400">No data</div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT + INSIGHTS */}
      {(settings.showRecentActivity || settings.showQuickInsights) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {settings.showRecentActivity && (
            <div className={`${settings.showQuickInsights ? 'lg:col-span-2' : 'lg:col-span-3'} glass-panel p-6 rounded-2xl`}>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Recent Activity</h2>
              <RecentActivity
                projects={recent.recentProjects}
                assignments={recent.recentAssignments}
              />
            </div>
          )}

          {settings.showQuickInsights && (
            <div className={`${settings.showRecentActivity ? '' : 'lg:col-span-3'} glass-panel p-6 rounded-2xl`}>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Quick Insights</h2>
              <div className="space-y-4">

                {/* Resource Utilization */}
                <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:shadow-md transition-all">
                  <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">Resource Utilization</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-2xl text-slate-800 dark:text-white">
                      {metrics.totalEmployees > 0
                        ? Math.round((metrics.activeAssignments / metrics.totalEmployees) * 100)
                        : 0}%
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                      Target: 80%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${metrics.totalEmployees > 0 ? (metrics.activeAssignments / metrics.totalEmployees) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {metrics.activeAssignments} active assignments / {metrics.totalEmployees} employees
                  </p>
                </div>

                {/* Projects Due Soon */}
                <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:shadow-md transition-all">
                  <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">Projects Due Soon</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-lg">
                      {recent.recentProjects.filter(p => {
                        if (!p.endDate) return false;
                        const end = new Date(p.endDate);
                        const now = new Date();
                        const diffTime = end - now;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays >= 0 && diffDays <= 30;
                      }).length}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-white">Upcoming Deadlines</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Projects ending in 30 days</div>
                    </div>
                  </div>
                </div>

                {/* Bench Strength */}
                <div className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:shadow-md transition-all">
                  <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-2 font-semibold">Bench Strength</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
                        {Math.max(0, metrics.totalEmployees - metrics.activeAssignments)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-white">Available Talent</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Ready for assignment</div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/employees')}
                      className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
