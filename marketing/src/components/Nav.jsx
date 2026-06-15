import React, { useEffect, useState } from "react";
import Logo from "./Logo.jsx";
import { NAV_LINKS, STUDIO_URL } from "../lib/site.js";

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container">
        <div className="nav__inner">
          <a className="nav__brand" href="/" aria-label="IDENTIFYNG Technologies home">
            <Logo width={240} />
          </a>

          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a key={l.href} className="nav__link" href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav__actions">
            <a className="btn btn--ghost btn--sm" href={STUDIO_URL} target="_blank" rel="noreferrer">
              Studio Login
            </a>
            <a className="btn btn--primary btn--sm" href="/contact">
              Request a Consultation
            </a>
            <button
              className="nav__toggle"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`nav__mobile ${open ? "is-open" : ""}`}>
        <div className="nav__mobile-inner" onClick={() => setOpen(false)}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href={STUDIO_URL} target="_blank" rel="noreferrer">
            Studio Login
          </a>
          <a className="btn btn--primary" href="/contact" style={{ marginTop: 10 }}>
            Request a Consultation
          </a>
        </div>
      </div>
    </header>
  );
};

export default Nav;
