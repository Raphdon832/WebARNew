import React from "react";
import Reveal from "../components/Reveal.jsx";

const Insights = () => (
  <section className="section" id="insights">
    <div className="glow-orb" style={{ width: 480, height: 480, top: "8%", right: "-8%", background: "rgba(111,168,255,0.16)" }} />

    <div className="container">
      <Reveal>
        <div className="section-head section-head--center">
          <span className="eyebrow">Insights and Resources</span>
          <h2 className="section-title">Thought Leadership</h2>
          <p className="section-lead">
            We share perspectives, research, and practical guidance on the technologies and innovations
            shaping the future of governments, businesses, and institutions.
          </p>
        </div>
      </Reveal>

      <div className="grid grid--4 mt-24">
        <Reveal delay={0}>
          <article className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <h3 className="card__title">Emerging Technologies</h3>
            <p className="card__text muted">Article series</p>
          </article>
        </Reveal>

        <Reveal delay={80}>
          <article className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="7" width="14" height="12" rx="2" />
                <path d="M12 7V4M9 4h6M9 12h.01M15 12h.01M8 19v2M16 19v2" />
              </svg>
            </div>
            <h3 className="card__title">Artificial Intelligence</h3>
            <p className="card__text muted">Article series</p>
          </article>
        </Reveal>

        <Reveal delay={160}>
          <article className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 1-9 9M3 12a9 9 0 0 1 9-9" />
                <path d="M16 4l5 0 0 5M8 20l-5 0 0-5" />
              </svg>
            </div>
            <h3 className="card__title">Digital Transformation</h3>
            <p className="card__text muted">Article series</p>
          </article>
        </Reveal>

        <Reveal delay={240}>
          <article className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21v-1a8 8 0 0 1 16 0v1" />
                <path d="M9 8h6" />
              </svg>
            </div>
            <h3 className="card__title">Identity Management</h3>
            <p className="card__text muted">Coming soon</p>
          </article>
        </Reveal>

        <Reveal delay={320}>
          <article className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 22V11a6 6 0 0 1 12 0v11" />
                <path d="M3 22h18" />
                <path d="M9 22v-5h6v5" />
                <path d="M12 5V2" />
              </svg>
            </div>
            <h3 className="card__title">Government Technology</h3>
            <p className="card__text muted">Article series</p>
          </article>
        </Reveal>

        <Reveal delay={400}>
          <article className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <h3 className="card__title">AR Media Innovations</h3>
            <p className="card__text muted">Coming soon</p>
          </article>
        </Reveal>

        <Reveal delay={480}>
          <article className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <path d="M12 14v3" />
              </svg>
            </div>
            <h3 className="card__title">Cybersecurity</h3>
            <p className="card__text muted">Article series</p>
          </article>
        </Reveal>

        <Reveal delay={560}>
          <article className="card card--glow">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 20V4" />
                <path d="M4 20h16" />
                <path d="M8 16v-4M12 16V8M16 16v-6" />
              </svg>
            </div>
            <h3 className="card__title">Data Analytics</h3>
            <p className="card__text muted">Coming soon</p>
          </article>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Insights;
