import React from "react";
import Hero from "../sections/Hero.jsx";
import CompanyOverview from "../sections/CompanyOverview.jsx";
import ImpactStats from "../sections/ImpactStats.jsx";
import FeaturedSolutions from "../sections/FeaturedSolutions.jsx";
import WhyUs from "../sections/WhyUs.jsx";
import Clients from "../sections/Clients.jsx";
import Contact from "../sections/Contact.jsx";

export default function Home() {
  return (
    <main>
      <Hero />
      <CompanyOverview />
      <ImpactStats />
      <FeaturedSolutions />
      <WhyUs />
      <Clients />
      <Contact />
    </main>
  );
}
