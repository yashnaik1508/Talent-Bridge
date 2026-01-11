import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { findMatches } from "../../api/matchApi";
import { createAssignment } from "../../api/assignmentApi";
import { ArrowLeft, UserCheck, Star, Briefcase, Clock, Calendar, Loader } from "lucide-react";

export default function MatchCandidates() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [candidates, setCandidates] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await findMatches(projectId);
                setCandidates(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [projectId]);

    const handleAssign = async (userId) => {
        try {
            await createAssignment({
                projectId: Number(projectId),
                userId: Number(userId),
                role: "Developer",
            });

            setAssignedUsers(prev => {
                const newSet = new Set(prev);
                newSet.add(userId);
                return newSet;
            });
        } catch (err) {
            console.error(err);
            alert("Failed to assign employee");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <button
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
                onClick={() => navigate("/projects")}
            >
                <ArrowLeft size={18} />
                <span>Back to Projects</span>
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                    Matched Candidates
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    AI-recommended candidates for Project #{projectId}
                </p>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                                Name
                            </th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                                Score
                            </th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                                Skill Match
                            </th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                                Experience
                            </th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                                Availability
                            </th>
                            <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider text-right">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {candidates.map((c) => (
                            <tr
                                key={c.userId}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                            >
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                            <UserCheck size={20} />
                                        </div>
                                        <span className="font-medium text-slate-800 dark:text-white">
                                            {c.employeeName}
                                        </span>
                                    </div>
                                </td>

                                <td className="p-5">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold ${c.totalScore >= 80 ? 'text-emerald-500' : c.totalScore >= 50 ? 'text-yellow-500' : 'text-slate-500'}`}>
                                            {c.totalScore.toFixed(1)}%
                                        </span>
                                    </div>
                                </td>

                                <td className="p-5">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <Star size={16} className="text-slate-400" />
                                        {c.skillScore.toFixed(1)}
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <Briefcase size={16} className="text-slate-400" />
                                        {c.experienceScore.toFixed(1)}
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                        <Clock size={16} className="text-slate-400" />
                                        {c.availabilityScore.toFixed(1)}
                                    </div>
                                </td>

                                <td className="p-5 text-right">
                                    {assignedUsers.has(c.userId) ? (
                                        <button
                                            disabled
                                            className="bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 px-4 py-2 rounded-xl text-sm font-medium cursor-not-allowed border border-slate-200 dark:border-slate-600"
                                        >
                                            Assigned
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAssign(c.userId)}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
                                        >
                                            Assign
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}

                        {candidates.length === 0 && (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="p-12 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                                        <UserCheck size={48} className="mb-4 opacity-50" />
                                        <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No candidates found</p>
                                        <p className="text-sm mt-1">Try adjusting the project requirements.</p>
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
