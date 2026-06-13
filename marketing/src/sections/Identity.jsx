import React from "react";
import Reveal from "../components/Reveal.jsx";

const Identity = () => (
  <section className="section section--alt" id="identity">
    <div className="glow-orb" style={{ width: 480, height: 480, bottom: "-10%", left: "-8%", background: "rgba(127,231,214,0.16)" }} />

    <div className="container">
      <div className="split">
        <Reveal className="panel">
          <span className="eyebrow">Identity Lifecycle</span>
          <div className="grid grid--2 mt-16">
            <div className="card card--glow">
              <div className="card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M19 8v6M22 11h-6" />
                </svg>
              </div>
              <div className="card__title">Register</div>
              <p className="card__text">Enrol citizens and residents with structured, auditable records.</p>
            </div>

            <div className="card card--glow">
              <div className="card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m21 21-4.3-4.3M8 11l2 2 3.5-3.5" />
                </svg>
              </div>
              <div className="card__title">Verify</div>
              <p className="card__text">Confirm identity against trusted, real-time data sources.</p>
            </div>

            <div className="card card--glow">
              <div className="card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 12v9M9 18h6" />
                </svg>
              </div>
              <div className="card__title">Authenticate</div>
              <p className="card__text">Biometric and multi-factor checks at the point of service.</p>
            </div>

            <div className="card card--glow">
              <div className="card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 10h18M7 15h4" />
                </svg>
              </div>
              <div className="card__title">Credential</div>
              <p className="card__text">Issue secure, portable digital credentials people can trust.</p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <div className="section-head">
              <span className="eyebrow">Digital Identity Management</span>
              <h2 className="section-title">Building Trust Through <span className="text-gradient">Digital Identity</span></h2>
              <p className="section-lead">
                Our identity management solutions provide secure and accessible methods for identification, verification, authentication, and service delivery.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ul className="list-check">
              <li>Citizen Registration</li>
              <li>Resident Management</li>
              <li>Biometric Integration</li>
              <li>Identity Verification</li>
              <li>Secure Authentication</li>
              <li>Access Management</li>
              <li>Digital Credentials</li>
            </ul>
          </Reveal>

          <Reveal delay={200}>
            <div className="btn-row mt-24">
              <a className="btn btn--ghost btn--lg" href="/#contact">Talk to our team</a>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default Identity;
