import React from "react";
import PageHero from "../components/PageHero.jsx";
import Contact from "../sections/Contact.jsx";

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title={<>Let us build something <span className="text-gradient">transformative</span></>}
        lead="Share your mission, technical objectives, and timeline. The IDENTIFYNG team will arrange a private consultation or live demonstration."
        image="/images/services-platform-visual.png"
        alt="Abstract connected technology platform visual"
      />
      <Contact />
    </main>
  );
}
