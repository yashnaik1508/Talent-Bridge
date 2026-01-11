import axios from "./axiosInstance";

// ADMIN / HR / PM
export const getAssignments = async () =>
  axios.get("/api/assignments/all").then((res) => res.data);

// Create assignment
export const createAssignment = async (data) =>
  axios.post("/api/assignments/assign", data).then((res) => res.data);

// Release assignment
export const updateAssignment = async (id, data) =>
  axios.put(`/api/assignments/release/${id}`, data).then((res) => res.data);

// EMPLOYEE — get own assignments
export const getMyAssignments = async () =>
  axios.get("/api/assignments/my-assignments").then((res) => res.data);
