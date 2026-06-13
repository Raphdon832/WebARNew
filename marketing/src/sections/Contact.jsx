import React from "react";
import Reveal from "../components/Reveal.jsx";

const Contact = () => (
  <section className="section section--alt" id="contact">
    <div className="glow-orb" style={{ width: 520, height: 520, bottom: "-14%", right: "-8%", background: "rgba(127,231,214,0.16)" }} />

    <div className="container">
      <div className="section-head section-head--center">
        <span className="eyebrow">Contact Us</span>
        <h2 className="section-title">Let us build something <span className="text-gradient">transformative</span></h2>
        <p className="section-lead">
          Tell us about your mission and we will arrange a private consultation or live demonstration tailored to your organization.
        </p>
      </div>

      <div className="split mt-32">
        <Reveal>
          <div className="panel">
            <span className="eyebrow">Get in touch</span>
            <h3 className="card__title mt-16">IDENTIFYNG TECHNOLOGIES CO. LTD</h3>
            <p className="muted">RC: 1581859</p>

            <p className="card__text mt-16">
              Schedule a demonstration of our Identity Management Platform, Government Technology Solutions, AR Media Solutions, Digital Transformation Services, and Enterprise Software Platforms.
            </p>

            <ul className="list-check mt-24">
              <li>
                <strong>Head Office</strong><br />
                22 Mediterranean Street<br />
                Maitama, Abuja<br />
                Federal Capital Territory, Nigeria
              </li>
              <li>
                <strong>General</strong> — <a href="mailto:info@identifyng.com" className="text-accent">info@identifyng.com</a>
              </li>
              <li>
                <strong>Business Enquiries</strong> — <a href="mailto:business@identifyng.com" className="text-accent">business@identifyng.com</a>
              </li>
              <li>
                <strong>Support</strong> — <a href="mailto:support@identifyng.com" className="text-accent">support@identifyng.com</a>
              </li>
              <li>
                <strong>Phone</strong> — +234 XXX XXX XXXX
              </li>
              <li>
                <strong>Website</strong> — <a href="https://www.identifyng.com" className="text-accent">www.identifyng.com</a>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="panel">
            <span className="eyebrow">Request a Demo</span>
            <h3 className="card__title mt-16">Start the conversation</h3>
            <p className="muted">Share a few details and our team will respond within one business day.</p>

            <form
              name="contact"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="mt-24"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p hidden>
                <label>Do not fill this out: <input name="bot-field" /></label>
              </p>

              <div className="field">
                <label htmlFor="contact-name">Full name</label>
                <input id="contact-name" name="name" type="text" placeholder="Jane Adeyemi" required />
              </div>

              <div className="field mt-16">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" placeholder="you@organization.gov.ng" required />
              </div>

              <div className="field mt-16">
                <label htmlFor="contact-organization">Organization</label>
                <input id="contact-organization" name="organization" type="text" placeholder="Ministry, agency, or company" />
              </div>

              <div className="field mt-16">
                <label htmlFor="contact-interest">Area of interest</label>
                <select id="contact-interest" name="interest">
                  <option>Identity Management Platform</option>
                  <option>Government Technology Solutions</option>
                  <option>AR Media Solutions</option>
                  <option>Digital Transformation Services</option>
                  <option>Enterprise Software Platforms</option>
                </select>
              </div>

              <div className="field mt-16">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" name="message" rows={4} placeholder="Tell us about your objectives and timeline." />
              </div>

              <div className="btn-row mt-24">
                <button type="submit" className="btn btn--primary btn--lg full">Request a Demo</button>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Contact;
