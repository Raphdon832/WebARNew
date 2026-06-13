import React from "react";
import Reveal from "../components/Reveal.jsx";

const About = () => (
  <section className="section section--alt" id="about">
    <div className="glow-orb" style={{ width: 480, height: 480, top: "-8%", right: "-8%", background: "rgba(127,231,214,0.16)" }} />

    <div className="container">
      <Reveal>
        <div className="section-head">
          <span className="eyebrow">About Us</span>
          <h2 className="section-title">Who We Are</h2>
          <p className="section-lead">
            IDENTIFYNG Technologies Co. Ltd is a Nigerian technology company focused on
            delivering innovative, secure, and scalable digital solutions. Our multidisciplinary
            team combines expertise in technology, design, software engineering, media production,
            and business transformation to create solutions that generate measurable value. Unlike
            conventional technology providers, we believe technology should not only work
            efficiently—it should inspire, engage, and transform.
          </p>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="panel mt-16">
          <h3 className="card__title">Our Story</h3>
          <p className="muted">
            Founded with a vision to bridge innovation and practical technology, IDENTIFYNG
            Technologies was established to support organizations navigating the digital age.
            Through strategic innovation, creative problem-solving, and technical excellence, we
            have positioned ourselves as a trusted technology partner for public and private sector
            organizations.
          </p>
        </div>
      </Reveal>

      <div className="split mt-24">
        <Reveal delay={160}>
          <div className="panel full">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="eyebrow">Vision</span>
            <p className="card__text mt-8">
              To become Africa&rsquo;s most trusted technology innovation company delivering
              transformative digital solutions that empower governments, businesses, and
              communities.
            </p>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="panel full">
            <div className="card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="4" />
                <path d="m12 3-1.5 3.5M21 12l-3.5-1.5M12 21l1.5-3.5M3 12l3.5 1.5" />
              </svg>
            </div>
            <span className="eyebrow">Mission</span>
            <p className="card__text mt-8">
              To create highly productive, secure, and sustainable technology solutions that
              maximize operational efficiency while minimizing complexity, downtime, and
              administrative burdens.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={300}>
        <div className="mt-32">
          <span className="eyebrow">Core Values</span>
          <div className="chip-row mt-16">
            <span className="chip">Innovation</span>
            <span className="chip">Excellence</span>
            <span className="chip">Integrity</span>
            <span className="chip">Creativity</span>
            <span className="chip">Reliability</span>
            <span className="chip">Customer Success</span>
            <span className="chip">Professionalism</span>
            <span className="chip">Continuous Improvement</span>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default About;
