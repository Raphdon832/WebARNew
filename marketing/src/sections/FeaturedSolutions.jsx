import React from "react";
import Reveal from "../components/Reveal.jsx";

const FeaturedSolutions = () => (
  <section className="section" id="solutions">
    <div className="glow-orb" style={{ width: 480, height: 480, top: "-8%", right: "-8%", background: "rgba(127,231,214,0.16)" }} />

    <div className="container">
      <Reveal>
        <div className="section-head section-head--center">
          <span className="eyebrow">Featured Solutions</span>
          <h2 className="section-title">Solutions engineered for impact</h2>
          <p className="section-lead">
            Five core solution areas — spanning identity, software, governance, immersive media,
            and digital platforms — built to deliver measurable, real-world outcomes at scale.
          </p>
        </div>
      </Reveal>

      <div className="bento mt-32">
        <Reveal delay={80} className="card card--glow bento__lg">
          <div className="card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
              <circle cx="12" cy="10" r="2.5" />
              <path d="M8.5 16a3.5 3.5 0 0 1 7 0" />
            </svg>
          </div>
          <h3 className="card__title">Digital Identity Solutions</h3>
          <p className="card__text">Secure, scalable, and intelligent identity management systems.</p>
          <div className="chip-row mt-16">
            <span className="chip">Biometric Verification</span>
            <span className="chip">Credential Issuance</span>
            <span className="chip">Identity Assurance</span>
          </div>
          <a className="btn btn--ghost btn--sm mt-16" href="/identity">Learn more</a>
        </Reveal>

        <Reveal delay={160} className="card card--glow bento__sm">
          <div className="card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 8l-4 4 4 4" />
              <path d="M16 8l4 4-4 4" />
              <path d="M13 5l-2 14" />
            </svg>
          </div>
          <h3 className="card__title">Software Engineering</h3>
          <p className="card__text">Enterprise-grade applications designed for performance and growth.</p>
          <a className="btn btn--ghost btn--sm mt-16" href="/services">Learn more</a>
        </Reveal>

        <Reveal delay={240} className="card card--glow bento__sm">
          <div className="card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18" />
              <path d="M5 21V9l7-5 7 5v12" />
              <path d="M9 21v-6h6v6" />
              <path d="M9 11h.01M15 11h.01" />
            </svg>
          </div>
          <h3 className="card__title">Government Technology</h3>
          <p className="card__text">Solutions that improve governance, transparency, and citizen engagement.</p>
          <a className="btn btn--ghost btn--sm mt-16" href="/government">Learn more</a>
        </Reveal>

        <Reveal delay={320} className="card card--glow bento__sm">
          <div className="card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
              <path d="M3 7l9 5 9-5" />
              <path d="M12 12v10" />
            </svg>
          </div>
          <h3 className="card__title">Augmented Reality Media</h3>
          <p className="card__text">Interactive digital experiences that bridge physical and digital environments.</p>
          <a className="btn btn--ghost btn--sm mt-16" href="/ar-media">Learn more</a>
        </Reveal>

        <Reveal delay={400} className="card card--glow bento__sm">
          <div className="card__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
            </svg>
          </div>
          <h3 className="card__title">Web and Digital Platforms</h3>
          <p className="card__text">Modern websites and digital ecosystems that drive engagement.</p>
          <a className="btn btn--ghost btn--sm mt-16" href="/services">Learn more</a>
        </Reveal>
      </div>
    </div>
  </section>
);

export default FeaturedSolutions;
