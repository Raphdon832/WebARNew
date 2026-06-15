import React from "react";
import PageHero from "../components/PageHero.jsx";
import FeaturedSolutions from "../sections/FeaturedSolutions.jsx";
import Services from "../sections/Services.jsx";

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Services"
        title={<>End-to-end technology services for <span className="text-gradient">serious delivery</span></>}
        lead="From strategy to deployment, IDENTIFYNG designs, builds, and operates secure digital systems for governments, enterprises, and institutions."
        image="/images/services-platform-visual.png"
        alt="Abstract enterprise software and cloud platform visual"
        actions={[
          { label: "Request a Consultation", href: "/contact" },
          { label: "Explore AR Media", href: "/ar-media", variant: "ghost" },
        ]}
      />
      <FeaturedSolutions />
      <Services />
    </main>
  );
}
