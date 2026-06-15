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

export const fetchViewerProject = ({ slug, projectId }) => {
  const requests = [];

  if (slug) {
    requests.push(() => API.get(`/projects/slug/${slug}`));
  }

  if (projectId) {
    requests.push(() => API.get(`/projects/slug/${projectId}`));
  }

  if (projectId) {
    requests.push(() => API.get(`/projects/public/${projectId}/${slug}`));
  }

  const run = async () => {
    let lastError;

    for (const request of requests) {
      try {
        const response = await request();
        return response.data;
      } catch (err) {
        lastError = err;
        if (err.response && err.response.status !== 404) throw err;
      }
    }

    throw lastError;
  };

  return run();
};
