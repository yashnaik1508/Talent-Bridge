// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Persist a JSON string in localStorage under "authData"
  const stored = localStorage.getItem("authData");
  const initial = stored ? JSON.parse(stored) : { token: null, role: null, userId: null };

  const [authData, setAuthDataState] = useState(initial);

  const setAuthData = (token, role = null, userId = null) => {
    const obj = { token, role, userId };
    setAuthDataState(obj);
    localStorage.setItem("authData", JSON.stringify(obj));
  };

  const logout = () => {
    setAuthDataState({ token: null, role: null, userId: null });
    localStorage.removeItem("authData");
    window.location.href = "/login";
  };

  // Convenience getters
  const authToken = authData?.token;
  const role = authData?.role;
  const userId = authData?.userId;

  return (
    <AuthContext.Provider value={{ authData, authToken, role, userId, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
