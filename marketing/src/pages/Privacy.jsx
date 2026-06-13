import React from "react";
import LegalLayout from "./LegalLayout.jsx";

export default function Privacy() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Privacy Policy"
      intro="IDENTIFYNG Technologies is committed to protecting user privacy, safeguarding personal data, and maintaining transparency in data collection and processing activities."
      updated="A complete legal policy will be published here. The summary below describes our current commitments."
      sections={[
        {
          heading: "Our commitment",
          body: "We respect the privacy of every visitor, client, and partner. We collect only the information necessary to deliver our services, respond to enquiries, and improve our platforms, and we handle that information responsibly and lawfully.",
        },
        {
          heading: "Information we collect",
          body: "We may collect contact details you provide (such as your name, email address, organization, and message) when you request a consultation or demonstration, as well as standard technical information about how you use this website.",
        },
        {
          heading: "How we use information",
          body: "Information is used to respond to your enquiries, provide and improve our solutions, communicate relevant updates, and meet legal and regulatory obligations. We do not sell personal data.",
        },
        {
          heading: "Data security",
          body: "We apply appropriate organizational and technical safeguards to protect personal data against unauthorized access, alteration, disclosure, or destruction.",
        },
        {
          heading: "Contact",
          body: "For privacy-related enquiries, please contact us at info@identifyng.com. The full legal policy, including your rights and our retention practices, will be added to this page.",
        },
      ]}
    />
  );
}
