import React from "react";
import Reveal from "../components/Reveal.jsx";

const Hero = () => (
  <section className="hero" id="home">
    <div className="glow-orb" style={{ width: 520, height: 520, top: "-12%", right: "-6%", background: "rgba(111,168,255,0.22)" }} />
    <div className="glow-orb" style={{ width: 460, height: 460, top: "10%", left: "-10%", background: "rgba(127,231,214,0.18)" }} />

    <div className="container">
      <div className="hero__grid">
        <div>
          <Reveal>
            <span className="hero__badge">
              <b>Innovation</b> Indigenous Nigerian technology &amp; innovation company
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="hero__title">
              Transforming Ideas into{" "}
              <span className="text-gradient">Intelligent Digital Experiences</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="hero__lead">
              IDENTIFYNG Technologies Co. Ltd delivers next-generation digital solutions, identity
              management systems, immersive media technologies, software development, and digital
              transformation services for governments, businesses, and institutions — combining
              technology, creativity, and strategic thinking to build solutions that improve lives.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="btn-row hero__cta">
              <a className="btn btn--primary btn--lg" href="/#contact">Request a Consultation</a>
              <a className="btn btn--ghost btn--lg" href="/#solutions">Explore Our Solutions</a>
              <a className="btn btn--ghost btn--lg" href="/#ar-media">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                Watch Demo
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="hero__metrics">
              <div className="stat">
                <div className="stat__value text-gradient">Gov &amp; Enterprise</div>
                <div className="stat__label">Multi-sector technology focus</div>
              </div>
              <div className="stat">
                <div className="stat__value text-gradient">End-to-End</div>
                <div className="stat__label">Digital services delivery</div>
              </div>
              <div className="stat">
                <div className="stat__value text-gradient">Abuja, NG</div>
                <div className="stat__label">RC 1581859 · Headquarters</div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="hero__visual">
          <div className="orbit" aria-hidden="true">
            <div className="orbit__ring orbit__ring--1">
              <span className="orbit__dot orbit__dot--a" />
            </div>
            <div className="orbit__ring orbit__ring--2">
              <span className="orbit__dot orbit__dot--b" />
            </div>
            <div className="orbit__ring orbit__ring--3">
              <span className="orbit__dot orbit__dot--c" />
            </div>
            <div className="orbit__core">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
              </svg>
            </div>

            <div className="orbit__chip orbit__chip--1">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
              Digital Identity
            </div>
            <div className="orbit__chip orbit__chip--2">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-blue)" }} />
              AR Media · Live
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Hero;
