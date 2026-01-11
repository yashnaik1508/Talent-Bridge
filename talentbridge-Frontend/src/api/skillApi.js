import axios from "./axiosInstance";

export const getAllSkills = async () => {
  const res = await axios.get("/api/skills");
  return res.data;
};

export const getSkillById = async (id) => {
  const res = await axios.get(`/api/skills/${id}`);
  return res.data;
};

export const createSkill = async (data) => {
  const res = await axios.post("/api/skills", data);
  return res.data;
};

export const updateSkill = async (id, data) => {
  const res = await axios.put(`/api/skills/${id}`, data);
  return res.data;
};

export const deleteSkill = async (id) => {
  const res = await axios.delete(`/api/skills/${id}`);
  return res.data;
};
