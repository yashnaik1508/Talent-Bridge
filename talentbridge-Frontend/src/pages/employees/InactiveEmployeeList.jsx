// src/pages/employees/InactiveEmployeeList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getInactiveUsers, reactivateUser } from "../../api/userApi";
import { Search, ArrowLeft, Users, Mail, Phone, Shield, CheckCircle } from "lucide-react";

export default function InactiveEmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const data = await getInactiveUsers();
            setEmployees(data);
        } catch (error) {
            console.error("Failed to fetch inactive employees", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleReactivate = async (id) => {
        if (window.confirm("Are you sure you want to reactivate this employee?")) {
            try {
                await reactivateUser(id);
                fetchData(); // Refresh list
            } catch (error) {
                console.error("Failed to reactivate user", error);
                alert("Failed to reactivate user");
            }
        }
    };

    const filteredEmployees = employees.filter((emp) =>
        `${emp.fullName} ${emp.email} ${emp.role} ${emp.phone}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const getRoleBadgeColor = (role) => {
        switch (role?.toUpperCase()) {
            case "ADMIN": return "bg-purple-100 text-purple-700 border-purple-200";
            case "HR": return "bg-pink-100 text-pink-700 border-pink-200";
            case "PM": return "bg-orange-100 text-orange-700 border-orange-200";
            default: return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button
                        onClick={() => navigate("/employees")}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-2 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Employees
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Inactive Employees</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">View former or inactive employees.</p>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name, email, role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                />
            </div>

            {/* Employee List */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">Employee</th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">Contact</th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">Role</th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider text-right">Status</th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {filteredEmployees.map((emp) => (
                            <tr key={emp.userId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">

                                {/* Name & Avatar */}
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center font-bold">
                                            {emp.fullName?.[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-600 dark:text-slate-300">{emp.fullName}</div>
                                            <div className="text-xs text-slate-400">ID: {emp.userId}</div>
                                        </div>
                                    </div>
                                </td>

                                {/* Contact Info */}
                                <td className="p-5">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <Mail size={14} className="text-slate-400" />
                                            {emp.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <Phone size={14} className="text-slate-400" />
                                            {emp.phone || "N/A"}
                                        </div>
                                    </div>
                                </td>

                                {/* Role Badge */}
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex w-fit items-center gap-1 opacity-70 ${getRoleBadgeColor(emp.role)}`}>
                                        <Shield size={12} />
                                        {emp.role}
                                    </span>
                                </td>

                                {/* Status */}
                                <td className="p-5 text-right">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold border bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                                        INACTIVE
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="p-5 text-right">
                                    <button
                                        onClick={() => handleReactivate(emp.userId)}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Mark Active"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredEmployees.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-3">
                                        <Users size={48} className="text-slate-200" />
                                        <p>No inactive employees found.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
