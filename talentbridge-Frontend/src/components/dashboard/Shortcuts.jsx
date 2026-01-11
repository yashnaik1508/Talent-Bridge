// src/components/dashboard/Shortcuts.jsx
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Users, Folder, BarChart2, Settings, Hammer, Search, Briefcase, StickyNote } from "lucide-react";

export default function Shortcuts() {
  const { role } = useAuth();
  const navigate = useNavigate();

  const shortcuts = {
    ADMIN: [
      { name: "Employees", icon: <Users size={18} />, path: "/employees", colorClass: "text-blue-600" },
      { name: "Projects", icon: <Folder size={18} />, path: "/projects", colorClass: "text-orange-500" },
      { name: "Analytics", icon: <BarChart2 size={18} />, path: "/analytics", colorClass: "text-purple-600" },
      { name: "Notes", icon: <StickyNote size={18} />, path: "/notes", colorClass: "text-yellow-500" },
      { name: "Settings", icon: <Settings size={18} />, path: "/settings", colorClass: "text-slate-600" },
    ],

    HR: [
      { name: "Employees", icon: <Users size={18} />, path: "/employees", colorClass: "text-blue-600" },
      { name: "Skills", icon: <Hammer size={18} />, path: "/skills", colorClass: "text-emerald-600" },
      { name: "Analytics", icon: <BarChart2 size={18} />, path: "/analytics", colorClass: "text-purple-600" },
      { name: "Notes", icon: <StickyNote size={18} />, path: "/notes", colorClass: "text-yellow-500" },
    ],

    PM: [
      { name: "Projects", icon: <Folder size={18} />, path: "/projects", colorClass: "text-orange-500" },
      { name: "Matching", icon: <Search size={18} />, path: "/matching", colorClass: "text-pink-600" },
      { name: "Analytics", icon: <BarChart2 size={18} />, path: "/analytics", colorClass: "text-purple-600" },
      { name: "Notes", icon: <StickyNote size={18} />, path: "/notes", colorClass: "text-yellow-500" },
    ],

    EMPLOYEE: [
      { name: "My Skills", icon: <Hammer size={18} />, path: "/my-skills", colorClass: "text-emerald-600" },
      { name: "Assignments", icon: <Briefcase size={18} />, path: "/my-assignments", colorClass: "text-blue-600" },
      { name: "Notes", icon: <StickyNote size={18} />, path: "/notes", colorClass: "text-yellow-500" },
    ],
  };

  const items = shortcuts[role] || [];

  return (
    <div className="flex gap-3">
      {items.map((item) => (
        <button
          key={item.name}
          onClick={() => navigate(item.path)}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2.5 shadow-sm rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all border border-slate-100 dark:border-slate-700 group"
        >
          <span className={`${item.colorClass} group-hover:scale-110 transition-transform`}>{item.icon}</span>
          <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{item.name}</span>
        </button>
      ))}
    </div>
  );
}
