# iDentifyng MVP

iDentifyng is a starter full-stack AR builder. Creators can log in, create AR projects by pasting marker/model URLs, and share viewer links that run in the browser using A-Frame + mind-ar.

## Architecture Overview

| Layer | Tech | Notes |
| --- | --- | --- |
| Frontend | React + Vite | Auth pages, dashboard, editor UI, AR viewer |
| Backend | Node.js + Express | Auth + project CRUD APIs |
| Database | Firebase Firestore | Stores users/projects via Admin SDK |
| AR Runtime | A-Frame + mind-ar-js | Image-tracking viewer |

### Core modules
- **Auth** – email/password register/login issuing JWT tokens.
- **Projects API** – CRUD for AR projects, slug-based viewer endpoint counting views.
- **Editor UI** – upload marker + `.mind` target files and either a model or video overlay.
- **Viewer** – Loads project config, initializes mind-ar for marker tracking, renders GLB.
- **Analytics** – simple view counter per project (extend to detailed metrics).

## Project Structure
```
webar-platform/
  backend/
    src/
      middleware/
      models/
      routes/
      server.js
    package.json
    .env.example
  frontend/
    src/
      api/
      components/
      pages/
      main.jsx
    index.html
    vite.config.js
    package.json
    .env.example
  README.md
```

## Getting Started

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env # add Firebase service-account creds + JWT secret
npm run dev
```

`backend/.env` keys:

| key | description |
| --- | --- |
| `FIREBASE_PROJECT_ID` | Firebase project id |
| `FIREBASE_CLIENT_EMAIL` | client email from service account JSON |
| `FIREBASE_PRIVATE_KEY` | private key from service account (escape newlines as `\n`) |
| `JWT_SECRET` | secret for issuing API tokens |

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env # adjust VITE_API_URL if backend URL differs
npm run dev
```

The frontend dev server runs on http://localhost:5173 and expects the backend on http://localhost:5000.

## Netlify Deploy (Frontend)

This repository includes a root `netlify.toml` that builds and publishes the `frontend/` app.

Set this environment variable in Netlify site settings:

| key | description |
| --- | --- |
| `VITE_API_URL` | public backend API base URL (for example `https://your-api.example.com/api`) |
| `VITE_STUDIO_ORIGIN` | public Studio origin used for viewer links and QR codes (`https://studio.identifyng.com`) |

Custom domain setup:

1. In Netlify, add `studio.identifyng.com` as the custom domain for the frontend site.
2. At the DNS provider for `identifyng.com`, create a `CNAME` record for `studio` that points to the Netlify site hostname.
3. After DNS verifies in Netlify, enable or renew the Netlify TLS certificate for HTTPS.
4. Viewer links use `https://studio.identifyng.com/{project-slug}/view/{project-id}`. The legacy `/v/{project-slug}` route remains available for older links.

## Railway Deploy (Backend)

Deploy the `backend/` directory to Railway as a Node service.

Required backend environment variables:

| key | description |
| --- | --- |
| `JWT_SECRET` | secret used to sign auth tokens |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | service account client email |
| `FIREBASE_PRIVATE_KEY` | service account private key (`\n` escaped) |
| `UPLOADS_DIR` | persistent upload path (for example `/uploads`) |

For file uploads, attach a Railway volume and mount it at the same `UPLOADS_DIR` path.

### 3. Flow
1. Register → Login.
2. Visit Dashboard → "New Project".
3. Upload marker image + matching `.mind` target file, then upload either a GLB/GLTF model or a video file.
4. Save & Publish, then share the `/{project-slug}/view/{project-id}` viewer link.

## Extending toward production
- Multiple assets & drag-and-drop canvas (Three.js overlay).
- Additional tracking modes (world tracking, face filters).
- Asset storage (S3, Firebase Storage) and file uploads.
- Org/team accounts, role-based access.
- Analytics dashboard with daily views, device breakdown.
- Templates marketplace + duplication.
- White-label viewer with custom branding/domains.

## Troubleshooting
- **Viewer requires HTTPS + camera permissions**: use `vite preview --host` or deploy to HTTPS (Netlify/Vercel) for mobile tests.
- **mind-ar marker**: generate `.mind` target file from your marker image (use mind-ar CLI) and host alongside the image.
- **Uploaded marker images still need `.mind`**: the `.mind` target is required for tracking and must match the marker image.
- **CORS/auth errors**: confirm `VITE_API_URL` matches backend origin and JWT token is set via `setToken()` in `frontend/src/api/auth.js`.
