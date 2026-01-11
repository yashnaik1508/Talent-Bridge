import { useEffect, useState } from "react";
import { getMyAssignments } from "../../api/assignmentApi";
import { getProjectById } from "../../api/projectApi";
import { Briefcase, User, Activity, Loader, X, Calendar, FileText } from "lucide-react";

export default function MyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMyAssignments();
        setAssignments(res);
      } catch (e) {
        console.error("Failed to load assignments", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleViewProject = async (projectId) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      const project = await getProjectById(projectId);
      setSelectedProject(project);
    } catch (e) {
      console.error("Failed to load project details", e);
      alert("Failed to load project details.");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto relative">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">My Assignments</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage your current project assignments.</p>
      </div>

      {assignments.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">No Assignments Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            You haven't been assigned to any projects yet. Check back later or contact your manager.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {assignments.map((a) => {
            // Calculate progress
            const storedModules = localStorage.getItem(`project_modules_${a.projectId}`);
            const modules = storedModules ? JSON.parse(storedModules) : [];
            const totalModules = modules.length;
            const completedModules = modules.filter(m => m.status === "COMPLETED").length;
            const progress = totalModules === 0 ? 0 : Math.round((completedModules / totalModules) * 100);

            return (
              <div key={a.assignmentId} className="glass-panel p-6 rounded-xl hover:shadow-lg transition-all border border-slate-200/50 dark:border-slate-700/50 group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                      {a.projectName}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-blue-500" />
                        <span>{a.roleOnProject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity size={16} className="text-emerald-500" />
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium border border-slate-200 dark:border-slate-700">
                          {a.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewProject(a.projectId)}
                    className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    title="View Project Details"
                  >
                    <Briefcase size={20} />
                  </button>
                </div>

                {/* Progress Section */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Project Progress</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
                    <span>{completedModules} of {totalModules} modules completed</span>
                    <span>{totalModules === 0 ? "No modules" : (progress === 100 ? "Completed" : "In Progress")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Project Details</h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {modalLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="animate-spin text-blue-500" size={32} />
                </div>
              ) : selectedProject ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{selectedProject.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${selectedProject.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                        : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                        }`}>
                        {selectedProject.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Description</label>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedProject.description || "No description available."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Start Date</label>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Calendar size={16} className="text-slate-400" />
                          <span>{selectedProject.startDate}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">End Date</label>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Calendar size={16} className="text-slate-400" />
                          <span>{selectedProject.endDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Failed to load project details.
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
