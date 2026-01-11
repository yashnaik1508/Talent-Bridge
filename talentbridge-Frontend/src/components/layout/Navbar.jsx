import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, ChevronDown, Check, LogOut, User, Settings, Plus, UserPlus, Briefcase, Layers, Moon, Sun } from "lucide-react";
import { getMyAssignments } from "../../api/assignmentApi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const { authToken, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const quickActionsRef = useRef(null);

  let userEmail = "";
  let userRole = "";

  if (authToken) {
    try {
      const payload = JSON.parse(atob(authToken.split(".")[1]));
      userEmail = payload.email;
      userRole = payload.role;
    } catch (e) {
      console.error("Token decode failed");
    }
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setShowQuickActions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Polling for new assignments and updates
  useEffect(() => {
    const checkForNotifications = async () => {
      let newNotifs = [];

      // 1. Check for Assignments (only for employees)
      if (userRole === "EMPLOYEE") {
        try {
          const assignments = await getMyAssignments();
          const currentIds = assignments.map(a => a.assignmentId);
          const storageKey = `seen_assignments_${userEmail}`;
          const seenIds = JSON.parse(localStorage.getItem(storageKey) || "[]");

          const newAssignments = assignments.filter(a => !seenIds.includes(a.assignmentId));

          if (newAssignments.length > 0) {
            const assignmentNotifs = newAssignments.map(a => ({
              id: `assign_${a.assignmentId}`,
              message: `New assignment: ${a.projectName}`,
              time: "Just now",
              read: false,
              type: 'assignment',
              link: '/my-assignments'
            }));
            newNotifs = [...newNotifs, ...assignmentNotifs];
            localStorage.setItem(storageKey, JSON.stringify(currentIds));
          } else if (seenIds.length === 0 && currentIds.length > 0) {
            localStorage.setItem(storageKey, JSON.stringify(currentIds));
          }
        } catch (error) {
          console.error("Failed to poll assignments", error);
        }
      }

      // 2. Check for Updates (for everyone)
      try {
        const allUpdates = JSON.parse(localStorage.getItem("talentbridge_updates") || "[]");
        const updatesKey = `seen_updates_${userEmail}`;
        const seenUpdateIds = JSON.parse(localStorage.getItem(updatesKey) || "[]");

        // Filter relevant updates
        const relevantUpdates = allUpdates.filter(u => {
          // Don't notify author
          if (u.author === userEmail) return false;

          // Check if already seen
          if (seenUpdateIds.includes(u.id)) return false;

          // Check targeting
          const isForMyRole = u.to === "ALL" || u.to === userRole;
          const isForMe = !u.targetUser || u.targetUser === "ALL" || u.targetUser === userEmail;

          return isForMyRole && isForMe;
        });

        if (relevantUpdates.length > 0) {
          const updateNotifs = relevantUpdates.map(u => ({
            id: `update_${u.id}`,
            message: `New update from ${u.author}`,
            time: "Just now",
            read: false,
            type: 'update',
            link: '/updates'
          }));
          newNotifs = [...newNotifs, ...updateNotifs];

          // Mark as seen
          const newSeenIds = [...seenUpdateIds, ...relevantUpdates.map(u => u.id)];
          localStorage.setItem(updatesKey, JSON.stringify(newSeenIds));
        }
      } catch (error) {
        console.error("Failed to poll updates", error);
      }

      if (newNotifs.length > 0) {
        setNotifications(prev => [...newNotifs, ...prev]);
        setHasUnread(true);
        playNotificationSound();
      }
    };

    const playNotificationSound = () => {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();

        // Create two oscillators for a richer "bell" tone
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        // Main tone (C6)
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1046.50, ctx.currentTime);

        // Overtone (E6) - Major third for a pleasant harmony
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.51, ctx.currentTime);

        // Envelope for a "ding" sound
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.01); // Quick attack
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8); // Smooth decay

        osc1.start(now);
        osc2.start(now);

        osc1.stop(now + 0.8);
        osc2.stop(now + 0.8);
      } catch (e) {
        console.error("Audio play failed", e);
      }
    };

    // Initial check
    checkForNotifications();

    // Poll every 5 seconds
    const intervalId = setInterval(checkForNotifications, 5000);

    return () => clearInterval(intervalId);
  }, [userRole, userEmail]);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      setHasUnread(false);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setShowDropdown(false);
  };

  const handleQuickAction = (path) => {
    navigate(path);
    setShowQuickActions(false);
  };

  return (
    <div className="sticky top-0 z-30 w-full glass-panel border-b border-white/20 dark:border-slate-700/50 px-8 py-4 flex items-center justify-between mb-6 transition-colors">

      <div className="flex items-center gap-4">
        {/* THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${darkMode ? "bg-slate-700" : "bg-slate-200"
            }`}
          title="Toggle Theme"
        >
          <div
            className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-300 flex items-center justify-center ${darkMode ? "translate-x-7" : "translate-x-0"
              }`}
          >
            {darkMode ? (
              <Moon size={12} className="text-slate-700" />
            ) : (
              <Sun size={12} className="text-orange-500" />
            )}
          </div>
        </button>

        {/* Quick Actions Dropdown */}
        <div className="relative hidden md:block" ref={quickActionsRef}>
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 font-medium text-sm"
          >
            <Plus size={18} />
            <span>Quick Actions</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${showQuickActions ? 'rotate-180' : ''}`} />
          </button>

          {showQuickActions && (
            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-1.5">
                {["ADMIN", "HR"].includes(userRole) && (
                  <button
                    onClick={() => handleQuickAction('/employees/add')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <UserPlus size={16} />
                    </div>
                    <span className="text-sm font-medium">Add Employee</span>
                  </button>
                )}

                {["ADMIN", "PM"].includes(userRole) && (
                  <button
                    onClick={() => handleQuickAction('/projects/add')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                      <Briefcase size={16} />
                    </div>
                    <span className="text-sm font-medium">Add Project</span>
                  </button>
                )}

                <button
                  onClick={() => handleQuickAction('/skills/add')}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Layers size={16} />
                  </div>
                  <span className="text-sm font-medium">Add Skill</span>
                </button>

                {["ADMIN", "PM"].includes(userRole) && (
                  <button
                    onClick={() => {
                      // If we have an ID from params and we are in project context, go to modules
                      // Otherwise go to project list
                      const projectId = window.location.pathname.split('/')[2]; // Simple extraction or use params if available
                      if (projectId && !isNaN(projectId)) {
                        handleQuickAction(`/projects/${projectId}/modules`);
                      } else {
                        handleQuickAction('/projects');
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Layers size={16} />
                    </div>
                    <span className="text-sm font-medium">Add Module</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleBellClick}
            className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <Bell size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => { navigate(n.link || '/dashboard'); setShowDropdown(false); }}>
                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{n.message}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>

        <div className="relative" ref={profileDropdownRef}>
          <div
            className="flex items-center gap-3 pl-2 cursor-pointer group"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{userEmail}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{userRole}</p>
            </div>

            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/20 ring-2 ring-white dark:ring-slate-700">
              {userEmail ? userEmail[0].toUpperCase() : "U"}
            </div>

            <ChevronDown size={16} className={`text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
          </div>

          {/* Profile Dropdown */}
          {showProfileDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Signed in as</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{userEmail}</p>
              </div>

              <div className="p-2">
                <button
                  onClick={() => {
                    navigate("/user-info");
                    setShowProfileDropdown(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                    <User size={18} className="text-slate-400" />
                    <div>
                      <p className="text-sm font-medium">Account Info</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{userRole}</p>
                    </div>
                  </div>
                </button>

                {userRole === "ADMIN" && (
                  <button
                    onClick={() => {
                      navigate("/settings");
                      setShowProfileDropdown(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                      <Settings size={18} className="text-slate-400" />
                      <div>
                        <p className="text-sm font-medium">Settings</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Platform settings</p>
                      </div>
                    </div>
                  </button>
                )}

                <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>

                <button
                  onClick={logout}
                  className="w-full px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors flex items-center gap-3 text-sm font-medium"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
