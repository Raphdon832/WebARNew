import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Logo from "./Logo.jsx";
import { NAV_LINKS, STUDIO_URL } from "../lib/site.js";

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const normalizedPath = pathname.replace(/\/$/, "") || "/";
  const isActiveLink = (href) => normalizedPath === href;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="container">
        <div className="nav__inner">
          <a className="nav__brand" href="/" aria-label="IDENTIFYNG Technologies home">
            <Logo width={240} />
          </a>

          <nav className="nav__links" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                className={`nav__link ${isActiveLink(l.href) ? "is-active" : ""}`}
                href={l.href}
                aria-current={isActiveLink(l.href) ? "page" : undefined}
              >
                <span>{l.label}</span>
              </a>
            ))}
          </nav>

          <div className="nav__actions">
            <a className="btn btn--ghost btn--sm" href={STUDIO_URL} target="_blank" rel="noreferrer">
              Studio Login
            </a>
            <a
              className={`btn btn--primary btn--sm ${isActiveLink("/contact") ? "is-active" : ""}`}
              href="/contact"
              aria-current={isActiveLink("/contact") ? "page" : undefined}
            >
              Request a Consultation
            </a>
            <button
              type="button"
              className="nav__toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className={`nav__mobile ${open ? "is-open" : ""}`}>
        <div className="nav__mobile-inner" onClick={() => setOpen(false)}>
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={isActiveLink(l.href) ? "is-active" : ""}
              aria-current={isActiveLink(l.href) ? "page" : undefined}
            >
              {l.label}
            </a>
          ))}
          <a href={STUDIO_URL} target="_blank" rel="noreferrer">
            Studio Login
          </a>
          <a
            className={`btn btn--primary ${isActiveLink("/contact") ? "is-active" : ""}`}
            href="/contact"
            style={{ marginTop: 10 }}
            aria-current={isActiveLink("/contact") ? "page" : undefined}
          >
            Request a Consultation
          </a>
        </div>
      </div>
    </header>
  );
};

export default Nav;
