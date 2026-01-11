import axios from "./axiosInstance";

export const loginUser = async (email, password) => {
  const res = await axios.post("/api/auth/login", {
    email,
    password,
  });
  return res.data;
};

export const registerUser = async (userPayload) => {
  // userPayload: { username, fullName, email, role, phone, password }
  const res = await axios.post("/api/auth/register", userPayload);
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await axios.post("/api/auth/forgot-password", { email });
  return res.data;
};
