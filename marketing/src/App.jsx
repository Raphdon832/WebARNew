import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import CompanyPage from "./pages/CompanyPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import ARMediaPage from "./pages/ARMediaPage.jsx";
import GovernmentPage from "./pages/GovernmentPage.jsx";
import IdentityPage from "./pages/IdentityPage.jsx";
import IndustriesPage from "./pages/IndustriesPage.jsx";
import InsightsPage from "./pages/InsightsPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";

// Scroll to the hash target on navigation, or to top when there is no hash.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/about" element={<Navigate to="/company" replace />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/solutions" element={<Navigate to="/services" replace />} />
        <Route path="/ar-media" element={<ARMediaPage />} />
        <Route path="/government" element={<GovernmentPage />} />
        <Route path="/identity" element={<IdentityPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
