
import axios from "./axiosInstance";

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

  const res = await axios.post("/api/employee-skills", payload);
  return res.data;
};

export const updateEmployeeSkill = async (id, payload) => {

  const res = await axios.put(`/api/employee-skills/${id}`, payload);
  return res.data;
};

export const deleteEmployeeSkill = async (id) => {
  const res = await axios.delete(`/api/employee-skills/${id}`);
  return res.data;
};
