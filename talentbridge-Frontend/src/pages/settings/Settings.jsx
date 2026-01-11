import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun, Layout, Save, LayoutDashboard } from "lucide-react";

const DEFAULT_SETTINGS = {
  // darkMode handled by ThemeContext
  sidebarCollapsed: false,
  defaultPage: "/dashboard",

  // Dashboard Preferences
  showStatsCards: true,
  showRecentActivity: true,
  showQuickInsights: true,
};

export default function Settings() {
  const { darkMode, toggleTheme } = useTheme();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Load from localStorage on page load
  useEffect(() => {
    const saved = localStorage.getItem("simpleSettings");
    if (saved) {
      setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
    }
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem("simpleSettings", JSON.stringify(settings));
    // Dispatch a custom event so Dashboard can listen for changes immediately
    window.dispatchEvent(new Event("settingsChanged"));
    alert("Settings saved successfully!");
  };

  const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
      <Icon size={20} className="text-blue-600 dark:text-blue-400" />
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Settings</h1>

      <div className="grid gap-8">

        {/* APPEARANCE & LAYOUT */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <SectionHeader icon={Layout} title="Appearance & Layout" />

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium dark:text-slate-200">Dark Mode</span>
                <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none ${darkMode ? "bg-blue-600" : "bg-slate-200"}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-300 flex items-center justify-center ${darkMode ? "translate-x-5" : "translate-x-0"}`}>
                  {darkMode ? <Moon size={12} className="text-blue-600" /> : <Sun size={12} className="text-orange-500" />}
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium dark:text-slate-200">Collapse Sidebar</span>
                <p className="text-sm text-slate-500 dark:text-slate-400">Minimize the navigation menu</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={settings.sidebarCollapsed} onChange={(e) => handleChange("sidebarCollapsed", e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block font-medium mb-1 dark:text-slate-200">Default Page After Login</label>
              <select
                value={settings.defaultPage}
                onChange={(e) => handleChange("defaultPage", e.target.value)}
                className="w-full md:w-1/2 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              >
                <option value="/dashboard">Dashboard</option>
                <option value="/employees">Employees</option>
                <option value="/projects">Projects</option>
                <option value="/skills">Skills</option>
              </select>
            </div>
          </div>
        </div>

        {/* DASHBOARD PREFERENCES */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <SectionHeader icon={LayoutDashboard} title="Dashboard Customization" />

          <div className="space-y-4">
            {[
              { key: "showStatsCards", label: "Show Stats Cards", desc: "Display key metrics at the top of the dashboard" },
              { key: "showRecentActivity", label: "Show Recent Activity", desc: "Display list of recent projects and assignments" },
              { key: "showQuickInsights", label: "Show Quick Insights", desc: "Display system status and quick actions panel" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <span className="font-medium dark:text-slate-200">{item.label}</span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings[item.key]} onChange={(e) => handleChange(item.key, e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-4">
          <button
            onClick={saveSettings}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 font-medium"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
