import axios from "axios";

const LOCAL_API_URL = "http://localhost:5000/api";
const PRODUCTION_API_URL = "https://api-production-9c0e.up.railway.app/api";

const normalizeApiUrlForProtocol = (url) => {
  if (typeof window === "undefined") return url;
  if (window.location.protocol !== "https:") return url;
  if (url.startsWith("http://")) {
    return `https://${url.slice("http://".length)}`;
  }
  return url;
};

const resolveApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL;
  if (configured) return normalizeApiUrlForProtocol(configured);

  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return PRODUCTION_API_URL;
  }

  return LOCAL_API_URL;
};

export const API_BASE_URL = resolveApiBaseUrl();

const API = axios.create({
  baseURL: API_BASE_URL
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
