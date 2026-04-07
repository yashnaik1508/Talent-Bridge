import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../../api/teamApi";
import { getAllProjects } from "../../api/projectApi";
import { FolderPlus, Users, Save } from "lucide-react";
import CustomDropdown from "../../components/ui/CustomDropdown";
import { useToast } from "../../context/ToastContext";

export default function AddTeam() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    projectId: "",
  });

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
        addToast("Could not load projects. Please try again.", "error");
      }
    }
    loadProjects();
  }, [addToast]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectChoice = (val) => {
    setFormData((prev) => ({ ...prev, projectId: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.projectId) {
      addToast("Please select a project.", "warning");
      return;
    }
    
    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        projectId: Number(formData.projectId)
      };

      await createTeam(payload);
      addToast("Team created successfully!", "success");
      navigate("/teams");
    } catch (error) {
      console.error("Failed to create team", error);
      const msg = error.response?.data?.message || error.message;
      addToast("Error creating team: " + msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const projectOptions = projects.map(p => ({ label: p.name, value: p.projectId.toString() }));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Create Team</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Initialize a new team for a specific project.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Team Name</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                placeholder="e.g. Frontend Superstars"
              />
            </div>
          </div>

          <CustomDropdown
            label="Assign to Project"
            placeholder="-- Choose a project --"
            icon={FolderPlus}
            options={projectOptions}
            value={formData.projectId}
            onChange={handleProjectChoice}
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate("/teams")}
              className="px-6 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-70 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              <Save size={18} />
              {submitting ? "Creating..." : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
