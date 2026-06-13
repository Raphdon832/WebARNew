import React from "react";
import Reveal from "../components/Reveal.jsx";

const Government = () => (
  <section className="section" id="government">
    <div className="glow-orb" style={{ width: 480, height: 480, top: "-8%", left: "-10%", background: "rgba(111,168,255,0.16)" }} />

    <div className="container">
      <div className="section-head">
        <span className="eyebrow">Government Technology Solutions</span>
        <h2 className="section-title">Smart Government for a <span className="text-gradient">Digital Future</span></h2>
        <p className="section-lead">
          Public-sector platforms engineered for trust, scale, and accountability — built to modernize how institutions serve their citizens.
        </p>
      </div>

      <div className="split">
        <Reveal>
          <div>
            <p className="section-lead">
              IDENTIFYNG Technologies develops solutions that strengthen governance, improve citizen engagement, and enable data-driven decision-making.
            </p>

            <ul className="list-check mt-24">
              <li>Digital Identity Systems</li>
              <li>Citizen Databases</li>
              <li>E-Government Platforms</li>
              <li>Smart City Solutions</li>
              <li>Public Service Portals</li>
              <li>Digital Records Management</li>
              <li>Monitoring and Evaluation Systems</li>
              <li>Data Analytics Platforms</li>
            </ul>

            <div className="btn-row mt-32">
              <a className="btn btn--primary btn--lg" href="/#contact">Request a Consultation</a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="panel">
            <span className="eyebrow">At a Glance</span>
            <div className="grid grid--2 mt-16">
              <div className="stat">
                <div className="card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18" />
                    <path d="M5 21V9l7-5 7 5v12" />
                    <path d="M9 21v-6h6v6" />
                    <path d="M5 9h14" />
                  </svg>
                </div>
                <div className="stat__value text-gradient">Governance</div>
                <div className="stat__label">Stronger institutions and accountable public administration</div>
              </div>

              <div className="stat">
                <div className="card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                  </svg>
                </div>
                <div className="stat__value text-gradient">Transparency</div>
                <div className="stat__label">Auditable records and open, verifiable processes</div>
              </div>

              <div className="stat">
                <div className="card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9.5" cy="7" r="4" />
                    <path d="M22 20v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div className="stat__value text-gradient">Citizen Services</div>
                <div className="stat__label">Accessible portals connecting people to government</div>
              </div>

              <div className="stat">
                <div className="card__icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" />
                    <path d="M7 15l4-4 3 3 5-6" />
                  </svg>
                </div>
                <div className="stat__value text-gradient">Data-Driven</div>
                <div className="stat__label">Analytics that turn public data into decisions</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Government;
