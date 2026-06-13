import React from "react";
import Reveal from "../components/Reveal.jsx";

const roles = [
  {
    title: "Software Developers",
    text: "Build resilient, secure systems across web, mobile, and cloud platforms.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 8l-4 4 4 4" />
        <path d="M16 8l4 4-4 4" />
        <path d="M13.5 5l-3 14" />
      </svg>
    ),
  },
  {
    title: "UI/UX Designers",
    text: "Craft intuitive, accessible interfaces and immersive product experiences.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7a2.8 2.8 0 0 0-4-4l-7 7-2 6 6-2z" />
        <path d="M14 7l3 3" />
      </svg>
    ),
  },
  {
    title: "Project Managers",
    text: "Lead cross-functional delivery from discovery through launch and beyond.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Business Analysts",
    text: "Translate stakeholder needs into clear, actionable requirements and roadmaps.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20V4" />
        <path d="M4 20h16" />
        <path d="M8 16v-4M12 16V8M16 16v-7" />
      </svg>
    ),
  },
  {
    title: "Content Creators",
    text: "Tell compelling stories across formats that connect with diverse audiences.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 5h16v11H7l-3 3z" />
        <path d="M8 9h8M8 12h5" />
      </svg>
    ),
  },
  {
    title: "Digital Marketing Specialists",
    text: "Grow reach and engagement through data-driven, multi-channel campaigns.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l15-6v14L3 13z" />
        <path d="M7 13v4a2 2 0 0 0 4 0v-2" />
        <path d="M18 9a3 3 0 0 1 0 6" />
      </svg>
    ),
  },
];

const Careers = () => (
  <section className="section section--alt" id="careers">
    <div className="glow-orb" style={{ width: 480, height: 480, top: "-8%", right: "-8%", background: "rgba(127,231,214,0.16)" }} />

    <div className="container">
      <div className="split">
        <div>
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">Careers</span>
              <h2 className="section-title">Build the Future <span className="text-gradient">With Us</span></h2>
              <p className="section-lead">Join a team passionate about innovation and impact.</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="muted">
              We are always looking for curious, driven people who want to shape government
              and enterprise-grade technology. If you thrive on solving meaningful problems and
              delivering work that improves lives, we would love to hear from you.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="btn-row mt-24">
              <a className="btn btn--primary btn--lg" href="mailto:info@identifyng.com">Send your CV</a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160} className="panel">
          <span className="eyebrow">Open Roles</span>
          <div className="grid grid--2 mt-16">
            {roles.map((role, i) => (
              <Reveal key={role.title} delay={i * 80} className="card card--glow">
                <div className="card__icon">{role.icon}</div>
                <h3 className="card__title">{role.title}</h3>
                <p className="card__text">{role.text}</p>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Careers;
