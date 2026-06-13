import React from "react";
import Reveal from "../components/Reveal.jsx";

const items = [
  {
    title: "Indigenous Company",
    text: "Fully Nigerian-owned technology and innovation firm.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 4 6v6c0 5 3.5 8 8 10 4.5-2 8-5 8-10V6z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "RC 1581859",
    text: "Duly registered corporate entity.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    title: "Abuja Headquarters",
    text: "Based in Maitama, Federal Capital Territory.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s7-5.6 7-11a7 7 0 0 0-14 0c0 5.4 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Multi-Sector Solutions",
    text: "Technology across many industries.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: "Government and Enterprise",
    text: "Public and private sector focus.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="m12 3 8 5H4z" />
        <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
      </svg>
    ),
  },
  {
    title: "End-to-End Services",
    text: "Strategy, build, launch and support.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 8 5" />
        <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-8-5" />
        <path d="M20 4v4h-4M4 20v-4h4" />
      </svg>
    ),
  },
  {
    title: "AR Media Innovation",
    text: "Immersive augmented reality experiences.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" />
        <path d="m12 3v9l8-4.5M12 12l-8-4.5M12 12v9" />
      </svg>
    ),
  },
  {
    title: "Identity Expertise",
    text: "Secure digital identity management.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2.2" />
        <path d="M6 16c.6-1.6 1.8-2.4 3-2.4s2.4.8 3 2.4" />
        <path d="M15 9h4M15 13h3" />
      </svg>
    ),
  },
];

const ImpactStats = () => (
  <section className="section section--alt" id="impact">
    <div className="glow-orb" style={{ width: 480, height: 480, top: "-8%", left: "-6%", background: "rgba(127,231,214,0.16)" }} />

    <div className="container">
      <Reveal>
        <div className="section-head section-head--center">
          <span className="eyebrow">Impact at a Glance</span>
          <h2 className="section-title">
            Built for scale, <span className="text-gradient">trusted for impact</span>
          </h2>
          <p className="section-lead">
            A multi-sector technology partner delivering end-to-end capability — from
            secure identity and immersive AR media to full-lifecycle digital transformation.
          </p>
        </div>
      </Reveal>

      <div className="grid grid--4 mt-32">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 60}>
            <div className="card card--glow">
              <div className="card__icon">{item.icon}</div>
              <h3 className="card__title">{item.title}</h3>
              <p className="card__text">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default ImpactStats;
