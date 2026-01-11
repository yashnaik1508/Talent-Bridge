// src/api/employeeSkillApi.js
import axios from "./axiosInstance";

/**
 * Note:
 * - GET /api/employee-skills/my-skills  -> logged-in user's skills
 * - GET /api/employee-skills/user/{userId} -> skills of any user (admin/HR)
 * - POST /api/employee-skills -> adds skill for authenticated user (controller sets userId)
 * - PUT /api/employee-skills/{id}
 * - DELETE /api/employee-skills/{id}
 */

export const getMySkills = async () => {
  const res = await axios.get("/api/employee-skills/my-skills");
  return res.data;
};

export const getAllEmployeeSkills = async () => {
  const res = await axios.get("/api/employee-skills");
  return res.data;
};

export const getUserSkills = async (userId) => {
  const res = await axios.get(`/api/employee-skills/user/${userId}`);
  return res.data;
};

export const addEmployeeSkill = async (payload) => {
  // payload: { skillId, level, yearsExperience, lastUsedYear, userId? }
  // backend will set userId from auth principal for EMPLOYEE, ADMIN/HR may pass userId
  const res = await axios.post("/api/employee-skills", payload);
  return res.data;
};

export const updateEmployeeSkill = async (id, payload) => {
  // payload: { level, yearsExperience, lastUsedYear }
  const res = await axios.put(`/api/employee-skills/${id}`, payload);
  return res.data;
};

export const deleteEmployeeSkill = async (id) => {
  const res = await axios.delete(`/api/employee-skills/${id}`);
  return res.data;
};
