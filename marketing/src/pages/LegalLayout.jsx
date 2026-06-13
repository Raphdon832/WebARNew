import React from "react";

/**
 * Shared layout for legal pages (Privacy, Terms).
 * `sections` is an array of { heading, body } where body is a string or array of strings.
 */
export default function LegalLayout({ eyebrow, title, intro, updated, sections = [] }) {
  return (
    <main>
      <section className="section" style={{ paddingTop: "clamp(130px, 16vw, 180px)" }}>
        <div className="glow-orb" style={{ width: 460, height: 460, top: "-6%", right: "-8%", background: "rgba(111,168,255,0.16)" }} />
        <div className="container" style={{ maxWidth: 880 }}>
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="section-title" style={{ fontSize: "clamp(32px, 5vw, 54px)", maxWidth: "20ch" }}>
            {title}
          </h1>
          {intro && <p className="section-lead">{intro}</p>}
          {updated && <p className="faint mt-16" style={{ fontSize: 14 }}>{updated}</p>}

          <div className="mt-48" style={{ display: "grid", gap: 36 }}>
            {sections.map((s, i) => (
              <div key={i}>
                <h2 className="card__title" style={{ fontSize: 22, marginBottom: 12 }}>{s.heading}</h2>
                {(Array.isArray(s.body) ? s.body : [s.body]).map((p, j) => (
                  <p key={j} className="muted" style={{ marginTop: j ? 12 : 0, fontSize: 15.5 }}>{p}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
