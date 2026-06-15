# IDENTIFYNG Technologies — Marketing Website

This document is the single source of truth for the public marketing/corporate website
(`identifyng.com` + `www.identifyng.com`). It tracks the content/information architecture,
the design direction, the concrete design system, the technical architecture, and the
deployment plan.

> The Studio app (login / dashboard / editor / AR viewer) lives separately on
> `studio.identifyng.com` (Netlify site `webarnew-20260519142716`, built from `frontend/`).
> This marketing site is a **separate Netlify project** built from `marketing/`.

---

## 1. Design direction

**Reference theme:** Sapforce AI SaaS website design by Phenomenon Studio on Dribbble
(`https://dribbble.com/shots/21107524-Sapforce-AI-SaaS-website-design`). The redesign should use
that project's premium AI-SaaS visual language as a direction, not a pixel-for-pixel clone, while
preserving IDENTIFYNG Technologies' core marketing information, Nigerian corporate identity, and
teal brand system.

What we adopt from the Sapforce-inspired direction:

- **Bright AI-SaaS canvas:** mostly white and pale silver with a soft grey top band, subtle grid
  texture, and very restrained ambient glow.
- **Compact pill navigation:** centered, airy header with a clear brand area, simple text links,
  a secondary login button, and one strong rounded CTA.
- **Oversized hero typography:** confident, tight display headline with a large first-viewport
  presence. The headline remains "Transforming Ideas into Intelligent Digital Experiences".
- **Futuristic 3D centerpiece:** replace the old orbit-only illustration with a glossy abstract AI
  object: metallic/silver shell, teal-lime translucent energy core, thin orbital rings, and floating
  micro labels. This gives the brand a technology-forward first impression similar to the reference.
- **Sparse hero metadata:** keep only high-signal facts around the object, such as RC number,
  Abuja headquarters, Government & Enterprise, Digital Identity, and AR Media.
- **Lime/teal action accent:** primary action uses the brand teal/blue gradient; one circular lime
  "How it works" style CTA appears near the hero visual.
- **Modular lower sections:** sections should feel like a SaaS case-study landing page: generous
  spacing, hairline borders, rounded cards, bento layouts, and large section headlines. The content
  remains IDENTIFYNG's services, AR media, government technology, identity management, industries,
  insights, careers, CSR, and contact information.
- **Minimal motion:** gentle reveal, slow hero object float, slow orbital rotation, hover lift on
  cards/buttons, and full `prefers-reduced-motion` support.

Design guardrails:

- Use the real IDENTIFYNG logo assets from `/logos`.
- Keep the site light, crisp, and editorial rather than dark, glassy, or dashboard-heavy.
- Do not add fake product claims. Metrics are framed as capability labels unless verified.
- Do not remove the core corporate information, RC number, Abuja address, service categories,
  sector focus, or contact content.

---

## 2. Design system (concrete tokens)

Implemented as CSS custom properties in `marketing/src/styles/global.css`.

### Color
| Token | Value | Use |
|---|---|---|
| `--bg` | `#F5F7F3` | Warm light page canvas |
| `--bg-top` | `#C9CACA` | Soft grey top band inspired by the reference shot |
| `--paper` | `#FFFFFF` | Main content field |
| `--surface` | `rgba(255,255,255,0.86)` | Pills, cards, floating labels |
| `--surface-strong` | `#FFFFFF` | Solid elevated surfaces |
| `--border` | `rgba(13,30,38,0.11)` | Hairline borders |
| `--border-strong` | `rgba(13,30,38,0.18)` | Stronger card/nav borders |
| `--accent` | `#2F9F93` | Primary teal |
| `--accent-brand` | `#7FCFC2` | Exact IDENTIFYNG logo teal |
| `--accent-blue` | `#3F7DD8` | Blue side of gradient |
| `--accent-lime` | `#C8FF38` | Sapforce-like lime micro CTA |
| `--text` | `#0E222B` | Primary text |
| `--text-muted` | `#526674` | Body / secondary |
| `--text-faint` | `#7B8991` | Captions / labels |

Signature gradients:

- Primary CTA: `linear-gradient(135deg, #2F9F93 0%, #3F7DD8 100%)`.
- Lime CTA: `#C8FF38` with dark text.
- Hero headline accent: gradient from teal to blue, used only on the phrase
  "Intelligent Digital Experiences".

Backgrounds:

- Top grey band behind the header.
- White hero field below with a very subtle grid.
- Low-opacity radial teal/blue washes, no decorative blobs.

### Typography
- **Display / headings:** `Space Grotesk` (700/800) - same family as the logo wordmark.
- **Body / UI:** `Inter` (400/500/600).
- Hero scale uses `clamp()` for fluid responsiveness; headings use neutral letter-spacing.

### Shape & depth
- Radii: cards `8px`, panels `12px`, pills/buttons `999px`.
- Shadows: almost invisible on static surfaces; stronger only for the hero 3D image and floating
  labels.
- Max content width: `1360px` for the nav and hero, `1200px` for content sections.
- Section vertical rhythm: `clamp(74px, 9vw, 128px)`.

### Hero composition
- Header: centered, max width `1360px`, logo visible at approximately `240px`, nav links in compact
  pills, Studio Login as secondary pill, Request a Consultation as primary pill.
- Hero grid: left content column + right visual column.
- Left: badge pill, huge headline, paragraph, CTA row, three compact proof labels.
- Right: generated 3D abstract AI object image with floating feature labels and a circular lime
  "How it works?" CTA.
- Use the real logo in nav/footer and the icon mark in the 3D visual center only when it improves
  brand recognition.

### Motion
- Scroll-reveal fade-up via `IntersectionObserver` (`Reveal` component).
- Hero object slow float, orbital ring slow rotate, and hover lift on cards/buttons.
- Motion must pause/reduce under `prefers-reduced-motion`.

---

## 3. Technical architecture

- **Stack:** React 18 + Vite 5 + React Router 6 (mirrors the existing `frontend/` toolchain).
- **Location:** `marketing/` at repo root (independent `package.json` / build / Netlify site).
- **Styling:** single global CSS design-system file with tokens + component classes
  (no Tailwind, matching repo conventions but cleaner than inline styles for hover/keyframes/media).
- **Pages / routes:**
  - `/` — single long-scroll landing composed of all sections below (anchor nav).
  - `/privacy` — Privacy Policy.
  - `/terms` — Terms of Use.
- **Components:** shared `Logo`, `Nav`, `Footer`, `GlowField`, `Reveal`, plus one component
  per content section under `src/sections/`.
- **Assets:** brand logo reused from the Studio app (`IdentifyngLogo`).

### Current routed structure

- `/` - overview landing with hero, company overview, impact, featured solutions, why us, clients,
  and contact.
- `/company` - about, impact, portfolio, clients, careers, and CSR.
- `/services` - featured solutions and end-to-end service capabilities.
- `/ar-media` - AR Media workflow, applications, and benefits.
- `/government` - public-sector platform capabilities.
- `/identity` - digital identity lifecycle and trust systems.
- `/industries` - served sectors, portfolio, and client focus.
- `/insights` - thought-leadership/resource categories.
- `/contact` - contact details and Netlify form.
- `/privacy` and `/terms` - legal pages.

Generated visual assets now live in `marketing/public/images`; the hero object uses a
transparent-background PNG.

---

## 4. Information architecture & content

### Global nav
Home · About · Services · AR Media · Government · Identity · Industries · Insights · Contact
+ primary CTA **Request a Consultation** + secondary **Studio Login** (→ `studio.identifyng.com`).

### HOME — Hero
**Headline:** Transforming Ideas into Intelligent Digital Experiences
**Sub:** IDENTIFYNG Technologies Co. Ltd is a leading Nigerian technology and innovation company
delivering next-generation digital solutions, identity management systems, immersive media
technologies, software development, and digital transformation services for governments,
businesses, and institutions.
We combine technology, creativity, and strategic thinking to build solutions that improve lives,
strengthen organizations, and accelerate sustainable development.
**CTAs:** Request a Consultation · Explore Our Solutions · Watch Demo · Partner With Us

### Company Overview
At IDENTIFYNG Technologies, we believe that innovation is most powerful when technology meets
creativity. As a fully indigenous Nigerian technology company, we specialize in developing digital
solutions that solve complex challenges while creating meaningful experiences for users.
From enterprise software and identity management platforms to immersive augmented reality campaigns
and digital transformation solutions, we help organizations unlock new opportunities through technology.

### Key Statistics — "Impact at a Glance"
- Indigenous Nigerian Technology Company
- RC Number: 1581859
- Abuja Headquarters
- Multi-Sector Technology Solutions
- Government & Enterprise Focus
- End-to-End Digital Services
- Innovative AR Media Solutions
- Identity Management Expertise

### Featured Solutions (bento grid)
- **Digital Identity Solutions** — Secure, scalable, and intelligent identity management systems.
- **Software Engineering** — Enterprise-grade applications designed for performance and growth.
- **Government Technology** — Solutions that improve governance, transparency, and citizen engagement.
- **Augmented Reality Media** — Interactive digital experiences that bridge physical and digital environments.
- **Web & Digital Platforms** — Modern websites and digital ecosystems that drive engagement.

### ABOUT US
**Who We Are** — IDENTIFYNG Technologies Co. Ltd is a Nigerian technology company focused on
delivering innovative, secure, and scalable digital solutions. Our multidisciplinary team combines
expertise in technology, design, software engineering, media production, and business transformation
to create solutions that generate measurable value. Unlike conventional technology providers, we
believe technology should not only work efficiently—it should inspire, engage, and transform.

**Our Story** — Founded with a vision to bridge innovation and practical technology, IDENTIFYNG
Technologies was established to support organizations navigating the digital age. Through strategic
innovation, creative problem-solving, and technical excellence, we have positioned ourselves as a
trusted technology partner for public and private sector organizations.

**Vision** — To become Africa's most trusted technology innovation company delivering transformative
digital solutions that empower governments, businesses, and communities.

**Mission** — To create highly productive, secure, and sustainable technology solutions that maximize
operational efficiency while minimizing complexity, downtime, and administrative burdens.

**Core Values** — Innovation · Excellence · Integrity · Creativity · Reliability · Customer Success ·
Professionalism · Continuous Improvement

### SERVICES
- **Digital Transformation Services** — Process Automation · Workflow Digitization · Data Management ·
  Enterprise Transformation · Cloud Migration
- **Software Development** — Enterprise Applications · Mobile Applications · Web Applications ·
  APIs & Integrations · SaaS Platforms · Database Systems
- **Website Design & Development** — Corporate Websites · Government Portals · E-Commerce Platforms ·
  Educational Platforms · Membership Platforms · Custom Web Applications
- **IT Consulting & Infrastructure** — IT Strategy · Systems Integration · Infrastructure Planning ·
  Managed Services · Network Solutions · Cybersecurity Consulting
- **E-Content & Creative Media** — Video Production · Motion Graphics · Corporate Branding ·
  Interactive Content · Educational Content · Multimedia Campaigns

### AR MEDIA SOLUTIONS — "Revolutionizing Engagement Through Augmented Reality"
IDENTIFYNG Technologies offers cutting-edge Augmented Reality Media solutions that transform static
content into immersive experiences.
**How It Works:** 1) User scans a QR Code. 2) Camera opens automatically. 3) User points device at
designated trigger image. 4) Interactive AR experience launches instantly. 5) Video overlays and
digital content appear in real-world environments.
**Applications:** Government Campaigns (Public Awareness · Voter Education · Community Engagement) ·
Political Campaigns (Candidate Messaging · Interactive Manifestos · Digital Outreach) · Education
(Interactive Learning · Training Materials · Digital Textbooks) · Corporate Marketing (Product
Demonstrations · Brand Storytelling · Customer Engagement) · Tourism & Culture (Historical Site
Experiences · Museum Installations · Cultural Preservation)
**Benefits:** Increased Engagement · Better Information Retention · Interactive Storytelling ·
Measurable Results · Cost-Effective Outreach · Innovative User Experiences

### GOVERNMENT TECHNOLOGY SOLUTIONS — "Smart Government for a Digital Future"
Solutions: Digital Identity Systems · Citizen Databases · E-Government Platforms · Smart City
Solutions · Public Service Portals · Digital Records Management · Monitoring & Evaluation Systems ·
Data Analytics Platforms

### DIGITAL IDENTITY MANAGEMENT — "Building Trust Through Digital Identity"
Capabilities: Citizen Registration · Resident Management · Biometric Integration · Identity
Verification · Secure Authentication · Access Management · Digital Credentials

### INDUSTRIES WE SERVE
Public Sector · Financial Services · Education · Healthcare · Development Organizations ·
Corporate Enterprises

### PORTFOLIO — "Our Work"
Placeholder showcase: Completed Projects · Case Studies · Digital Transformation Initiatives ·
Government Solutions · AR Media Campaigns · Website Development Projects · Software Solutions.
Case study template: Challenge · Solution · Implementation · Impact · Results · Client Testimonial.

### CLIENTS & PARTNERS — "Trusted By Organizations That Demand Excellence"
Future: Government Agencies · Corporate Clients · NGOs · Development Partners · Educational
Institutions · Strategic Technology Partners.

### INSIGHTS & RESOURCES — "Thought Leadership"
Topics: Emerging Technologies · Artificial Intelligence · Digital Transformation · Identity
Management · Government Technology · AR Media Innovations · Cybersecurity · Data Analytics.

### CAREERS — "Build the Future With Us"
Opportunities: Software Developers · UI/UX Designers · Project Managers · Business Analysts ·
Content Creators · Digital Marketing Specialists.

### CORPORATE SOCIAL RESPONSIBILITY — "Technology for Social Impact"
Focus: Digital Literacy · Youth Empowerment · Innovation Development · Educational Technology ·
Community Transformation.

### WHY IDENTIFYNG TECHNOLOGIES
Indigenous Expertise with Global Standards · Innovation-Driven Culture · Government Technology
Expertise · Creative Technology Leadership · Proven Technical Excellence · End-to-End Project
Delivery · Secure & Scalable Solutions · Long-Term Partnership Approach.

### CONTACT US
**IDENTIFYNG TECHNOLOGIES CO. LTD** — RC: 1581859
Head Office: 22 Mediterranean Street, Maitama, Abuja, Federal Capital Territory, Nigeria
Email: info@identifyng.com · Business: business@identifyng.com · Support: support@identifyng.com
Phone: +234 XXX XXX XXXX · Website: www.identifyng.com

### REQUEST A DEMO
Schedule a demonstration of: Identity Management Platform · Government Technology Solutions ·
AR Media Solutions · Digital Transformation Services · Enterprise Software Platforms.

### Legal (separate routes)
- **Privacy Policy** — commitment to protecting user privacy; full legal policy to be added.
- **Terms of Use** — use subject to applicable laws/regulations; full legal terms to be added.

### Future expansion (documented, not built yet)
Artificial Intelligence Solutions · Smart City Platforms · Blockchain Solutions · Cybersecurity
Services · GIS & Mapping Solutions · Data Analytics & BI · Innovation Lab · Investor Relations ·
R&D Centre · Technology Academy · Partner Program · Customer Success Stories.

---

## 5. Deployment plan (Netlify)

Create a **new, separate Netlify site** for the marketing website (do not reuse the Studio site):

- **Base directory:** `marketing`
- **Build command:** `npm ci && npm run build`
- **Publish directory:** `marketing/dist`
- **Domains:** `identifyng.com` (primary) + `www.identifyng.com` (redirect/alias)
- **Netlify site:** `identifyng-marketing` (`https://identifyng-marketing.netlify.app`)
- **Netlify site ID:** `2c3eb81b-f9e7-4ff3-99de-0693cbadefe8`
- **Latest production deploy:** `6a2e4b79a01a85c210d2e311`
- SPA redirect (`/* → /index.html 200`) is included in `marketing/netlify.toml`.

DNS (WhoGoHost): point apex `identifyng.com` and `www` to the new marketing Netlify site
(`studio` CNAME already points to the Studio site and is untouched).

---

## 6. Status

- [x] Spec documented (this file).
- [x] Project scaffolded (`marketing/` — React 18 + Vite 5 + React Router 6).
- [x] Design system + foundation built (`src/styles/global.css`, `Logo`, `Nav`, `Footer`, `Reveal`, `Hero`).
- [x] Marketing theme switched to a clean light brand system.
- [x] All 17 content sections built (Hero + 16 sections) in `src/sections/`, plus `Privacy` / `Terms` routes.
- [x] Contact form wired for Netlify Forms (hidden detection form in `index.html`).
- [x] Production build verified (`npm run build` → clean; preview serves HTTP 200).
- [x] New Netlify site created + domains attached (`identifyng.com` + `www.identifyng.com`).
- [x] Marketing site deployed to Netlify production (`https://identifyng-marketing.netlify.app`).
- [x] WhoGoHost DNS updated for `identifyng.com` apex and `www`.
- [ ] Netlify HTTPS/TLS provisioned for `identifyng.com` + `www.identifyng.com`.

### Build / run commands

```bash
cd marketing
npm install      # first time
npm run dev      # local dev at http://localhost:5180
npm run build    # production build → marketing/dist
npm run preview  # serve the production build locally
```

### File map

```
marketing/
  index.html                  # fonts, meta/OG tags, hidden Netlify contact form
  netlify.toml                # build + SPA redirect (set Netlify base dir = marketing)
  src/
    main.jsx                  # entry + BrowserRouter
    App.jsx                   # routes (/ , /privacy , /terms) + scroll manager
    styles/global.css         # the full design system (tokens + components)
    lib/site.js               # company + nav constants, STUDIO_URL
    components/                Logo, Nav, Footer, Reveal
    pages/                     Home, Privacy, Terms, LegalLayout
    sections/                  Hero + 16 content sections
```
