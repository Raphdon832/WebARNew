import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Viewer from "./pages/Viewer";
import styles from "./pages/MainLayoutStyles";

const injectGlobalStyles = () => {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = styles;
  document.head.appendChild(styleEl);
};

injectGlobalStyles();

const hasToken = () => Boolean(localStorage.getItem("token"));

const RequireAuth = ({ children }) =>
  hasToken() ? children : <Navigate to="/login" replace />;

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={hasToken() ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/analytics/:projectId"
        element={
          <RequireAuth>
            <Analytics />
          </RequireAuth>
        }
      />
      <Route
        path="/editor/:id"
        element={
          <RequireAuth>
            <Editor />
          </RequireAuth>
        }
      />
      <Route path="/v/:slug" element={<Viewer />} />
      <Route path="/:slug/view/:projectId" element={<Viewer />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
