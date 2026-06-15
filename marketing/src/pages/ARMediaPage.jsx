import React from "react";
import PageHero from "../components/PageHero.jsx";
import ARMedia from "../sections/ARMedia.jsx";

export default function ARMediaPage() {
  return (
    <main>
      <PageHero
        eyebrow="AR Media"
        title={<>Interactive media that turns static touchpoints into <span className="text-gradient">living experiences</span></>}
        lead="Web-based AR campaigns connect print, packaging, signage, documents, and public communication to immersive digital content in seconds."
        image="/images/ar-media-visual.png"
        alt="Abstract augmented reality media visual with a smartphone and floating content"
        actions={[
          { label: "Request a Demo", href: "/contact" },
          { label: "View Services", href: "/services", variant: "ghost" },
        ]}
      />
      <ARMedia />
    </main>
  );
}
