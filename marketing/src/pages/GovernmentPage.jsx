import React from "react";
import PageHero from "../components/PageHero.jsx";
import Government from "../sections/Government.jsx";

export default function GovernmentPage() {
  return (
    <main>
      <PageHero
        eyebrow="Government Technology"
        title={<>Digital public-service systems built for <span className="text-gradient">trust and scale</span></>}
        lead="IDENTIFYNG helps institutions modernize citizen services, records, portals, monitoring systems, analytics, and operational workflows."
        image="/images/government-platform-visual.png"
        alt="Abstract smart government platform visual"
        actions={[
          { label: "Request a Consultation", href: "/contact" },
          { label: "Identity Solutions", href: "/identity", variant: "ghost" },
        ]}
      />
      <Government />
    </main>
  );
}
