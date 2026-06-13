import React from "react";
import Reveal from "../components/Reveal.jsx";

const reasons = [
  {
    title: "Indigenous Expertise with Global Standards",
    text: "Homegrown Nigerian talent delivering solutions benchmarked against international best practice.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    ),
  },
  {
    title: "Innovation-Driven Culture",
    text: "We pursue emerging technology relentlessly to keep your platforms ahead of the curve.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 21h4" />
        <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5.9 1.2.9 2H14.7c0-.8.3-1.5.9-2A6 6 0 0 0 12 3Z" />
      </svg>
    ),
  },
  {
    title: "Government Technology Expertise",
    text: "Trusted experience building secure, compliant systems for public-sector institutions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M4 21V10l8-5 8 5v11" />
        <path d="M9 21v-6h6v6M9 10h.01M15 10h.01M12 10h.01" />
      </svg>
    ),
  },
  {
    title: "Creative Technology Leadership",
    text: "Where engineering meets design to craft immersive, memorable digital experiences.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16l-5.2 2.7 1-5.8L3.5 8.7l5.9-.9L12 2.5Z" />
      </svg>
    ),
  },
  {
    title: "Proven Technical Excellence",
    text: "A track record of robust, well-architected solutions that perform under real-world demand.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
        <path d="M16 3l5 3-1 4" />
      </svg>
    ),
  },
  {
    title: "End-to-End Project Delivery",
    text: "From strategy and design through build and support, we own the full lifecycle.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8" />
        <path d="M4 12v6M4 18h6" />
      </svg>
    ),
  },
  {
    title: "Secure and Scalable Solutions",
    text: "Architected for enterprise security and growth, so your systems scale without compromise.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3Z" />
        <path d="M9.5 12l1.8 1.8L15 10" />
      </svg>
    ),
  },
  {
    title: "Long-Term Partnership Approach",
    text: "We invest in lasting relationships, supporting your goals well beyond launch.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 11a4 4 0 1 0-4-4M8 13a4 4 0 1 0 4 4" />
        <path d="M3 21v-1a4 4 0 0 1 4-4h2M21 3v1a4 4 0 0 1-4 4h-2" />
      </svg>
    ),
  },
];

const WhyUs = () => (
  <section className="section section--alt" id="why">
    <div
      className="glow-orb"
      style={{ width: 480, height: 480, top: "8%", right: "-8%", background: "rgba(127,231,214,0.16)" }}
    />

    <div className="container">
      <Reveal>
        <div className="section-head section-head--center">
          <span className="eyebrow">Why IDENTIFYNG Technologies</span>
          <h2 className="section-title">Indigenous expertise with global standards</h2>
          <p className="section-lead">
            We are a long-term, security-first partner delivering end-to-end digital solutions —
            from first idea to ongoing support — for governments, businesses, and institutions.
          </p>
        </div>
      </Reveal>

      <div className="grid grid--4 mt-32">
        {reasons.map((reason, index) => (
          <Reveal key={reason.title} delay={index * 80}>
            <div className="card card--glow">
              <div className="card__icon">{reason.icon}</div>
              <h3 className="card__title">{reason.title}</h3>
              <p className="card__text muted">{reason.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUs;
