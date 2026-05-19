import axios from "axios";

const resolveApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  if (typeof window === "undefined") return configured;
  if (window.location.protocol !== "https:") return configured;
  if (configured.startsWith("http://")) {
    return `https://${configured.slice("http://".length)}`;
  }
  return configured;
};

const API = axios.create({
  baseURL: resolveApiBaseUrl()
});

export const setToken = (token) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete API.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
};

const storedToken = localStorage.getItem("token");
if (storedToken) {
  setToken(storedToken);
}

export const login = (email, password) =>
  API.post("/auth/login", { email, password }).then((res) => res.data);

export const register = (email, password) =>
  API.post("/auth/register", { email, password }).then((res) => res.data);

export default API;
