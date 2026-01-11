import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMySkills,
  getUserSkills,
  deleteEmployeeSkill,
} from "../../api/employeeSkillApi";
import { useAuth } from "../../context/AuthContext";
import { Plus, Trash2, ArrowLeft, Award, Calendar, Clock, Layers } from "lucide-react";

export default function EmployeeSkills() {
  const { id: paramUserId } = useParams(); // for /employees/:id/skills
  const { user, role } = useAuth(); // user contains { id }
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSkills();
  }, [paramUserId, user?.id]);

  const loadSkills = async () => {
    try {
      setLoading(true);
      // If admin/HR viewing someone else's skills
      if (paramUserId) {
        const res = await getUserSkills(paramUserId);
        setSkills(res || []);
        return;
      }

      // Employee → fetch their own skills
      const res = await getMySkills();
      setSkills(res || []);
    } catch (err) {
      console.error("Failed to load skills", err);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployeeSkill(id);
      loadSkills();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete skill.");
    }
  };

  const displayUserId = paramUserId || user?.id || "me";

  const onAddClick = () => {
    // Admin/HR adding skills for another employee
    if (paramUserId && (role === "ADMIN" || role === "HR")) {
      navigate(`/employee-skills/add?userId=${paramUserId}`);
    } else {
      // Employee adding to their own profile
      navigate(`/employee-skills/add`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Skills of Employee #{displayUserId}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage skills and proficiency levels.</p>
        </div>

        <button
          onClick={onAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Add Skill
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                Skill
              </th>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                Level
              </th>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                Experience
              </th>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">
                Last Used
              </th>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400">
                  Loading skills...
                </td>
              </tr>
            ) : skills.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <Award size={48} className="mb-4 opacity-50" />
                    <p className="text-lg font-medium text-slate-600 dark:text-slate-300">No skills found</p>
                    <p className="text-sm mt-1">Add a skill to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              skills.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Award size={20} />
                      </div>
                      <span className="font-medium text-slate-800 dark:text-white">
                        {s.skillName || s.name || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Level {s.level}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className={`w-1.5 h-1.5 rounded-full ${star <= s.level ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Clock size={16} className="text-slate-400" />
                      {s.yearsExperience ?? 0} years
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Calendar size={16} className="text-slate-400" />
                      {s.lastUsedYear ?? "—"}
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <button
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      onClick={() => {
                        if (confirm("Delete this skill?")) handleDelete(s.id);
                      }}
                      title="Delete Skill"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
