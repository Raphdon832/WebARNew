import React from "react";
import Reveal from "../components/Reveal.jsx";

const steps = [
  { n: 1, label: "User scans a QR Code.", text: "Every campaign or asset starts with a single, frictionless scan — no app download required." },
  { n: 2, label: "Camera opens automatically.", text: "The device camera launches instantly in the browser, ready to recognize the experience." },
  { n: 3, label: "User points device at designated trigger image.", text: "Posters, packaging, documents, or signage become live interactive surfaces." },
  { n: 4, label: "Interactive AR experience launches instantly.", text: "Tracking locks on in real time, anchoring content precisely to the trigger." },
  { n: 5, label: "Video overlays and digital content appear in real-world environments.", text: "Rich media blends seamlessly into the physical space around the user." },
];

const applications = [
  {
    title: "Government Campaigns",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V10l7-5 7 5v11" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
    items: ["Public Awareness", "Voter Education", "Community Engagement"],
  },
  {
    title: "Political Campaigns",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l18-5v12L3 14v6" />
        <path d="M3 14l9 2" />
      </svg>
    ),
    items: ["Candidate Messaging", "Interactive Manifestos", "Digital Outreach"],
  },
  {
    title: "Education",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 9L12 4 2 9l10 5 10-5z" />
        <path d="M6 11v5c3 2 9 2 12 0v-5" />
      </svg>
    ),
    items: ["Interactive Learning", "Training Materials", "Digital Textbooks"],
  },
  {
    title: "Corporate Marketing",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 3 3 5-6" />
      </svg>
    ),
    items: ["Product Demonstrations", "Brand Storytelling", "Customer Engagement"],
  },
  {
    title: "Tourism and Culture",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21c5-4.5 7-8 7-11a7 7 0 0 0-14 0c0 3 2 6.5 7 11z" />
      </svg>
    ),
    items: ["Historical Site Experiences", "Museum Installations", "Cultural Preservation"],
  },
];

const benefits = [
  "Increased Engagement",
  "Better Information Retention",
  "Interactive Storytelling",
  "Measurable Results",
  "Cost-Effective Outreach",
  "Innovative User Experiences",
];

const ARMedia = () => (
  <section className="section section--alt" id="ar-media">
    <div className="glow-orb" style={{ width: 540, height: 540, top: "-8%", right: "-8%", background: "rgba(127,231,214,0.16)" }} />
    <div className="glow-orb" style={{ width: 420, height: 420, bottom: "-6%", left: "-6%", background: "rgba(111,168,255,0.16)" }} />

    <div className="container">
      <Reveal>
        <div className="section-head section-head--center">
          <span className="eyebrow">AR Media Solutions</span>
          <h2 className="section-title">
            Revolutionizing Engagement Through <span className="text-gradient">Augmented Reality</span>
          </h2>
          <p className="section-lead">
            IDENTIFYNG Technologies offers cutting-edge Augmented Reality Media solutions that
            transform static content into immersive experiences.
          </p>
        </div>
      </Reveal>

      {/* Block 1 — How It Works */}
      <Reveal>
        <h3 className="section-title" style={{ fontSize: "1.6rem", marginTop: 8 }}>How It Works</h3>
      </Reveal>
      <Reveal delay={80}>
        <p className="section-lead muted">
          A seamless scan-to-experience journey takes any audience from the physical world to
          interactive AR in seconds.
        </p>
      </Reveal>

      <div className="grid grid--2 mt-16">
        {steps.map((step, i) => (
          <Reveal key={step.n} delay={100 + i * 80}>
            <div className="card" style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div className="step-num">{step.n}</div>
              <div>
                <div className="card__title" style={{ marginBottom: 6 }}>{step.label}</div>
                <p className="card__text muted">{step.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="section__divider mt-48" />

      {/* Block 2 — Applications */}
      <Reveal>
        <h3 className="section-title" style={{ fontSize: "1.6rem" }}>Applications</h3>
      </Reveal>
      <Reveal delay={80}>
        <p className="section-lead muted">
          From the ballot box to the museum gallery, AR Media adapts to high-impact use cases
          across the public and private sectors.
        </p>
      </Reveal>

      <div className="grid grid--3 mt-16">
        {applications.map((app, i) => (
          <Reveal key={app.title} delay={100 + i * 80}>
            <div className="card card--glow">
              <div className="card__icon">{app.icon}</div>
              <div className="card__title">{app.title}</div>
              <ul className="list-check">
                {app.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="section__divider mt-48" />

      {/* Block 3 — Benefits */}
      <Reveal>
        <h3 className="section-title" style={{ fontSize: "1.6rem" }}>Benefits</h3>
      </Reveal>
      <Reveal delay={80}>
        <p className="section-lead muted">
          Measurable outcomes that make augmented reality a strategic advantage, not just a novelty.
        </p>
      </Reveal>

      <Reveal delay={160}>
        <div className="chip-row mt-16">
          {benefits.map((benefit) => (
            <span className="chip" key={benefit}>{benefit}</span>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

export default ARMedia;
