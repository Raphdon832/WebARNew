import React from "react";
import Hero from "../sections/Hero.jsx";
import CompanyOverview from "../sections/CompanyOverview.jsx";
import ImpactStats from "../sections/ImpactStats.jsx";
import FeaturedSolutions from "../sections/FeaturedSolutions.jsx";
import About from "../sections/About.jsx";
import Services from "../sections/Services.jsx";
import ARMedia from "../sections/ARMedia.jsx";
import Government from "../sections/Government.jsx";
import Identity from "../sections/Identity.jsx";
import Industries from "../sections/Industries.jsx";
import WhyUs from "../sections/WhyUs.jsx";
import Portfolio from "../sections/Portfolio.jsx";
import Clients from "../sections/Clients.jsx";
import Insights from "../sections/Insights.jsx";
import Careers from "../sections/Careers.jsx";
import CSR from "../sections/CSR.jsx";
import Contact from "../sections/Contact.jsx";

export default function Home() {
  return (
    <main>
      <Hero />
      <CompanyOverview />
      <ImpactStats />
      <FeaturedSolutions />
      <About />
      <Services />
      <ARMedia />
      <Government />
      <Identity />
      <Industries />
      <WhyUs />
      <Portfolio />
      <Clients />
      <Insights />
      <Careers />
      <CSR />
      <Contact />
    </main>
  );
}
