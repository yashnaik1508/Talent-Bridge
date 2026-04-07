import { useEffect, useState } from "react";
import { getSkillById } from "../../api/skillApi";
import { getUserSkills, updateEmployeeSkill } from "../../api/employeeSkillApi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";
import { getAllSkills } from "../../api/skillApi";

export default function EditEmployeeSkill() {
  const { id } = useParams(); // employee_skill record id
  const [form, setForm] = useState({
    skillId: "",
    level: 3,
    yearsExperience: 0,
    lastUsedYear: new Date().getFullYear(),
  });
  const [skillName, setSkillName] = useState("");
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();

  }, []);

  const load = async () => {
    try {

      const allSkills = await getAllSkills();
      setSkills(allSkills || []);

      const mySkills = await axios.get("/api/employee-skills/my-skills").then(r => r.data);
      let record = mySkills.find(r => r.id === parseInt(id, 10));
      if (!record) {

        try {
          const maybeUserSkills = await axios.get(`/api/employee-skills/user/${id}`).then(r => r.data);
          record = maybeUserSkills.find(r => r.id === parseInt(id, 10));
        } catch (err) {
          console.error("Could not load employee-skill record by id", err);
        }
      }

      if (!record) {
        alert("Skill record not found. Backend might need a GET-by-id endpoint for employee skills.");
        navigate(-1);
        return;
      }

      setForm({
        skillId: record.skillId,
        level: record.level ?? 3,
        yearsExperience: record.yearsExperience ?? 0,
        lastUsedYear: record.lastUsedYear ?? new Date().getFullYear(),
      });
      setSkillName(record.skillName || "");
    } catch (err) {
      console.error(err);
      alert("Failed to load skill record");
      navigate(-1);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmployeeSkill(id, {
        level: parseInt(form.level, 10),
        yearsExperience: parseInt(form.yearsExperience, 10),
        lastUsedYear: parseInt(form.lastUsedYear, 10),
      });
      navigate(-1);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update skill");
    }
  };

  return (
    <div className="p-6 max-w-lg bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Skill {skillName ? `- ${skillName}` : ""}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Skill</label>
          <select
            name="skillId"
            value={form.skillId}
            disabled
            className="w-full border p-2 rounded-md bg-gray-100"
          >
            <option value="">{skillName || "Skill"}</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Level (1-5)</label>
          <input
            type="number"
            name="level"
            min="1"
            max="5"
            value={form.level}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium">Years of Experience</label>
          <input
            type="number"
            name="yearsExperience"
            min="0"
            value={form.yearsExperience}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div>
          <label className="block font-medium">Last Used Year</label>
          <input
            type="number"
            name="lastUsedYear"
            value={form.lastUsedYear}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Update
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
