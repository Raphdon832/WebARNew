import React from "react";
import LegalLayout from "./LegalLayout.jsx";

export default function Terms() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms of Use"
      intro="Use of this website and associated services is subject to applicable laws, regulations, and company policies."
      updated="Full legal terms will be published here. The summary below outlines the current terms governing use of this site."
      sections={[
        {
          heading: "Acceptance of terms",
          body: "By accessing or using this website, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree, please discontinue use of the site.",
        },
        {
          heading: "Use of the website",
          body: "You agree to use this website lawfully and not to misuse, disrupt, or attempt unauthorized access to any part of it or its underlying systems.",
        },
        {
          heading: "Intellectual property",
          body: "All content, branding, designs, and materials on this website are the property of IDENTIFYNG Technologies Co. Ltd or its licensors and may not be reproduced without prior written consent.",
        },
        {
          heading: "Limitation of liability",
          body: "This website and its content are provided on an as-is basis. IDENTIFYNG Technologies is not liable for any loss or damage arising from reliance on information presented on this site.",
        },
        {
          heading: "Contact",
          body: "For questions regarding these terms, please contact us at info@identifyng.com. The complete terms and conditions will be added to this page.",
        },
      ]}
    />
  );
}
