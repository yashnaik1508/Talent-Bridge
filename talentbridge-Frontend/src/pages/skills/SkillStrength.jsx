import { useEffect, useState } from "react";
import { getAllEmployeeSkills } from "../../api/employeeSkillApi";
import { User, Search, Filter, Star, Zap, Award, Trophy } from "lucide-react";

export default function SkillStrength() {
    const [employeeSkills, setEmployeeSkills] = useState([]);
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            setFilteredSkills(employeeSkills);
            return;
        }
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = employeeSkills.filter(emp =>
            emp.userName.toLowerCase().includes(lowerTerm) ||
            emp.skills.some(skill => skill.skillName.toLowerCase().includes(lowerTerm))
        );
        setFilteredSkills(filtered);
    }, [searchTerm, employeeSkills]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllEmployeeSkills();

            // Group by User
            const grouped = {};
            data.forEach(item => {
                const uid = item.userId;
                if (!grouped[uid]) {
                    grouped[uid] = {
                        userId: uid,
                        userName: item.userName || "Unknown Employee",
                        skills: []
                    };
                }
                grouped[uid].skills.push({
                    skillName: item.skillName,
                    level: item.level,
                    yearsExperience: item.yearsExperience
                });
            });

            // Sort skills by level (descending) for each employee
            Object.values(grouped).forEach(emp => {
                emp.skills.sort((a, b) => b.level - a.level);
            });

            const result = Object.values(grouped);
            setEmployeeSkills(result);
            setFilteredSkills(result);
        } catch (err) {
            console.error("Error loading employee skills:", err);
            setError(err.message || "Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 5: return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700";
            case 4: return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
            case 3: return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700";
            default: return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
        }
    };

    const getLevelIcon = (level) => {
        switch (level) {
            case 5: return <Trophy size={12} className="mr-1" />;
            case 4: return <Award size={12} className="mr-1" />;
            case 3: return <Star size={12} className="mr-1" />;
            default: return <Zap size={12} className="mr-1" />;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <p className="text-slate-500 mt-6 font-medium animate-pulse">Gathering talent data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
                    <div className="text-red-500 text-3xl">⚠️</div>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Unable to load data</h3>
                <p className="text-slate-500 mb-6 max-w-md">{error}</p>
                <button
                    onClick={loadData}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Talent <span className="text-blue-600">Matrix</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                        Comprehensive view of employee skills and proficiency levels.
                    </p>
                </div>

                <div className="relative group w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by employee or skill..."
                        className="block w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-white dark:bg-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <th className="p-5 font-semibold text-slate-600 dark:text-slate-300 w-1/3 text-sm uppercase tracking-wider">Employee</th>
                                <th className="p-5 font-semibold text-slate-600 dark:text-slate-300 text-sm uppercase tracking-wider">
                                    <div className="flex items-center gap-2">
                                        <Filter size={14} />
                                        Skills & Proficiency
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {filteredSkills.length === 0 ? (
                                <tr>
                                    <td colSpan="2" className="p-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <Search size={48} className="mb-4 opacity-20" />
                                            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No matching results found</p>
                                            <p className="text-sm mt-1">Try adjusting your search terms</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSkills.map((emp) => (
                                    <tr key={emp.userId} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200">
                                        <td className="p-5 align-top">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 transform group-hover:scale-105 transition-transform duration-300">
                                                    {emp.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-800 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                        {emp.userName}
                                                    </div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                                                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                                                        ID: #{emp.userId.toString().padStart(4, '0')}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex flex-wrap gap-2">
                                                {emp.skills.length > 0 ? (
                                                    emp.skills.map((skill, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-lg border text-sm font-medium transition-all hover:shadow-md ${getLevelColor(skill.level)}`}
                                                        >
                                                            {getLevelIcon(skill.level)}
                                                            <span>{skill.skillName}</span>
                                                            <span className="ml-1.5 px-1.5 py-0.5 bg-white/50 dark:bg-black/20 rounded text-[10px] font-bold uppercase tracking-wide">
                                                                Lvl {skill.level}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 italic text-sm">No skills recorded</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
