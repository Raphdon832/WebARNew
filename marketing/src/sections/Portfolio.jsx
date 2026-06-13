import React from "react";
import Reveal from "../components/Reveal.jsx";

const categories = [
  "Completed Projects",
  "Case Studies",
  "Digital Transformation Initiatives",
  "Government Solutions",
  "AR Media Campaigns",
  "Website Development Projects",
  "Software Solutions",
];

const caseStudies = [
  {
    title: "Government AR Awareness Campaign",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8.5 12 4l10 4.5-10 4.5z" />
        <path d="M6 10.5v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" />
        <path d="M22 8.5v5" />
      </svg>
    ),
  },
  {
    title: "Citizen Identity Platform",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M6 16c0-1.7 1.3-3 3-3s3 1.3 3 3" />
        <path d="M15 9h4M15 12h4M15 15h2" />
      </svg>
    ),
  },
  {
    title: "Enterprise Digital Transformation",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21V9l6-4 6 4v12" />
        <path d="M15 21V11l6 4v6" />
        <path d="M7 11h.01M7 14h.01M7 17h.01M11 11h.01M11 14h.01M11 17h.01" />
      </svg>
    ),
  },
];

const templateRows = ["Challenge", "Solution", "Implementation", "Impact", "Results"];

const Portfolio = () => (
  <section className="section" id="portfolio">
    <div className="glow-orb" style={{ width: 480, height: 480, top: "6%", right: "-8%", background: "rgba(127,231,214,0.16)" }} />

    <div className="container">
      <Reveal>
        <div className="section-head section-head--center">
          <span className="eyebrow">Portfolio</span>
          <h2 className="section-title">Our Work</h2>
          <p className="section-lead">
            Featured case studies are coming soon — we are finalizing client approvals before
            sharing the full stories behind our most impactful engagements.
          </p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="chip-row center mt-24">
          {categories.map((label) => (
            <span className="chip" key={label}>{label}</span>
          ))}
        </div>
      </Reveal>

      <div className="grid grid--3 mt-32">
        {caseStudies.map((item, i) => (
          <Reveal delay={160 + i * 100} key={item.title}>
            <article className="card">
              <div className="card__icon">{item.icon}</div>
              <div className="chip-row">
                <span className="chip">Coming soon</span>
              </div>
              <h3 className="card__title mt-8">{item.title}</h3>
              <ul className="list-check mt-16">
                {templateRows.map((row) => (
                  <li className="muted" key={row}>{row}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Portfolio;
