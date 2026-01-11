// src/api/userApi.js
import axios from "./axiosInstance";

export const getAllUsers = async () => {
  const res = await axios.get("/api/users");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axios.get(`/api/users/${id}`);
  return res.data;
};

export const addUser = async (data) => {
  const res = await axios.post("/api/auth/register", data);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await axios.put(`/api/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`/api/users/${id}`);
  return res.data;
};

export const getInactiveUsers = async (page = 1, size = 10) => {
  const res = await axios.get(`/api/users/inactive?page=${page}&size=${size}`);
  return res.data;
};

export const reactivateUser = async (id) => {
  const res = await axios.put(`/api/users/${id}/reactivate`);
  return res.data;
};

export const getUserStats = async () => {
  const res = await axios.get("/api/users/stats");
  return res.data;
};