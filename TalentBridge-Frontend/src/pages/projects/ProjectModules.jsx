import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, CheckCircle, Circle, Layers } from "lucide-react";
import { getProjectById } from "../../api/projectApi";

export default function ProjectModules() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [modules, setModules] = useState([]);
    const [newModuleName, setNewModuleName] = useState("");
    const [newModuleDescription, setNewModuleDescription] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch project details for the header
                const projectData = await getProjectById(id);
                setProject(projectData);

                // Load modules from local storage
                const storedModules = localStorage.getItem(`project_modules_${id}`);
                if (storedModules) {
                    setModules(JSON.parse(storedModules));
                }
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const saveModules = (updatedModules) => {
        setModules(updatedModules);
        localStorage.setItem(`project_modules_${id}`, JSON.stringify(updatedModules));
    };

    const handleAddModule = (e) => {
        e.preventDefault();
        if (!newModuleName.trim()) {
            alert("Please enter a module name");
            return;
        }

        const newModule = {
            id: Date.now(),
            name: newModuleName,
            description: newModuleDescription,
            status: "PENDING" // or "COMPLETED"
        };

        const updatedModules = [...modules, newModule];
        saveModules(updatedModules);
        setNewModuleName("");
        setNewModuleDescription("");
    };

    const toggleStatus = (moduleId) => {
        const updatedModules = modules.map(m => {
            if (m.id === moduleId) {
                return { ...m, status: m.status === "COMPLETED" ? "PENDING" : "COMPLETED" };
            }
            return m;
        });
        saveModules(updatedModules);
    };

    const handleDelete = (moduleId) => {
        if (!window.confirm("Delete this module?")) return;
        const updatedModules = modules.filter(m => m.id !== moduleId);
        saveModules(updatedModules);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/projects")}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {project?.name || "Project"} Modules
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage development modules and their status</p>
                </div>
            </div>

            {/* Add Module Form */}
            <div className="glass-panel p-6 rounded-2xl">
                <form onSubmit={handleAddModule} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newModuleName}
                            onChange={(e) => setNewModuleName(e.target.value)}
                            placeholder="Enter module name (e.g., User Authentication)"
                            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all whitespace-nowrap active:scale-95"
                        >
                            <Plus size={20} />
                            Add Module
                        </button>
                    </div>
                    <textarea
                        value={newModuleDescription}
                        onChange={(e) => setNewModuleDescription(e.target.value)}
                        placeholder="Enter module description (optional)"
                        rows="2"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400 resize-none"
                    />
                </form>
            </div>

            {/* Modules List */}
            <div className="space-y-3">
                {modules.length === 0 ? (
                    <div className="glass-panel p-12 rounded-2xl text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Layers className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">No Modules Yet</h3>
                        <p className="text-slate-500 dark:text-slate-400">Add modules to track project progress.</p>
                    </div>
                ) : (
                    modules.map((module) => (
                        <div
                            key={module.id}
                            className="glass-panel p-4 rounded-xl flex items-center justify-between group hover:border-blue-500/30 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <button
                                    onClick={() => toggleStatus(module.id)}
                                    className={`mt-1 p-2 rounded-full transition-colors ${module.status === "COMPLETED"
                                        ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                                        : "text-slate-300 hover:text-slate-400"
                                        }`}
                                >
                                    {module.status === "COMPLETED" ? <CheckCircle size={24} /> : <Circle size={24} />}
                                </button>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className={`font-medium text-lg ${module.status === "COMPLETED"
                                            ? "text-slate-400 dark:text-slate-500 line-through"
                                            : "text-slate-800 dark:text-white"
                                            }`}>
                                            {module.name}
                                        </h3>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${module.status === "COMPLETED"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            }`}>
                                            {module.status}
                                        </span>
                                    </div>
                                    {module.description && (
                                        <p className={`text-sm mt-1 ${module.status === "COMPLETED"
                                            ? "text-slate-400 dark:text-slate-600"
                                            : "text-slate-500 dark:text-slate-400"
                                            }`}>
                                            {module.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => handleDelete(module.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
