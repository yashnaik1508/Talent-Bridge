// src/pages/matching/ReassignmentDashboard.jsx

import { useEffect, useState } from "react";
import { getAssignments, updateAssignment } from "../../api/assignmentApi";

export default function ReassignmentDashboard() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const data = await getAssignments();
            setAssignments(data);
        } catch (error) {
            console.error("Failed to fetch assignments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateAssignment(id, { status: newStatus });
            fetchAssignments();
        } catch (error) {
            console.error("Failed to update", error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">

            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                    Assignment Dashboard
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage active project assignments and resource allocation.</p>
            </div>

            {/* Table Container */}
            <div className="glass-panel rounded-2xl overflow-hidden">

                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                                Employee
                            </th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                                Project
                            </th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                                Role
                            </th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                                Status
                            </th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider text-right">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {assignments.map((item) => (
                            <tr
                                key={item.assignmentId}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <td className="p-5 font-medium text-slate-800 dark:text-white">
                                    {item.employeeName}
                                </td>
                                <td className="p-5 text-slate-600 dark:text-slate-300">
                                    {item.projectName}
                                </td>
                                <td className="p-5 text-slate-600 dark:text-slate-300">
                                    {item.roleOnProject || item.role}
                                </td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${item.status === 'ASSIGNED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                                        {item.status}
                                    </span>
                                </td>

                                <td className="p-5 text-right">
                                    {item.status === "ASSIGNED" ? (
                                        <button
                                            onClick={() =>
                                                handleStatusChange(item.assignmentId, "RELEASED")
                                            }
                                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
                                        >
                                            Release
                                        </button>
                                    ) : (
                                        <span className="text-slate-400 dark:text-slate-600 select-none">
                                            —
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {assignments.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-400 dark:text-slate-500">
                                    No assignments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
