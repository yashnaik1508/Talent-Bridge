import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllSkills, createSkill } from "../../api/skillApi";
import { addEmployeeSkill } from "../../api/employeeSkillApi";
import { useAuth } from "../../context/AuthContext";
import { Search, Layers, Clock, Calendar, Save, ArrowLeft, Plus, Hammer, Tag } from "lucide-react";

export default function AddEmployeeSkill() {
  const [skills, setSkills] = useState([]);
  const [activeTab, setActiveTab] = useState("existing"); // existing | new

  // Existing Skill Form
  const [skillId, setSkillId] = useState("");

  // New Skill Form
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("");

  // Common Fields
  const [level, setLevel] = useState(1);
  const [yearsExperience, setYearsExperience] = useState(0);
  const [lastUsedYear, setLastUsedYear] = useState(new Date().getFullYear());

  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const [params] = useSearchParams();

  const { role } = useAuth();

  const userId = params.get("userId"); // only used by Admin/HR

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    const data = await getAllSkills();
    setSkills(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalSkillId = skillId;

      // 1. If creating new skill, create it first
      if (activeTab === "new") {
        if (!newSkillName.trim()) {
          alert("Skill name is required");
          setSubmitting(false);
          return;
        }

        // Check if skill already exists (case insensitive)
        const existing = skills.find(s => s.name.toLowerCase() === newSkillName.toLowerCase());
        if (existing) {
          finalSkillId = existing.skillId;
        } else {
          const res = await createSkill({ name: newSkillName, category: newSkillCategory });
          finalSkillId = res.skillId;
        }
      }

      // 2. Add Employee Skill
      const payload = {
        skillId: Number(finalSkillId),
        level: Number(level),
        yearsExperience: Number(yearsExperience),
        lastUsedYear: Number(lastUsedYear),
      };

      if (role === "ADMIN" || role === "HR") {
        payload.userId = Number(userId);
      }

      await addEmployeeSkill(payload);

      if (role === "EMPLOYEE") {
        navigate("/my-skills");
      } else {
        navigate(`/employees/${userId}/skills`);
      }
    } catch (err) {
      console.error("Failed to add skill", err);
      alert("Failed to add skill: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (role === "EMPLOYEE") {
      navigate("/my-skills");
    } else {
      navigate(`/employees/${userId}/skills`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        onClick={handleBack}
      >
        <ArrowLeft size={18} />
        <span>Back to Skills</span>
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Add Skill</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Add a new skill to the employee profile.</p>
      </div>

      {/* TABS */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-6 w-fit">
        <button
          onClick={() => setActiveTab("existing")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "existing"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
        >
          Select Existing
        </button>
        <button
          onClick={() => setActiveTab("new")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "new"
              ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
        >
          Create New
        </button>
      </div>

      <div className="glass-panel p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* EXISTING SKILL SELECT */}
          {activeTab === "existing" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Skill</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-slate-800 dark:text-white"
                  value={skillId}
                  onChange={(e) => setSkillId(e.target.value)}
                  required={activeTab === "existing"}
                >
                  <option value="">Choose a skill...</option>
                  {skills.map((s) => (
                    <option key={s.skillId} value={s.skillId}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-2">Can't find the skill? Switch to "Create New" tab.</p>
            </div>
          )}

          {/* NEW SKILL INPUTS */}
          {activeTab === "new" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Skill Name</label>
                <div className="relative">
                  <Hammer className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                    placeholder="Eg: Java, React"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    required={activeTab === "new"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                    placeholder="Eg: Frontend, Database"
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="border-t border-slate-100 dark:border-slate-700 my-6"></div>

          {/* COMMON FIELDS */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Proficiency Level (1-5)</label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none text-slate-800 dark:text-white"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="1">1 - Beginner</option>
                <option value="2">2 - Intermediate</option>
                <option value="3">3 - Advanced</option>
                <option value="4">4 - Expert</option>
                <option value="5">5 - Master</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Years of Experience</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Last Used Year</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                  value={lastUsedYear}
                  onChange={(e) => setLastUsedYear(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-70 transition-all hover:-translate-y-0.5"
            >
              <Save size={18} />
              {submitting ? "Saving..." : "Save Skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
