import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProjects, deleteProject } from "../../api/projectApi";
import { Plus, Edit2, Trash2, ListChecks, Calendar, Activity, Layers } from "lucide-react";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getAllProjects();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "OPEN": return "bg-blue-100 text-blue-700 border-blue-200";
      case "ONGOING": return "bg-orange-100 text-orange-700 border-orange-200";
      case "COMPLETED": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "ON HOLD": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "CANCELLED": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all your ongoing and past projects here.</p>
        </div>

        <Link
          to="/projects/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
        >
          <Plus size={20} />
          Add Project
        </Link>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">Project Name</th>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">Description</th>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">Start Date</th>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">Status</th>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {projects.map((p) => {
              const projectId = p.projectId || p.id;
              return (
                <tr key={projectId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="p-5">
                    <div className="font-bold text-slate-800 dark:text-white">{p.name}</div>
                  </td>
                  <td className="p-5">
                    <div className="text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate" title={p.description}>
                      {p.description || "No description"}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Calendar size={14} className="text-slate-400" />
                      {p.startDate?.slice(0, 10)}
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>

                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/projects/${projectId}/requirements`}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Requirements"
                      >
                        <ListChecks size={18} />
                      </Link>

                      <Link
                        to={`/projects/${projectId}/modules`}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Modules"
                      >
                        <Layers size={18} />
                      </Link>

                      <Link
                        to={`/projects/edit/${projectId}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </Link>

                      <button
                        onClick={() => handleDelete(projectId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {projects.length === 0 && (
              <tr>
                <td colSpan="5" className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <Activity size={48} className="text-slate-200" />
                    <p>No projects found. Start by adding one!</p>
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
