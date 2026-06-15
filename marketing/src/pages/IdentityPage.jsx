import React from "react";
import PageHero from "../components/PageHero.jsx";
import Identity from "../sections/Identity.jsx";

export default function IdentityPage() {
  return (
    <main>
      <PageHero
        eyebrow="Digital Identity"
        title={<>Identity systems that make verification <span className="text-gradient">secure and usable</span></>}
        lead="Design identity lifecycle platforms for registration, verification, authentication, credentialing, access, and service delivery."
        image="/images/identity-platform-visual.png"
        alt="Abstract digital identity and biometric verification visual"
        actions={[
          { label: "Talk to Our Team", href: "/contact" },
          { label: "Government Tech", href: "/government", variant: "ghost" },
        ]}
      />
      <Identity />
    </main>
  );
}
