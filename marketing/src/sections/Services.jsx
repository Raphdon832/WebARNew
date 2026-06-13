import React from "react";
import Reveal from "../components/Reveal.jsx";

const services = [
  {
    title: "Digital Transformation Services",
    tagline: "Modernize operations, processes, and service delivery.",
    capabilities: [
      "Process Automation",
      "Workflow Digitization",
      "Data Management",
      "Enterprise Transformation",
      "Cloud Migration",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16v16H4z" />
        <path d="M9 9h6v6H9z" />
        <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
      </svg>
    ),
  },
  {
    title: "Software Development",
    tagline: "Custom software engineered for performance, security, and scalability.",
    capabilities: [
      "Enterprise Applications",
      "Mobile Applications",
      "Web Applications",
      "APIs and Integrations",
      "SaaS Platforms",
      "Database Systems",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 8l-4 4 4 4" />
        <path d="M16 8l4 4-4 4" />
        <path d="M13 6l-2 12" />
      </svg>
    ),
  },
  {
    title: "Website Design and Development",
    tagline: "Premium digital experiences that convert.",
    capabilities: [
      "Corporate Websites",
      "Government Portals",
      "E-Commerce Platforms",
      "Educational Platforms",
      "Membership Platforms",
      "Custom Web Applications",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
        <path d="M6.5 6.5h.01M9 6.5h.01M8 21h8M12 18v3" />
      </svg>
    ),
  },
  {
    title: "IT Consulting and Infrastructure",
    tagline: "Strategy, integration, and managed infrastructure.",
    capabilities: [
      "IT Strategy",
      "Systems Integration",
      "Infrastructure Planning",
      "Managed Services",
      "Network Solutions",
      "Cybersecurity Consulting",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="7" rx="1.5" />
        <rect x="3" y="14" width="18" height="7" rx="1.5" />
        <path d="M7 6.5h.01M7 17.5h.01" />
      </svg>
    ),
  },
  {
    title: "E-Content and Creative Media",
    tagline: "Story-driven content and multimedia campaigns.",
    capabilities: [
      "Video Production",
      "Motion Graphics",
      "Corporate Branding",
      "Interactive Content",
      "Educational Content",
      "Multimedia Campaigns",
    ],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M10 9l5 3-5 3z" />
      </svg>
    ),
  },
];

const Services = () => (
  <section className="section" id="services">
    <div className="glow-orb" style={{ width: 480, height: 480, top: "8%", right: "-8%", background: "rgba(127,231,214,0.16)" }} />

    <div className="container">
      <Reveal>
        <div className="section-head">
          <span className="eyebrow">Services</span>
          <h2 className="section-title">End-to-end technology services</h2>
          <p className="section-lead">
            From strategy to deployment, we design, build, and operate the digital systems that power
            modern governments, enterprises, and institutions.
          </p>
        </div>
      </Reveal>

      <div className="grid grid--2 mt-32">
        {services.map((service, index) => (
          <Reveal
            key={service.title}
            delay={index * 90}
            style={index === services.length - 1 ? { gridColumn: "1 / -1" } : undefined}
          >
            <article className="card card--glow">
              <div className="card__icon">{service.icon}</div>
              <h3 className="card__title">{service.title}</h3>
              <p className="card__text">{service.tagline}</p>
              <div className="chip-row">
                {service.capabilities.map((capability) => (
                  <span className="chip" key={capability}>
                    {capability}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
