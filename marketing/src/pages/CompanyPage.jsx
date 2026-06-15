import React from "react";
import PageHero from "../components/PageHero.jsx";
import About from "../sections/About.jsx";
import ImpactStats from "../sections/ImpactStats.jsx";
import Portfolio from "../sections/Portfolio.jsx";
import Clients from "../sections/Clients.jsx";
import Careers from "../sections/Careers.jsx";
import CSR from "../sections/CSR.jsx";

export default function CompanyPage() {
  return (
    <main>
      <PageHero
        eyebrow="Company"
        title={<>A Nigerian technology company where <span className="text-gradient">innovation meets execution</span></>}
        lead="IDENTIFYNG Technologies Co. Ltd combines software engineering, digital identity, immersive media, and transformation strategy for mission-critical work."
        image="/images/identity-platform-visual.png"
        alt="Abstract identity and trust platform visual"
        actions={[
          { label: "Partner With Us", href: "/contact" },
          { label: "View Industries", href: "/industries", variant: "ghost" },
        ]}
      />
      <About />
      <ImpactStats />
      <Portfolio />
      <Clients />
      <Careers />
      <CSR />
    </main>
  );
}
