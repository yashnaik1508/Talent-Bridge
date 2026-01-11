import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../api/userApi";
import { Send, Trash2, Clock, User } from "lucide-react";

export default function Updates() {
    const { role, authToken } = useAuth();
    const [updates, setUpdates] = useState([]);
    const [newUpdate, setNewUpdate] = useState("");
    const [to, setTo] = useState("ALL");
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("ALL");

    // Update default 'to' when role changes (e.g. on initial load)
    useEffect(() => {
        // Default is ALL, which is fine for everyone now
    }, [role]);

    let userEmail = "";
    if (authToken) {
        try {
            const payload = JSON.parse(atob(authToken.split(".")[1]));
            userEmail = payload.email;
        } catch (e) {
            console.error("Token decode failed");
        }
    }

    useEffect(() => {
        const storedUpdates = JSON.parse(localStorage.getItem("talentbridge_updates") || "[]");
        setUpdates(storedUpdates);

        const fetchUsers = async () => {
            try {
                const data = await getAllUsers();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
    }, []);

    const handlePostUpdate = (e) => {
        e.preventDefault();
        if (!newUpdate.trim()) {
            alert("Please enter a message to post.");
            return;
        }

        const update = {
            id: Date.now(),
            content: newUpdate,
            author: userEmail,
            role: role,
            to: to,
            targetUser: selectedUser,
            timestamp: new Date().toLocaleString()
        };

        const updatedList = [update, ...updates];
        setUpdates(updatedList);
        localStorage.setItem("talentbridge_updates", JSON.stringify(updatedList));
        setNewUpdate("");
        setSelectedUser("ALL");
    };

    const handleDelete = (id) => {
        const updatedList = updates.filter(u => u.id !== id);
        setUpdates(updatedList);
        localStorage.setItem("talentbridge_updates", JSON.stringify(updatedList));
    };

    return (
        <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Team Updates</h1>
                <p className="text-slate-500 dark:text-slate-400">Share news and announcements with the team.</p>
            </div>

            {/* Post Update Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8">
                <form onSubmit={handlePostUpdate}>
                    <div className="mb-4 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">To Role</label>
                            <select
                                value={to}
                                onChange={(e) => {
                                    setTo(e.target.value);
                                    setSelectedUser("ALL");
                                }}
                                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            >
                                {role === "EMPLOYEE" ? (
                                    <>
                                        <option value="ALL">All Roles</option>
                                        <option value="HR">HR</option>
                                        <option value="PM">Project Manager</option>
                                        <option value="EMPLOYEE">Employee</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="ALL">All Roles</option>
                                        <option value="ADMIN">Admin</option>
                                        <option value="HR">HR</option>
                                        <option value="PM">Project Manager</option>
                                        <option value="EMPLOYEE">Employee</option>
                                    </>
                                )}
                            </select>
                        </div>

                        {to !== "ALL" && (
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">To User</label>
                                <select
                                    value={selectedUser}
                                    onChange={(e) => setSelectedUser(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                >
                                    <option value="ALL">All {to}s</option>
                                    {users
                                        .filter(u => u.role === to && u.email !== userEmail)
                                        .map(u => (
                                            <option key={u.userId} value={u.email}>
                                                {u.fullName} ({u.email})
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        )}
                    </div>
                    <textarea
                        value={newUpdate}
                        onChange={(e) => setNewUpdate(e.target.value)}
                        placeholder="What's happening?"
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-800 dark:text-slate-200"
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all active:scale-95"
                        >
                            <Send size={18} />
                            Post Update
                        </button>
                    </div>
                </form>
            </div>

            {/* Updates List */}
            <div className="space-y-6">
                {updates.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <p>No updates yet. Be the first to post!</p>
                    </div>
                ) : (
                    updates
                        .filter(update => {
                            // If I am the author, I can see it
                            if (update.author === userEmail) return true;

                            // If it's for everyone, I can see it
                            if (update.to === "ALL") return true;

                            // If it's for my role
                            if (update.to === role) {
                                // If specific user is ALL, I can see it
                                if (!update.targetUser || update.targetUser === "ALL") return true;
                                // If specific user matches my email, I can see it
                                if (update.targetUser === userEmail) return true;
                            }

                            return false;
                        })
                        .map((update) => (
                            <div key={update.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-all hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                                            {update.author[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-slate-800 dark:text-white">{update.author}</h3>
                                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">
                                                    {update.role}
                                                </span>
                                                <span className="text-slate-400 dark:text-slate-500 text-xs">•</span>
                                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                    To: {update.to} {update.targetUser && update.targetUser !== "ALL" ? `(${update.targetUser})` : ""}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                <Clock size={12} />
                                                <span>{update.timestamp}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {(role === "ADMIN" || update.author === userEmail) && (
                                        <button
                                            onClick={() => handleDelete(update.id)}
                                            className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete update"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>

                                <div className="pl-[52px]">
                                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {update.content}
                                    </p>
                                </div>
                            </div>
                        ))
                )}
            </div>
        </div >
    );
}
