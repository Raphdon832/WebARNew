import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteProject, listProjects } from "../api/projects";
import { setToken } from "../api/auth";
import { buildViewerPath } from "../lib/viewerRoutes";
import IdentifyngLogo from "../components/IdentifyngLogo";

const normalizeUrl = (url) => {
  if (!url) return "";
  if (window.location.protocol !== "https:") return url;
  if (url.startsWith("http://")) return `https://${url.slice("http://".length)}`;
  return url;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProjects();
      setProjects(data);
    } catch (err) {
      setToken(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleDelete = async (project) => {
    const shouldDelete = window.confirm(
      `Delete "${project.name}"?\n\nThis removes the project configuration from your dashboard.`
    );
    if (!shouldDelete) return;

    setDeletingId(project.id);
    setError(null);
    try {
      await deleteProject(project.id);
      setProjects((prev) => prev.filter((item) => item.id !== project.id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-hero">
        <div>
          <IdentifyngLogo className="studio-logo" width={250} />
          <p className="eyebrow">iDentifyng Studio</p>
          <h1>Your AR Projects</h1>
          <p>Create, iterate, and publish marker-based AR experiences from one workspace.</p>
        </div>
        <Link className="primary-btn" to="/editor/new">
          + New Project
        </Link>
      </div>

      {error && <div className="auth-error">{error}</div>}

      {loading && <p>Loading projects...</p>}

      {!loading && (
        <div className="project-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-media">
                {project.config?.markerImageUrl ? (
                  <img
                    src={normalizeUrl(project.config.markerImageUrl)}
                    alt={project.name}
                    className="project-thumb"
                  />
                ) : (
                  <div className="project-thumb placeholder">No Marker</div>
                )}
              </div>
              <div className="project-content">
                <h3>{project.name}</h3>
                <p>Slug: {project.slug}</p>
                <p>Views: {project.viewCount || 0}</p>
                <p>Type: {project.config?.contentType || "model"}</p>
              </div>
              <div className="project-actions">
                <Link to={buildViewerPath(project)} target="_blank">
                  View
                </Link>
                <Link to={`/editor/${project.id}`}>Edit</Link>
                <button
                  type="button"
                  className="danger-btn"
                  disabled={deletingId === project.id}
                  onClick={() => handleDelete(project)}
                >
                  {deletingId === project.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="empty-state">
              <p>No projects yet. Start by creating your first AR scene.</p>
              <Link className="primary-btn" to="/editor/new">
                Create Project
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
