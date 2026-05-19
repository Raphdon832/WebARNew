import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
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
