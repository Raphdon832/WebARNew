import React from "react";
import Reveal from "../components/Reveal.jsx";

const industries = [
  {
    title: "Public Sector",
    text: "Government ministries, departments, agencies, and local authorities.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M4 21V9l8-5 8 5v12M9 21v-6h6v6M9 12h.01M15 12h.01" />
      </svg>
    ),
  },
  {
    title: "Financial Services",
    text: "Banks, fintech companies, and financial institutions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </svg>
    ),
  },
  {
    title: "Education",
    text: "Schools, universities, and training organizations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10 12 5 2 10l10 5 10-5Z" />
        <path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
      </svg>
    ),
  },
  {
    title: "Healthcare",
    text: "Hospitals, clinics, and healthcare administrators.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.5 12.6 12 20l-7.5-7.4a4.5 4.5 0 1 1 6.4-6.4l1.1 1 1.1-1a4.5 4.5 0 1 1 6.4 6.4Z" />
        <path d="M9 12h2v-2h2v2h2" />
      </svg>
    ),
  },
  {
    title: "Development Organizations",
    text: "NGOs, donor agencies, and international organizations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    title: "Corporate Enterprises",
    text: "Large enterprises and emerging businesses.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="1.5" />
        <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3" />
      </svg>
    ),
  },
];

const Industries = () => (
  <section className="section" id="industries">
    <div className="glow-orb" style={{ width: 480, height: 480, top: "6%", right: "-8%", background: "rgba(127,231,214,0.16)" }} />

    <div className="container">
      <Reveal>
        <div className="section-head section-head--center">
          <span className="eyebrow">Industries We Serve</span>
          <h2 className="section-title">Technology across every sector</h2>
          <p className="section-lead">
            From government to enterprise, we partner with organizations of every scale to deliver secure,
            mission-critical digital solutions tailored to their sector.
          </p>
        </div>
      </Reveal>

      <div className="grid grid--3">
        {industries.map((item, index) => (
          <Reveal key={item.title} delay={index * 80}>
            <article className="card card--glow">
              <div className="card__icon">{item.icon}</div>
              <h3 className="card__title">{item.title}</h3>
              <p className="card__text">{item.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Industries;
