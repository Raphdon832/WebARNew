import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listProjects } from "../api/projects";
import { setToken } from "../api/auth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    listProjects()
      .then(setProjects)
      .catch(() => {
        setToken(null);
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      <header>
        <div>
          <h1>Your AR Projects</h1>
          <p>Create, publish, and share immersive experiences.</p>
        </div>
        <Link className="primary-btn" to="/editor/new">
          + New Project
        </Link>
      </header>

      <div className="project-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.name}</h3>
            <p>Slug: {project.slug}</p>
            <p>Views: {project.viewCount}</p>
            <Link to={`/v/${project.slug}`} target="_blank">
              View experience
            </Link>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="empty-state">
            <p>No projects yet. Start by creating your first AR scene!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
