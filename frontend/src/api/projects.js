import API from "./auth";

export const createProject = (payload) =>
  API.post("/projects", payload).then((res) => res.data);

export const listProjects = () =>
  API.get("/projects").then((res) => res.data);

export const fetchProjectBySlug = (slug) =>
  API.get(`/projects/slug/${slug}`).then((res) => res.data);
