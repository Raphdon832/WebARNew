import React from "react";
import Reveal from "../components/Reveal.jsx";

const Hero = () => (
  <section className="hero" id="home">
    <div className="container">
      <div className="hero__grid">
        <div className="hero__copy">
          <Reveal className="hero__badge-wrap">
            <span className="hero__badge">
              <b>Innovation</b>
              <span className="hero__badge-text">
                Indigenous Nigerian technology &amp; innovation company
              </span>
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
              transformation services for governments, businesses, and institutions - combining
              technology, creativity, and strategic thinking to build solutions that improve lives.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="btn-row hero__cta">
              <a className="btn btn--primary btn--lg" href="/contact">Request a Consultation</a>
              <a className="btn btn--ghost btn--lg" href="/services">Explore Solutions</a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="hero__proof">
              <div>
                <strong>RC 1581859</strong>
                <span>Registered corporate entity</span>
              </div>
              <div>
                <strong>Abuja, Nigeria</strong>
                <span>Maitama, FCT headquarters</span>
              </div>
              <div>
                <strong>Gov &amp; Enterprise</strong>
                <span>Multi-sector technology focus</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="hero__visual">
          <div className="hero-object">
            <img
              className="hero-object__image"
              src="/images/ai-saas-hero-object-transparent.png"
              alt="Glossy abstract AI technology sphere"
            />
            <span className="hero-object__ring hero-object__ring--one" />
            <span className="hero-object__ring hero-object__ring--two" />
            <span className="hero-object__ring hero-object__ring--three" />
            <span className="hero-object__ring hero-object__ring--four" />
            <span className="hero-object__orbit hero-object__orbit--one" aria-hidden="true">
              <span className="hero-object__node hero-object__node--teal" />
            </span>
            <span className="hero-object__orbit hero-object__orbit--two" aria-hidden="true">
              <span className="hero-object__node hero-object__node--blue" />
            </span>
            <span className="hero-object__orbit hero-object__orbit--three" aria-hidden="true">
              <span className="hero-object__node hero-object__node--lime" />
            </span>
            <span className="hero-object__orbit hero-object__orbit--four" aria-hidden="true">
              <span className="hero-object__node hero-object__node--white" />
            </span>
            <span className="hero-object__orbit hero-object__orbit--five" aria-hidden="true">
              <span className="hero-object__node hero-object__node--teal hero-object__node--sm" />
            </span>
            <div className="hero-object__label hero-object__label--top">
              <span />
              Digital Identity
            </div>
            <div className="hero-object__label hero-object__label--left">
              <span />
              AR Media
            </div>
            <div className="hero-object__label hero-object__label--right">
              <span />
              Government Tech
            </div>
            <a className="hero-object__cta" href="/ar-media">
              <span>How it works?</span>
            </a>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Hero;
