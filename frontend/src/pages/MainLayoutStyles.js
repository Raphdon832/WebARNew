const styles = `
  @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap");

  :root {
    --bg: #050811;
    --bg-soft: #0a1326;
    --card: rgba(10, 20, 36, 0.78);
    --line: rgba(152, 202, 255, 0.2);
    --line-soft: rgba(255, 255, 255, 0.12);
    --text: #f2f7ff;
    --text-soft: rgba(236, 244, 255, 0.7);
    --brand-a: #15b4ff;
    --brand-b: #2cf58b;
    --danger: #ff677a;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background:
      radial-gradient(1200px 500px at 10% -10%, rgba(27, 151, 255, 0.25), transparent 60%),
      radial-gradient(900px 480px at 96% -30%, rgba(35, 242, 174, 0.2), transparent 55%),
      linear-gradient(180deg, #060b18 0%, #050811 60%);
    color: var(--text);
    font-family: "Space Grotesk", "Segoe UI", sans-serif;
  }

  a {
    color: #8fd4ff;
  }

  .auth-layout,
  .dashboard-layout,
  .editor-layout,
  .analytics-layout {
    max-width: 1240px;
    margin: 0 auto;
    padding: 40px 20px 72px;
  }

  .auth-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .auth-card {
    background: rgba(8, 18, 35, 0.85);
    border: 1px solid var(--line-soft);
    border-radius: 24px;
    padding: 32px;
    width: 100%;
    max-width: 430px;
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.42);
    backdrop-filter: blur(8px);
  }

  .auth-card h1 {
    margin: 0 0 8px;
    font-size: 30px;
  }

  .auth-logo {
    margin: 0 auto 26px;
  }

  .auth-card p {
    margin: 0 0 24px;
    color: var(--text-soft);
  }

  .auth-card input {
    width: 100%;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid var(--line-soft);
    background: rgba(5, 12, 23, 0.85);
    color: #fff;
    margin-bottom: 16px;
    font-size: 15px;
  }

  .auth-card button {
    width: 100%;
    padding: 14px 16px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(120deg, var(--brand-a), #2a70ff);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 4px;
  }

  .auth-switch {
    text-align: center;
    color: var(--text-soft);
  }

  .auth-error {
    background: rgba(255, 103, 122, 0.14);
    border: 1px solid rgba(255, 103, 122, 0.45);
    color: #ffc2cb;
    padding: 10px 12px;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .success-note {
    background: rgba(38, 241, 147, 0.12);
    border: 1px solid rgba(38, 241, 147, 0.42);
    color: #c9ffe7;
    padding: 10px 12px;
    border-radius: 8px;
    margin-bottom: 14px;
  }

  .eyebrow {
    margin: 0 0 8px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 12px;
    color: rgba(141, 227, 255, 0.92);
  }

  .primary-btn {
    padding: 11px 18px;
    border-radius: 999px;
    background: linear-gradient(120deg, var(--brand-a), var(--brand-b));
    color: #082137;
    text-decoration: none;
    font-weight: 700;
    border: none;
    cursor: pointer;
  }

  .ghost-btn {
    padding: 10px 14px;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: rgba(255, 255, 255, 0.03);
    color: var(--text);
    font-weight: 600;
    cursor: pointer;
  }

  .dashboard-hero,
  .editor-hero,
  .analytics-hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .studio-logo {
    margin-bottom: 14px;
  }

  .dashboard-hero h1,
  .editor-hero h1,
  .analytics-hero h1 {
    margin: 0 0 8px;
    font-size: 36px;
  }

  .dashboard-hero p,
  .editor-hero p,
  .analytics-hero p {
    margin: 0;
    color: var(--text-soft);
    max-width: 640px;
  }

  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 18px;
  }

  .project-card {
    border-radius: 18px;
    padding: 14px;
    background: var(--card);
    border: 1px solid var(--line-soft);
    backdrop-filter: blur(6px);
    box-shadow: 0 12px 32px rgba(3, 5, 11, 0.35);
  }

  .project-media {
    margin-bottom: 12px;
  }

  .project-thumb {
    width: 100%;
    height: 140px;
    border-radius: 12px;
    object-fit: cover;
    border: 1px solid var(--line-soft);
    background: #071324;
    color: var(--text-soft);
    display: grid;
    place-items: center;
  }

  .project-thumb.placeholder {
    font-size: 13px;
    letter-spacing: 0.02em;
  }

  .project-content h3 {
    margin: 0 0 8px;
    font-size: 20px;
  }

  .project-content p {
    margin: 0 0 6px;
    color: var(--text-soft);
    font-size: 14px;
  }

  .project-actions {
    margin-top: 14px;
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  .project-actions a,
  .project-actions button {
    padding: 8px 12px;
    border-radius: 9px;
    border: 1px solid var(--line-soft);
    color: #d9f1ff;
    background: rgba(255, 255, 255, 0.03);
    text-decoration: none;
    font-weight: 600;
    cursor: pointer;
    font-size: 13px;
  }

  .project-actions .danger-btn {
    color: #ffd6dd;
    border-color: rgba(255, 103, 122, 0.5);
    background: rgba(255, 103, 122, 0.12);
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 38px;
    border-radius: 18px;
    border: 1px dashed rgba(177, 219, 255, 0.32);
    background: rgba(8, 18, 35, 0.36);
    display: grid;
    gap: 14px;
    place-items: center;
  }

  .analytics-actions,
  .analytics-toolbar,
  .analytics-range,
  .analytics-legend {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .analytics-toolbar {
    justify-content: space-between;
    margin-bottom: 18px;
    padding: 12px 14px;
    border-radius: 14px;
    border: 1px solid var(--line-soft);
    background: rgba(8, 16, 31, 0.58);
  }

  .analytics-toolbar span {
    color: var(--text-soft);
    font-size: 13px;
  }

  .analytics-range button {
    min-width: 48px;
    min-height: 36px;
    padding: 8px 12px;
    border-radius: 999px;
    border: 1px solid var(--line-soft);
    background: rgba(255, 255, 255, 0.04);
    color: var(--text);
    font-weight: 700;
    cursor: pointer;
  }

  .analytics-range button.active {
    color: #082137;
    border-color: transparent;
    background: linear-gradient(120deg, var(--brand-a), var(--brand-b));
  }

  .analytics-stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
    margin-bottom: 18px;
  }

  .analytics-stat {
    min-height: 108px;
    padding: 14px;
    border-radius: 14px;
    border: 1px solid var(--line-soft);
    background: rgba(8, 16, 31, 0.74);
    display: grid;
    align-content: center;
    gap: 5px;
  }

  .analytics-stat p,
  .analytics-stat span {
    margin: 0;
    color: var(--text-soft);
    font-size: 13px;
  }

  .analytics-stat strong {
    color: var(--text);
    font-size: clamp(24px, 4vw, 34px);
    line-height: 1;
    overflow-wrap: anywhere;
  }

  .analytics-empty-value {
    color: var(--text-soft);
    font-size: 18px;
  }

  .analytics-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.65fr);
    gap: 16px;
    align-items: start;
  }

  .analytics-panel {
    border-radius: 16px;
    border: 1px solid var(--line-soft);
    background: rgba(8, 16, 31, 0.74);
    padding: 16px;
    box-shadow: 0 12px 28px rgba(2, 4, 10, 0.3);
  }

  .analytics-panel--wide {
    grid-column: 1 / -1;
  }

  .analytics-panel-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: baseline;
    margin-bottom: 14px;
  }

  .analytics-panel-head h2 {
    margin: 0;
    font-size: 20px;
  }

  .analytics-panel-head p {
    margin: 0;
    color: var(--text-soft);
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  .analytics-chart-wrap {
    display: grid;
    gap: 10px;
  }

  .analytics-chart {
    width: 100%;
    min-height: 220px;
    display: block;
    border-radius: 12px;
    background: rgba(5, 12, 23, 0.58);
  }

  .analytics-chart line {
    stroke: rgba(255, 255, 255, 0.16);
    stroke-width: 1;
  }

  .analytics-line {
    fill: none;
    stroke-width: 4;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .analytics-line--views {
    stroke: var(--brand-a);
  }

  .analytics-line--launches {
    stroke: var(--brand-b);
  }

  .analytics-line--cta {
    stroke: #ffd166;
  }

  .legend-item {
    color: var(--text-soft);
    font-size: 13px;
  }

  .legend-item::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 6px;
    border-radius: 999px;
    background: currentColor;
  }

  .legend-item--views {
    color: var(--brand-a);
  }

  .legend-item--launches {
    color: var(--brand-b);
  }

  .legend-item--cta {
    color: #ffd166;
  }

  .analytics-funnel,
  .analytics-breakdown-list,
  .analytics-error-list,
  .analytics-cta-metrics {
    display: grid;
    gap: 10px;
  }

  .analytics-funnel-row,
  .analytics-breakdown-row,
  .analytics-error-row {
    display: grid;
    gap: 10px;
    align-items: center;
  }

  .analytics-funnel-row {
    grid-template-columns: minmax(120px, 0.8fr) minmax(120px, 1fr) auto;
  }

  .analytics-funnel-row span,
  .analytics-breakdown-row span,
  .analytics-error-row span {
    color: var(--text-soft);
    font-size: 13px;
  }

  .analytics-funnel-track {
    height: 10px;
    border-radius: 999px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.08);
  }

  .analytics-funnel-track div {
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--brand-a), var(--brand-b));
  }

  .analytics-breakdown-row {
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 9px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .analytics-breakdown-row:last-child {
    border-bottom: none;
  }

  .analytics-cta-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .analytics-cta-metrics .analytics-stat {
    min-height: 82px;
    padding: 0;
    border: none;
    background: transparent;
    box-shadow: none;
  }

  .analytics-error-row {
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 12px;
    border-radius: 12px;
    background: rgba(255, 103, 122, 0.1);
    border: 1px solid rgba(255, 103, 122, 0.26);
  }

  .analytics-error-row div {
    display: grid;
    gap: 4px;
    min-width: 0;
  }

  .analytics-error-row strong {
    overflow-wrap: anywhere;
  }

  .analytics-error-row time {
    color: var(--text-soft);
    font-size: 12px;
    white-space: nowrap;
  }

  .analytics-empty-panel {
    padding: 18px;
    border-radius: 12px;
    border: 1px dashed rgba(177, 219, 255, 0.28);
    background: rgba(8, 18, 35, 0.32);
    color: var(--text-soft);
  }

  .editor-grid {
    display: grid;
    grid-template-columns: minmax(420px, 1.25fr) minmax(330px, 1fr);
    gap: 24px;
    align-items: start;
  }

  .editor-panel {
    border-radius: 16px;
    border: 1px solid var(--line-soft);
    background: rgba(8, 16, 31, 0.74);
    padding: 16px;
    box-shadow: 0 12px 28px rgba(2, 4, 10, 0.3);
  }

  .editor-preview {
    align-self: start;
    position: sticky;
    top: 20px;
    z-index: 2;
  }

  @media (min-width: 741px) and (max-width: 980px) {
    .editor-layout {
      max-width: none;
      padding: 28px 14px 56px;
    }

    .editor-grid {
      grid-template-columns: minmax(320px, 0.95fr) minmax(300px, 1.05fr);
      gap: 16px;
    }

    .editor-panel {
      padding: 14px;
    }
  }

  @media (max-width: 980px) {
    .dashboard-hero h1,
    .editor-hero h1,
    .analytics-hero h1 {
      font-size: 30px;
    }

    .analytics-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 740px) {
    .analytics-toolbar,
    .analytics-panel-head,
    .analytics-error-row {
      align-items: stretch;
    }

    .analytics-funnel-row,
    .analytics-error-row,
    .analytics-cta-metrics {
      grid-template-columns: 1fr;
    }

    .editor-grid {
      grid-template-columns: 1fr;
    }

    .editor-preview {
      top: 0;
      z-index: 5;
      padding: 10px 0 12px;
      background:
        linear-gradient(180deg, rgba(6, 11, 24, 0.98) 0%, rgba(6, 11, 24, 0.94) 76%, rgba(6, 11, 24, 0) 100%);
    }

    .editor-panel {
      padding: 14px;
    }
  }

  .publish-callout {
    margin-top: 16px;
    padding: 14px;
    border-radius: 12px;
    background: rgba(44, 174, 106, 0.12);
    border: 1px solid rgba(44, 174, 106, 0.4);
  }

  .publish-callout p {
    margin: 0 0 6px;
    color: rgba(219, 255, 237, 0.85);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .publish-callout a {
    color: #a7f3d0;
    overflow-wrap: anywhere;
  }

  .qr-panel {
    margin-top: 14px;
    display: grid;
    gap: 10px;
  }

  .qr-panel span {
    display: block;
    color: rgba(219, 255, 237, 0.68);
    font-size: 12px;
  }

  .qr-box {
    width: 148px;
    min-height: 148px;
    padding: 10px;
    border-radius: 14px;
    background: #ffffff;
    display: grid;
    place-items: center;
    box-shadow: 0 16px 30px rgba(0, 0, 0, 0.24);
  }

  .qr-box img {
    display: block;
    width: 128px;
    height: 128px;
  }

  .qr-box span {
    color: #152034;
    text-align: center;
  }

  .qr-download {
    width: max-content;
    font-size: 13px;
    font-weight: 700;
  }
`;

export default styles;
