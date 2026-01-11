import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Layers,
  GitMerge,
  BarChart2,
  Settings,
  LogOut,
  UserCheck,
  Award,
  PieChart,
  Bell,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

export default function Sidebar({ isCollapsed, toggleSidebar }) {
  const { logout, role } = useAuth();

  const menus = {
    ADMIN: [
      { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "Employees", path: "/employees", icon: <Users size={20} /> },
      { name: "Skills", path: "/skills", icon: <Layers size={20} /> },
      { name: "Projects", path: "/projects", icon: <Briefcase size={20} /> },
      { name: "Progress", path: "/projects/progress", icon: <PieChart size={20} /> },
      { name: "Matching", path: "/matching", icon: <GitMerge size={20} /> },
      { name: "Analytics", path: "/analytics", icon: <BarChart2 size={20} /> },
      { name: "Updates", path: "/updates", icon: <Bell size={20} /> },
      { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
    ],
    HR: [
      { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "Employees", path: "/employees", icon: <Users size={20} /> },
      { name: "Skills", path: "/skills", icon: <Layers size={20} /> },
      { name: "Analytics", path: "/analytics", icon: <BarChart2 size={20} /> },
      { name: "Updates", path: "/updates", icon: <Bell size={20} /> },
    ],
    PM: [
      { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "Projects", path: "/projects", icon: <Briefcase size={20} /> },
      { name: "Progress", path: "/projects/progress", icon: <PieChart size={20} /> },
      { name: "Matching", path: "/matching", icon: <GitMerge size={20} /> },
      { name: "Updates", path: "/updates", icon: <Bell size={20} /> },
      { name: "Analytics", path: "/analytics", icon: <BarChart2 size={20} /> },
    ],
    EMPLOYEE: [
      { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
      { name: "My Skills", path: "/my-skills", icon: <Award size={20} /> },
      { name: "My Assignments", path: "/my-assignments", icon: <UserCheck size={20} /> },
      { name: "Updates", path: "/updates", icon: <Bell size={20} /> },
    ],
    default: [{ name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> }],
  };

  const menuItems = menus[role] || menus.default;

  return (
    <div className={`${isCollapsed ? "w-20" : "w-72"} h-screen bg-slate-900 text-white flex flex-col shadow-2xl transition-all duration-300 relative`}>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-9 bg-blue-600 text-white p-1 rounded-md shadow-lg hover:bg-blue-700 transition-colors z-50 border border-slate-800"
      >
        {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>

      {/* Logo */}
      <div className={`p-6 flex items-center ${isCollapsed ? "justify-center" : "gap-3"} border-b border-slate-800/50 h-20`}>
        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent whitespace-nowrap overflow-hidden animate-in fade-in duration-300">
            TalentBridge
          </span>
        )}
      </div>

      {/* Menu Links */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {!isCollapsed && (
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4 animate-in fade-in duration-300">
            Menu
          </div>
        )}
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            title={isCollapsed ? item.name : ""}
            className={({ isActive }) =>
              `flex items-center ${isCollapsed ? "justify-center px-2" : "gap-3 px-4"} py-3.5 rounded-xl transition-all duration-200 group ${isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`
            }
          >
            <span className={`group-hover:scale-110 transition-transform duration-200 ${isCollapsed ? "" : ""}`}>
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="font-medium text-sm whitespace-nowrap overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-800/50">
        <button
          onClick={logout}
          title={isCollapsed ? "Sign Out" : ""}
          className={`w-full flex items-center ${isCollapsed ? "justify-center" : "justify-center gap-2"} bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl transition-all duration-200 font-medium text-sm group`}
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span className="whitespace-nowrap overflow-hidden animate-in fade-in duration-300">Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
