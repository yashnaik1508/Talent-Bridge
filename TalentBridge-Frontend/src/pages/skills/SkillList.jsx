import { useEffect, useState } from "react";
import { getAllSkills, deleteSkill } from "../../api/skillApi";
import { Link } from "react-router-dom";
import { Trash2, Users } from "lucide-react";

export default function SkillList() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await getAllSkills();
      setSkills(data);
    } catch (err) {
      console.error("Error loading skills:", err);
    }
  };

  const handleDelete = async (id) => {
    console.log("Delete button clicked for skill ID:", id);
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        console.log("Sending delete request...");
        await deleteSkill(id);
        console.log("Delete successful");
        loadSkills(); // Refresh list
      } catch (err) {
        console.error("Failed to delete skill:", err);
        if (err.response) {
          console.error("Error response:", err.response.data);
          alert(`Failed to delete skill: ${err.response.data.error || err.message}`);
        } else {
          alert("Failed to delete skill");
        }
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Skills</h1>

        <div className="flex gap-3">
          <Link
            to="/skills/strength"
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Users size={18} />
            Talent Matrix
          </Link>

          <Link
            to="/skills/add"
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
          >
            + Add Skill
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden transition-colors">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="p-3 text-left dark:text-slate-200">Skill Name</th>
              <th className="p-3 text-left dark:text-slate-200">Category</th>
              <th className="p-3 text-left dark:text-slate-200">Created At</th>
              <th className="p-3 text-left dark:text-slate-200">Actions</th>
            </tr>
          </thead>

          <tbody>
            {skills.map((skill) => (
              <tr key={skill.skillId} className="border-b dark:border-slate-700">
                <td className="p-3 dark:text-slate-300">{skill.name}</td>
                <td className="p-3 dark:text-slate-300">{skill.category}</td>
                <td className="p-3 dark:text-slate-300">
                  {new Date(skill.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 flex items-center gap-6">
                  <Link
                    to={`/skills/edit/${skill.skillId}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(skill.skillId)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete Skill"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {skills.length === 0 && (
          <p className="p-4 text-gray-500 text-center">No skills found.</p>
        )}
      </div>
    </div>
  );
}
