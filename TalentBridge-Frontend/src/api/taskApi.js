import axios from "axios";

const API_URL = "http://localhost:8080/api/tasks";

const getHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const createTaskApi = async (task) => {
  const response = await axios.post(`${API_URL}/create`, task, getHeader());
  return response.data;
};

export const getTeamTasksApi = async (teamId) => {
  const response = await axios.get(`${API_URL}/team/${teamId}`, getHeader());
  return response.data;
};

export const getMyTasksApi = async () => {
  const response = await axios.get(`${API_URL}/my`, getHeader());
  return response.data;
};

export const updateTaskStatusApi = async (taskId, status, completedWork, pendingWork) => {
  const response = await axios.put(`${API_URL}/update-status`, { taskId, status, completedWork, pendingWork }, getHeader());
  return response.data;
};

export const deleteTaskApi = async (taskId) => {
  const response = await axios.delete(`${API_URL}/${taskId}`, getHeader());
  return response.data;
};
