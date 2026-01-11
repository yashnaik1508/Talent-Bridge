import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // From .env file
});

// Attach token automatically
instance.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("authData"); // FIXED (correct key)

    if (stored) {
      const { token } = JSON.parse(stored); // Extract token safely

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error("Token read/parse error:", error);
  }

  return config;
});

export default instance;
