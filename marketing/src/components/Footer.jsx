import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import { COMPANY, STUDIO_URL } from "../lib/site.js";

const Footer = () => (
  <footer className="footer">
    <div className="glow-orb" style={{ width: 420, height: 420, left: "-8%", bottom: "-30%", background: "rgba(127,231,214,0.16)" }} />
    <div className="container">
      <div className="footer__grid">
        <div className="footer__col">
          <Logo width={196} />
          <p className="muted" style={{ marginTop: 20, maxWidth: "34ch", fontSize: 15 }}>
            A fully indigenous Nigerian technology and innovation company building secure, scalable,
            and intelligent digital solutions for governments, businesses, and institutions.
          </p>
          <p className="faint" style={{ marginTop: 16, fontSize: 13.5 }}>{COMPANY.rc}</p>
        </div>

        <div className="footer__col">
          <h4>Solutions</h4>
          <a href="/#identity">Digital Identity</a>
          <a href="/#services">Software Engineering</a>
          <a href="/#government">Government Technology</a>
          <a href="/#ar-media">AR Media</a>
          <a href="/#services">Web &amp; Digital Platforms</a>
        </div>

        <div className="footer__col">
          <h4>Company</h4>
          <a href="/#about">About Us</a>
          <a href="/#industries">Industries</a>
          <a href="/#insights">Insights</a>
          <a href="/#careers">Careers</a>
          <a href="/#contact">Contact</a>
        </div>

        <div className="footer__col">
          <h4>Get in touch</h4>
          <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          <a href={`mailto:${COMPANY.business}`}>{COMPANY.business}</a>
          <a href={STUDIO_URL} target="_blank" rel="noreferrer">Studio Login ↗</a>
          <p className="faint" style={{ marginTop: 14, fontSize: 14, lineHeight: 1.7 }}>
            {COMPANY.address.join(", ")}
          </p>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {2026} {COMPANY.name}. All rights reserved.</span>
        <span style={{ display: "flex", gap: 22 }}>
          <Link to="/privacy" style={{ color: "inherit" }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: "inherit" }}>Terms of Use</Link>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
