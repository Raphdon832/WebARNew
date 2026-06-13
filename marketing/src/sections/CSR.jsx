import React from "react";
import Reveal from "../components/Reveal.jsx";

const CSR = () => (
  <section className="section" id="csr">
    <div className="glow-orb" style={{ width: 480, height: 480, top: "8%", right: "-8%", background: "rgba(198,242,78,0.14)" }} />

    <div className="container">
      <Reveal>
        <div className="section-head section-head--center">
          <span className="eyebrow">Corporate Social Responsibility</span>
          <h2 className="section-title">Technology for <span className="text-gradient">Social Impact</span></h2>
          <p className="section-lead">We believe technology should create opportunities and improve lives.</p>
        </div>
      </Reveal>

      <div className="grid grid--3 mt-32">
        <Reveal delay={0}>
          <div className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 18v3" />
                <path d="M7 9l2 2-2 2M12 13h4" />
              </svg>
            </div>
            <h3 className="card__title">Digital Literacy</h3>
            <p className="card__text muted">Equipping people with the skills to navigate and thrive in a connected world.</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="7" r="4" />
                <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
                <path d="M19 3l1.5 1.5L19 6" />
              </svg>
            </div>
            <h3 className="card__title">Youth Empowerment</h3>
            <p className="card__text muted">Opening pathways for young talent to build, lead, and shape the future.</p>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6" />
                <path d="M10 21h4" />
                <path d="M12 3a6 6 0 0 1 4 10.5c-.8.7-1 1.2-1 2.5H9c0-1.3-.2-1.8-1-2.5A6 6 0 0 1 12 3z" />
              </svg>
            </div>
            <h3 className="card__title">Innovation Development</h3>
            <p className="card__text muted">Nurturing local ideas into solutions that solve real community challenges.</p>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M21 7v6" />
                <path d="M6 9.5V14c0 1.5 2.7 3 6 3s6-1.5 6-3V9.5" />
              </svg>
            </div>
            <h3 className="card__title">Educational Technology</h3>
            <p className="card__text muted">Bringing modern learning tools to classrooms and institutions everywhere.</p>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
              </svg>
            </div>
            <h3 className="card__title">Community Transformation</h3>
            <p className="card__text muted">Partnering with communities to drive lasting, inclusive social progress.</p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default CSR;
