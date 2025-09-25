import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE });
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = "Bearer " + t;
  return cfg;
});
const C = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");
    if (t && r) setUser({ token: t, role: r });
  }, []);
  const login = async (emailOrNic, password) => {
    const { data } = await api.post("/api/auth/login", {
      emailOrNic,
      password,
    });
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("role", data.role);
    setUser({ token: data.accessToken, role: data.role });
  };
  const register = async (payload) => {
    const { data } = await api.post("/api/auth/register", payload);
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("role", data.role);
    setUser({ token: data.accessToken, role: data.role });
  };
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };
  return (
    <C.Provider value={{ user, login, register, logout, api }}>
      {children}
    </C.Provider>
  );
}
export const useAuth = () => useContext(C);
