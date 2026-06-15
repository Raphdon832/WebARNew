import React from "react";
import Reveal from "./Reveal.jsx";

const PageHero = ({ eyebrow, title, lead, image, alt, actions = [] }) => (
  <section className="page-hero">
    <div className="container">
      <div className={`page-hero__grid ${image ? "" : "page-hero__grid--solo"}`}>
        <Reveal>
          <div className="page-hero__copy">
            {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
            <h1 className="page-hero__title">{title}</h1>
            {lead ? <p className="page-hero__lead">{lead}</p> : null}
            {actions.length ? (
              <div className="btn-row page-hero__actions">
                {actions.map((action) => (
                  <a
                    className={`btn ${action.variant === "ghost" ? "btn--ghost" : "btn--primary"} btn--lg`}
                    href={action.href}
                    key={`${action.href}-${action.label}`}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </Reveal>

        {image ? (
          <Reveal delay={120}>
            <div className="page-hero__visual">
              <img src={image} alt={alt || ""} />
            </div>
          </Reveal>
        ) : null}
      </div>
    </div>
  </section>
);

export default PageHero;
