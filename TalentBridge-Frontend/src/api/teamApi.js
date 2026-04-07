import axios from "./axiosInstance";

export const getTeams = async () =>
  axios.get("/api/teams").then((res) => res.data);

export const getTeamById = async (teamId) =>
  axios.get(`/api/teams/${teamId}`).then((res) => res.data);

export const createTeam = async (data) =>
  axios.post("/api/teams", data).then((res) => res.data);

export const deleteTeam = async (teamId) =>
  axios.delete(`/api/teams/${teamId}`).then((res) => res.data);

// Members
export const getTeamMembers = async (teamId) =>
  axios.get(`/api/teams/${teamId}/members`).then((res) => res.data);

export const addTeamMember = async (teamId, data) =>
  axios.post(`/api/teams/${teamId}/members`, data).then((res) => res.data);

export const removeTeamMember = async (teamId, userId) =>
  axios.delete(`/api/teams/${teamId}/members/${userId}`).then((res) => res.data);

// Messages
export const getTeamMessages = async (teamId) =>
  axios.get(`/api/teams/${teamId}/messages`).then((res) => res.data);

export const postTeamMessage = async (teamId, message) =>
  axios.post(`/api/teams/${teamId}/messages`, { message }).then((res) => res.data);
