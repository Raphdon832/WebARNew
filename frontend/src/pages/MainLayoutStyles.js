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
  .editor-layout {
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
  .editor-hero {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .dashboard-hero h1,
  .editor-hero h1 {
    margin: 0 0 8px;
    font-size: 36px;
  }

  .dashboard-hero p,
  .editor-hero p {
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

  @media (max-width: 980px) {
    .dashboard-hero h1,
    .editor-hero h1 {
      font-size: 30px;
    }

    .editor-grid {
      grid-template-columns: 1fr;
    }

    .editor-panel {
      padding: 14px;
    }
  }
`;

export default styles;
