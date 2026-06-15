import React from "react";
import PageHero from "../components/PageHero.jsx";
import Insights from "../sections/Insights.jsx";

export default function InsightsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Insights"
        title={<>Perspective on the systems shaping <span className="text-gradient">digital transformation</span></>}
        lead="Research, practical guidance, and technology perspectives for governments, businesses, and institutions."
        image="/images/government-platform-visual.png"
        alt="Abstract technology analytics and civic platform visual"
        actions={[
          { label: "Discuss an Idea", href: "/contact" },
          { label: "Explore Services", href: "/services", variant: "ghost" },
        ]}
      />
      <Insights />
    </main>
  );
}
