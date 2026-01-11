import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRequirementsByProject,
  addRequirement,
  deleteRequirement,
} from "../../api/requirementApi";
import { getAllSkills } from "../../api/skillApi";
import { ArrowLeft, Trash2, Plus, Search, Layers, BookOpen, UserPlus } from "lucide-react";

export default function ProjectRequirements() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    projectId: projectId,
    skillId: "",
    desiredLevel: 1,
  });

  // Load requirements + skills
  useEffect(() => {
    const loadData = async () => {
      try {
        const req = await getRequirementsByProject(projectId);
        setRequirements(req);

        const skillList = await getAllSkills();
        setSkills(skillList);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [projectId]);

  const handleAdd = async () => {
    if (!formData.skillId) {
      alert("Please select a skill");
      return;
    }

    try {
      await addRequirement({
        projectId: Number(projectId),
        skillId: Number(formData.skillId),
        desiredLevel: Number(formData.desiredLevel),
      });

      const updated = await getRequirementsByProject(projectId);
      setRequirements(updated);

      setFormData({ ...formData, skillId: "" });
    } catch (error) {
      console.error("Failed to add requirement", error);
      alert("Error adding requirement");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRequirement(id);
      const updated = await getRequirementsByProject(projectId);
      setRequirements(updated);
    } catch (error) {
      console.error("Failed to delete requirement", error);
    }
  };

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
          Project Requirements
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage skill requirements for Project #{projectId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* REQUIREMENTS LIST */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Layers className="text-blue-500" size={20} />
                Current Requirements
              </h2>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                {requirements.length} Skills
              </span>
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">Loading requirements...</div>
            ) : requirements.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                <BookOpen className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={48} />
                <p className="text-slate-500 dark:text-slate-400 font-medium">No requirements added yet.</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add skills from the panel on the right.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requirements.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-blue-200 dark:hover:border-blue-800 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{req.skillName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Level {req.desiredLevel}</span>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <div key={star} className={`w-1.5 h-1.5 rounded-full ${star <= req.desiredLevel ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      onClick={() => handleDelete(req.id)}
                      title="Remove Requirement"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {requirements.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button
                  onClick={() => navigate(`/matching/find/${projectId}`)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <UserPlus size={18} />
                  Find Candidates
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ADD REQUIREMENT */}
        <div>
          <div className="glass-panel p-6 rounded-2xl sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
              <Plus className="text-blue-500" size={20} />
              Add Requirement
            </h2>

            <div className="space-y-5">
              {/* SKILL DROPDOWN */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Skill</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-slate-800 dark:text-white"
                    value={formData.skillId}
                    onChange={(e) =>
                      setFormData({ ...formData, skillId: e.target.value })
                    }
                  >
                    <option value="">Choose a skill...</option>
                    {skills.map((skill) => (
                      <option key={skill.skillId} value={skill.skillId}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LEVEL */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Required Level</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-slate-800 dark:text-white"
                    value={formData.desiredLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, desiredLevel: e.target.value })
                    }
                  >
                    <option value="1">Level 1 - Beginner</option>
                    <option value="2">Level 2 - Intermediate</option>
                    <option value="3">Level 3 - Advanced</option>
                    <option value="4">Level 4 - Expert</option>
                    <option value="5">Level 5 - Master</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 mt-2"
              >
                <Plus size={18} />
                Add Requirement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
