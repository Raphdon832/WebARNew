const styles = `
  :root {
    color-scheme: dark;
  }
  body {
    margin: 0;
    min-height: 100vh;
    background: radial-gradient(circle at top, rgba(78,156,255,0.15), transparent 55%), #050710;
    color: #f5f7ff;
    font-family: "Inter", system-ui, sans-serif;
  }
  a {
    color: #8bb7ff;
  }
  .auth-layout,
  .dashboard-layout,
  .editor-layout {
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 20px 80px;
  }
  .auth-layout {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  .auth-card {
    background: rgba(9,14,33,0.8);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 24px;
    padding: 32px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 70px rgba(5,7,16,0.6);
  }
  .auth-card h1 {
    margin: 0 0 8px;
  }
  .auth-card p {
    margin: 0 0 28px;
    color: rgba(255,255,255,0.65);
  }
  .auth-card input {
    width: 100%;
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.15);
    background: rgba(5,7,18,0.85);
    color: #fff;
    margin-bottom: 16px;
    font-size: 15px;
  }
  .auth-card button {
    width: 100%;
    padding: 14px 16px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg,#4e9cff,#8b5dff);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 4px;
  }
  .auth-error {
    background: rgba(255,85,109,0.1);
    border: 1px solid rgba(255,85,109,0.3);
    color: #ff8b9e;
    padding: 10px 12px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  .auth-switch {
    text-align: center;
    color: rgba(255,255,255,0.7);
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 36px;
  }
  .primary-btn {
    padding: 12px 20px;
    border-radius: 999px;
    background: linear-gradient(135deg,#4e9cff,#8b5dff);
    color: #fff;
    text-decoration: none;
    font-weight: 600;
  }
  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 20px;
  }
  .project-card {
    border-radius: 20px;
    padding: 20px;
    background: rgba(9,12,26,0.8);
    border: 1px solid rgba(255,255,255,0.05);
  }
  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    border-radius: 18px;
    border: 1px dashed rgba(255,255,255,0.2);
  }
  .editor-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    align-items: flex-start;
  }
  .publish-callout {
    margin-top: 16px;
    padding: 14px;
    border-radius: 12px;
    background: rgba(44,174,106,0.12);
    border: 1px solid rgba(44,174,106,0.4);
  }
`;

export default styles;
