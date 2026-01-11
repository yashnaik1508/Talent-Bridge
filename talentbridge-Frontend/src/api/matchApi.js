// src/api/matchApi.js

import axios from "./axiosInstance";

export const findMatches = async (projectId) => {
    const res = await axios.post(`/api/match/find-candidates/${projectId}`);
    return res.data;
};
