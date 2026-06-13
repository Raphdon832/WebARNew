import React from "react";
import Reveal from "../components/Reveal.jsx";

const Clients = () => (
  <section className="section section--alt" id="clients">
    <div className="glow-orb" style={{ width: 480, height: 480, top: "-8%", left: "-8%", background: "rgba(127,231,214,0.16)" }} />
    <div className="container">
      <Reveal>
        <div className="section-head section-head--center">
          <span className="eyebrow">Clients and Partners</span>
          <h2 className="section-title">Trusted By Organizations That Demand Excellence</h2>
          <p className="section-lead muted">Our partner and client showcase is currently being onboarded, with verified logos and case studies arriving as engagements are confirmed.</p>
        </div>
      </Reveal>
      <div className="grid grid--3 mt-32">
        <Reveal delay={0}>
          <div className="card center">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 21h18" />
                <path d="M5 21V9l7-5 7 5v12" />
                <path d="M9 21v-6h6v6" />
              </svg>
            </div>
            <div className="card__title muted">Government Agencies</div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card center">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="3" width="16" height="18" rx="1.5" />
                <path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h6" />
              </svg>
            </div>
            <div className="card__title muted">Corporate Clients</div>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div className="card center">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
              </svg>
            </div>
            <div className="card__title muted">NGOs</div>
          </div>
        </Reveal>
        <Reveal delay={240}>
          <div className="card center">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
              </svg>
            </div>
            <div className="card__title muted">Development Partners</div>
          </div>
        </Reveal>
        <Reveal delay={320}>
          <div className="card center">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8l9-4 9 4-9 4-9-4z" />
                <path d="M7 10v5c0 1.1 2.2 2 5 2s5-.9 5-2v-5" />
                <path d="M21 8v5" />
              </svg>
            </div>
            <div className="card__title muted">Educational Institutions</div>
          </div>
        </Reveal>
        <Reveal delay={400}>
          <div className="card center">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                <path d="M12 15v2" />
              </svg>
            </div>
            <div className="card__title muted">Strategic Technology Partners</div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Clients;
