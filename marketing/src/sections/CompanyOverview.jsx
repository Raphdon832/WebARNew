import React from "react";
import Reveal from "../components/Reveal.jsx";

const CompanyOverview = () => (
  <section className="section" id="overview">
    <div className="glow-orb" style={{ width: 460, height: 460, top: "-8%", right: "-10%", background: "rgba(127,231,214,0.16)" }} />

    <div className="container">
      <div className="split">
        <Reveal>
          <div>
            <div className="section-head">
              <span className="eyebrow">Company Overview</span>
              <h2 className="section-title">
                Where technology meets <span className="text-gradient">creativity</span>
              </h2>
              <p className="section-lead">
                At IDENTIFYNG Technologies, we believe that innovation is most powerful when
                technology meets creativity. As a fully indigenous Nigerian technology company, we
                specialize in developing digital solutions that solve complex challenges while
                creating meaningful experiences for users.
              </p>
              <p className="section-lead">
                From enterprise software and identity management platforms to immersive augmented
                reality campaigns and digital transformation solutions, we help organizations unlock
                new opportunities through technology.
              </p>
            </div>

            <div className="btn-row mt-24">
              <a className="btn btn--primary" href="/#solutions">Explore Our Solutions</a>
              <a className="btn btn--ghost" href="/#contact">Partner With Us</a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="panel">
            <div className="card">
              <div className="card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className="card__title">Indigenous Nigerian Company</div>
              <p className="card__text">Fully home-grown technology and innovation.</p>
            </div>

            <div className="card mt-16">
              <div className="card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M5 21V8l7-5 7 5v13" />
                  <path d="M9 21v-6h6v6" />
                </svg>
              </div>
              <div className="card__title">Government and Enterprise</div>
              <p className="card__text">Trusted across public and private sectors.</p>
            </div>

            <div className="card mt-16">
              <div className="card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h10" />
                  <path d="M14 7l5 5-5 5" />
                  <path d="M20 4v16" />
                </svg>
              </div>
              <div className="card__title">End-to-End Delivery</div>
              <p className="card__text">From strategy to launch and support.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default CompanyOverview;
