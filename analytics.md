# Analytics Page + Event Pipeline

## Recommended Analytics Contents

The Studio analytics page should help creators understand whether viewers are opening, launching, engaging with, and converting from each AR experience.

V1 should be a per-project analytics page with:

- KPI cards: views, unique viewers, launches, launch rate, camera success rate, marker found rate, video completion rate, CTA click-through rate, and errors.
- Time-series activity: daily views, launches, marker detections, video completions, CTA impressions, CTA clicks, and errors.
- Funnel: `viewer_opened -> launch_clicked -> camera_permission_granted -> ar_session_started -> marker_found -> content_loaded -> video_completed -> cta_clicked`.
- Device breakdown: device type, browser, OS, AR engine, and content type.
- CTA performance: impressions, clicks, CTR, and configured destination URL when available.
- Recent errors: event time, error code/message, device type, browser, OS, and AR engine.

Future versions can add owner-wide reporting, CSV exports, project comparisons, retention, geography, alerts, and scheduled client reports.

## Event Taxonomy

Viewer events:

- `viewer_opened`
- `launch_clicked`
- `camera_permission_granted`
- `camera_permission_denied`
- `ar_session_started`
- `marker_found`
- `marker_lost`
- `content_loaded`
- `video_started`
- `video_completed`
- `cta_shown`
- `cta_clicked`
- `viewer_error`

Each event should include `projectId`, `slug`, `eventName`, `timestamp`, `sessionId`, `deviceType`, `browser`, `os`, `arEngine`, `contentType`, `timezone`, `screenBucket`, and a small `metadata` object for event-specific details.

## Data Model

Use the existing Firestore backend.

- `analyticsEvents`: raw append-only events for debugging and future reporting.
- `analyticsDailyRollups`: one document per project/day with counters, funnel counts, device/browser/OS breakdowns, and CTA/error counts.
- `analyticsUniqueViewers`: one document per project/day/fingerprint hash to dedupe unique viewer counts.

The existing project `viewCount` remains supported for backwards compatibility, but the analytics page should read from the analytics rollups.

## Robustness Requirements

- Validate event names against an allowlist.
- Validate project identity using `projectId` and `slug`.
- Never block AR startup when analytics fails.
- Use `navigator.sendBeacon` for unload-safe sends with a `fetch(..., { keepalive: true })` fallback.
- Dedupe noisy events in memory, especially `marker_found`, `marker_lost`, `cta_shown`, and `viewer_error`.
- Store raw events and rollups separately so the dashboard stays fast.
- Owner-scope all dashboard reads with the existing JWT auth middleware.
- Avoid storing raw IP addresses or raw device fingerprints.
- Store only HMAC hashes for fingerprint-based unique counts.
- Keep metadata small and sanitize arbitrary strings.

## Privacy Notes

V1 uses hash-only IP/device fingerprinting to estimate unique viewers. Raw IP addresses and raw fingerprints must not be stored.

Fingerprinting and similar tracking can be privacy-sensitive and may require additional notice, consent, or legal review depending on where viewers are located. Relevant guidance includes:

- FTC data security guidance: https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business
- ICO storage/access technologies guidance: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-storage-and-access-technologies/
- EDPB personal data guidance: https://www.edpb.europa.eu/sme-data-protection-guide/faq-frequently-asked-questions/answer/what-personal-data_en

## Execution Plan

1. Add this documentation file at repo root.
2. Add backend analytics model helpers for event ingestion, fingerprint hashing, daily rollup updates, and summary reads.
3. Add `/api/analytics/events` and `/api/analytics/projects/:projectId/summary`.
4. Add frontend analytics API helpers and a viewer analytics client.
5. Wire viewer lifecycle events into analytics tracking.
6. Add the authenticated Studio analytics page at `/analytics/:projectId`.
7. Link each dashboard project card to its analytics page.
8. Verify with backend startup checks and frontend production build.

## Implementation Plan

- Backend:
  - Mount `analyticsRoutes` in `server.js`.
  - Create a public event ingestion route with event allowlisting, project validation, metadata sanitization, hash-only fingerprinting, raw event writes, daily rollup increments, and unique viewer dedupe.
  - Create an authenticated summary route that verifies project ownership and returns KPI totals, daily rows, device/browser/OS breakdowns, CTA metrics, funnel counts, and recent errors.
- Frontend:
  - Export the API base URL from the existing API module.
  - Add `trackViewerEvent` and `fetchProjectAnalyticsSummary`.
  - Add a small client-side analytics helper for session IDs, device parsing, screen buckets, sendBeacon fallback, and dedupe/throttle.
  - Build the analytics page with existing Studio styling and lightweight CSS/SVG charts.
- Viewer:
  - Emit lifecycle events from existing hooks for open, launch, camera grant/deny, AR session start, marker found/lost, content load, video start/completion, CTA show/click, and viewer errors.
  - Use local refs to prevent duplicate first-run events from inflating the funnel.

## Acceptance Criteria

- `analytics.md` exists and documents contents, robustness, execution, implementation, privacy, and acceptance criteria.
- Viewer events are accepted only for valid projects and allowlisted event names.
- Analytics data is stored without raw IP addresses.
- The Studio analytics page loads for project owners and rejects unauthorized users.
- The analytics page shows useful empty states before events exist.
- The frontend build completes successfully.
