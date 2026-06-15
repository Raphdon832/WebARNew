import React from "react";
import PageHero from "../components/PageHero.jsx";
import Industries from "../sections/Industries.jsx";
import Portfolio from "../sections/Portfolio.jsx";
import Clients from "../sections/Clients.jsx";

export default function IndustriesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Industries"
        title={<>Technology programs for public, private, and institutional <span className="text-gradient">missions</span></>}
        lead="We support government agencies, financial institutions, schools, healthcare administrators, development organizations, and growing enterprises."
        image="/images/services-platform-visual.png"
        alt="Abstract connected enterprise platform visual"
        actions={[
          { label: "Start a Project", href: "/contact" },
          { label: "See Services", href: "/services", variant: "ghost" },
        ]}
      />
      <Industries />
      <Portfolio />
      <Clients />
    </main>
  );
}
