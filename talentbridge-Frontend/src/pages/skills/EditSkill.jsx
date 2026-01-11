import { useEffect, useState } from "react";
import { getSkillById, updateSkill } from "../../api/skillApi";
import { useParams, useNavigate } from "react-router-dom";
import { Code, Tag, Save, Loader } from "lucide-react";

export default function EditSkill() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ name: "", category: "" });

  useEffect(() => {
    loadSkill();
  }, []);

  const loadSkill = async () => {
    try {
      const data = await getSkillById(id);
      setForm({ name: data.name, category: data.category });
    } catch (err) {
      console.error("Error loading skill:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateSkill(id, form);
      navigate("/skills");
    } catch (err) {
      console.error("Error updating skill:", err);
    } finally {
      setSubmitting(false);
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Edit Skill</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Update skill details and category.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Skill Name</label>
            <div className="relative">
              <Code className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                placeholder="e.g. React, Java, Python"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                placeholder="e.g. Frontend, Backend, DevOps"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate("/skills")}
              className="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-70 transition-all hover:-translate-y-0.5"
            >
              <Save size={18} />
              {submitting ? "Updating..." : "Update Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
