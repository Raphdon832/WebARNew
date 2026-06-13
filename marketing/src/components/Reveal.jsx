import React, { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal wrapper. Adds `.is-visible` when the element enters the viewport.
 * Usage: <Reveal><div className="card">…</div></Reveal>
 * Optional `delay` (ms) staggers grouped reveals. `as` swaps the wrapper element.
 */
const Reveal = ({ children, delay = 0, as: Tag = "div", className = "", ...rest }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  // Once the entrance animation has finished we drop the inline transition-delay
  // so that other transitions on the same element (e.g. card hover) stay instant.
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !delay) return;
    const t = setTimeout(() => setSettled(true), delay + 800);
    return () => clearTimeout(t);
  }, [visible, delay]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={delay && !settled ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
