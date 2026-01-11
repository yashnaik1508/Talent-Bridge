import axios from "./axiosInstance";

export const getAllProjects = async () =>
  axios.get("/api/projects").then((res) => res.data);

export const getProjectById = async (id) =>
  axios.get(`/api/projects/${id}`).then((res) => res.data);

export const addProject = async (data) =>
  axios.post("/api/projects", data).then((res) => res.data);

export const updateProject = async (id, data) =>
  axios.put(`/api/projects/${id}`, data).then((res) => res.data);

export const deleteProject = async (id) =>
  axios.delete(`/api/projects/${id}`).then((res) => res.data);
