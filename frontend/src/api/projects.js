import API from "./auth";

export const createProject = (payload) =>
  API.post("/projects", payload).then((res) => res.data);

export const listProjects = () =>
  API.get("/projects").then((res) => res.data);

export const fetchProjectById = (id) =>
  API.get(`/projects/${id}`).then((res) => res.data);

export const updateProject = (id, payload) =>
  API.put(`/projects/${id}`, payload).then((res) => res.data);

export const deleteProject = (id) =>
  API.delete(`/projects/${id}`).then((res) => res.data);

export const fetchProjectBySlug = (slug) =>
  API.get(`/projects/slug/${slug}`).then((res) => res.data);
