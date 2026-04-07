import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem("simpleSettings");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sidebarCollapsed !== undefined) {
          setIsCollapsed(parsed.sidebarCollapsed);
        }
      }
    };

    loadSettings();
    window.addEventListener("settingsChanged", loadSettings);
    return () => window.removeEventListener("settingsChanged", loadSettings);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">

      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />

      {/* Main section */}
      <div className="flex flex-col flex-1 overflow-y-auto relative">

        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="px-8 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
