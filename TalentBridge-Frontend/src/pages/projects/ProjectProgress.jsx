import { useState, useEffect } from "react";
import { getAllProjects } from "../../api/projectApi";
import { PieChart, CheckCircle, Circle, Layers } from "lucide-react";

export default function ProjectProgress() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const allProjects = await getAllProjects();

                // Calculate progress for each project
                const projectsWithProgress = allProjects.map(project => {
                    const projectId = project.projectId || project.id;
                    const storedModules = localStorage.getItem(`project_modules_${projectId}`);
                    const modules = storedModules ? JSON.parse(storedModules) : [];

                    const totalModules = modules.length;
                    const completedModules = modules.filter(m => m.status === "COMPLETED").length;
                    const progress = totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100);

                    return {
                        ...project,
                        modules,
                        totalModules,
                        completedModules,
                        progress
                    };
                });

                setProjects(projectsWithProgress);
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                    <PieChart className="text-white" size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Project Progress</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track completion status across all projects</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                    <div key={project.projectId || project.id} className="glass-panel p-6 rounded-2xl flex flex-col h-full hover:border-blue-500/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 line-clamp-1" title={project.name}>
                                    {project.name}
                                </h3>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${project.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                        project.status === 'ONGOING' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                            'bg-slate-100 text-slate-700 border-slate-200'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {project.progress}%
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
                            <div
                                className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                style={{ width: `${project.progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <Layers size={16} />
                                <span>{project.totalModules} Modules</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-emerald-500" />
                                <span>{project.completedModules} Completed</span>
                            </div>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-full glass-panel p-12 rounded-2xl text-center">
                        <p className="text-slate-500 dark:text-slate-400">No projects found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
