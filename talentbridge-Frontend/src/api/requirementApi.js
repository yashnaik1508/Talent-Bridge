// src/api/requirementApi.js

import axios from "./axiosInstance";

export const getRequirementsByProject = async (projectId) => {
    const res = await axios.get(`/api/project-requirements/project/${projectId}`);
    return res.data;
};

export const addRequirement = async (data) => {
    const res = await axios.post("/api/project-requirements", data);
    return res.data;
};

export const updateRequirement = async (id, data) => {
    const res = await axios.put(`/api/project-requirements/${id}`, data);
    return res.data;
};

export const deleteRequirement = async (id) => {
    const res = await axios.delete(`/api/project-requirements/${id}`);
    return res.data;
};
