import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProjectAnalyticsSummary } from "../api/analytics";
import { setToken } from "../api/auth";

const RANGE_OPTIONS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 }
];

const formatDateKey = (date) => date.toISOString().slice(0, 10);

const getRangeParams = (days) => {
  const to = new Date();
  const from = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()));
  from.setUTCDate(from.getUTCDate() - days + 1);
  return { from: formatDateKey(from), to: formatDateKey(to) };
};

const formatNumber = (value) => new Intl.NumberFormat().format(value || 0);

const formatPercent = (value) => `${Math.round((value || 0) * 100)}%`;

const EmptyMetric = () => <span className="analytics-empty-value">No data</span>;

const StatCard = ({ label, value, hint }) => (
  <div className="analytics-stat">
    <p>{label}</p>
    <strong>{value ?? <EmptyMetric />}</strong>
    {hint && <span>{hint}</span>}
  </div>
);

const ActivityChart = ({ daily = [] }) => {
  const width = 720;
  const height = 220;
  const padding = 28;
  const maxValue = Math.max(
    1,
    ...daily.map((day) =>
      Math.max(day.views || 0, day.launches || 0, day.markerFounds || 0, day.ctaClicks || 0)
    )
  );
  const xFor = (index) =>
    padding + (daily.length <= 1 ? 0 : (index / (daily.length - 1)) * (width - padding * 2));
  const yFor = (value) => height - padding - (value / maxValue) * (height - padding * 2);
  const lineFor = (key) =>
    daily.map((day, index) => `${xFor(index)},${yFor(day[key] || 0)}`).join(" ");

  if (!daily.length) {
    return <div className="analytics-empty-panel">No daily activity yet.</div>;
  }

  return (
    <div className="analytics-chart-wrap">
      <svg
        className="analytics-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Daily analytics activity"
      >
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} />
        <polyline points={lineFor("views")} className="analytics-line analytics-line--views" />
        <polyline points={lineFor("launches")} className="analytics-line analytics-line--launches" />
        <polyline points={lineFor("ctaClicks")} className="analytics-line analytics-line--cta" />
      </svg>
      <div className="analytics-legend">
        <span className="legend-item legend-item--views">Views</span>
        <span className="legend-item legend-item--launches">Launches</span>
        <span className="legend-item legend-item--cta">CTA clicks</span>
      </div>
    </div>
  );
};

const Funnel = ({ steps = [] }) => {
  const max = Math.max(1, ...steps.map((step) => step.count || 0));

  return (
    <div className="analytics-funnel">
      {steps.map((step) => (
        <div className="analytics-funnel-row" key={step.eventName}>
          <span>{step.label}</span>
          <div className="analytics-funnel-track">
            <div style={{ width: `${Math.max(3, ((step.count || 0) / max) * 100)}%` }} />
          </div>
          <strong>{formatNumber(step.count)}</strong>
        </div>
      ))}
    </div>
  );
};

const BreakdownList = ({ title, items = [] }) => (
  <div className="analytics-panel">
    <div className="analytics-panel-head">
      <h2>{title}</h2>
    </div>
    {items.length ? (
      <div className="analytics-breakdown-list">
        {items.slice(0, 6).map((item) => (
          <div className="analytics-breakdown-row" key={item.key}>
            <span>{item.label}</span>
            <strong>{formatNumber(item.count)}</strong>
          </div>
        ))}
      </div>
    ) : (
      <div className="analytics-empty-panel">No breakdown data yet.</div>
    )}
  </div>
);

const Analytics = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [rangeDays, setRangeDays] = useState(30);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rangeParams = useMemo(() => getRangeParams(rangeDays), [rangeDays]);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjectAnalyticsSummary(projectId, rangeParams);
      setSummary(data);
    } catch (err) {
      if (err.response?.status === 401) {
        setToken(null);
        navigate("/login");
        return;
      }
      setError(err.response?.data?.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  }, [navigate, projectId, rangeParams]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const totals = summary?.totals || {};
  const rates = summary?.rates || {};
  const hasData = Boolean(totals.views || totals.launches || totals.arSessions);
  const kpis = [
    ["Views", formatNumber(totals.views), `${formatNumber(totals.uniqueViewers)} unique`],
    ["Launches", formatNumber(totals.launches), `${formatPercent(rates.launchRate)} launch rate`],
    ["Camera Success", formatPercent(rates.cameraSuccessRate), `${formatNumber(totals.cameraGranted)} allowed`],
    ["Marker Found", formatPercent(rates.markerFoundRate), `${formatNumber(totals.markerFounds)} detections`],
    ["Video Complete", formatPercent(rates.videoCompletionRate), `${formatNumber(totals.videoCompletions)} completions`],
    ["CTA CTR", formatPercent(rates.ctaCtr), `${formatNumber(totals.ctaClicks)} clicks`],
    ["Errors", formatNumber(totals.errors), `${formatPercent(rates.errorRate)} error rate`]
  ];

  return (
    <div className="analytics-layout">
      <div className="analytics-hero">
        <div>
          <p className="eyebrow">Studio Analytics</p>
          <h1>{summary?.project?.name || "Project Analytics"}</h1>
          <p>
            Track viewer opens, launches, AR readiness, marker detection, video engagement, CTA
            actions, and viewer errors.
          </p>
        </div>
        <div className="analytics-actions">
          <Link className="ghost-btn" to="/dashboard">
            Dashboard
          </Link>
          {summary?.project && (
            <Link className="ghost-btn" to={`/${summary.project.slug}/view/${summary.project.id}`} target="_blank">
              View
            </Link>
          )}
        </div>
      </div>

      <div className="analytics-toolbar">
        <div>
          <span>{rangeParams.from}</span>
          <span>to</span>
          <span>{rangeParams.to}</span>
        </div>
        <div className="analytics-range">
          {RANGE_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.days}
              className={rangeDays === option.days ? "active" : ""}
              onClick={() => setRangeDays(option.days)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {loading && <p>Loading analytics...</p>}

      {!loading && summary && (
        <>
          {!hasData && (
            <div className="analytics-empty-panel">
              No analytics events yet. Open the viewer and interact with the AR experience to start
              filling this page.
            </div>
          )}

          <div className="analytics-stat-grid">
            {kpis.map(([label, value, hint]) => (
              <StatCard key={label} label={label} value={value} hint={hint} />
            ))}
          </div>

          <div className="analytics-grid">
            <section className="analytics-panel analytics-panel--wide">
              <div className="analytics-panel-head">
                <h2>Activity</h2>
                <p>Views, launches, and CTA clicks by day.</p>
              </div>
              <ActivityChart daily={summary.daily} />
            </section>

            <section className="analytics-panel">
              <div className="analytics-panel-head">
                <h2>Funnel</h2>
                <p>Major viewer milestones.</p>
              </div>
              <Funnel steps={summary.funnel} />
            </section>

            <section className="analytics-panel">
              <div className="analytics-panel-head">
                <h2>CTA</h2>
                <p>{summary.cta.url || "No CTA URL configured."}</p>
              </div>
              <div className="analytics-cta-metrics">
                <StatCard label="Impressions" value={formatNumber(summary.cta.impressions)} />
                <StatCard label="Clicks" value={formatNumber(summary.cta.clicks)} />
                <StatCard label="CTR" value={formatPercent(summary.cta.ctr)} />
              </div>
            </section>

            <BreakdownList title="Devices" items={summary.breakdowns.deviceType} />
            <BreakdownList title="Browsers" items={summary.breakdowns.browser} />
            <BreakdownList title="Operating Systems" items={summary.breakdowns.os} />
            <BreakdownList title="AR Engines" items={summary.breakdowns.arEngine} />
            <BreakdownList title="Content Types" items={summary.breakdowns.contentType} />
            <BreakdownList title="Top Countries" items={summary.breakdowns.country} />
            <BreakdownList title="Top Regions" items={summary.breakdowns.region} />
            <BreakdownList title="Top Cities" items={summary.breakdowns.city} />
            <BreakdownList title="Timezones" items={summary.breakdowns.timezone} />

            <section className="analytics-panel analytics-panel--wide">
              <div className="analytics-panel-head">
                <h2>Recent Errors</h2>
                <p>Last viewer-side errors captured in this date range.</p>
              </div>
              {summary.recentErrors.length ? (
                <div className="analytics-error-list">
                  {summary.recentErrors.map((item, index) => (
                    <div className="analytics-error-row" key={`${item.occurredAt}-${index}`}>
                      <div>
                        <strong>{item.message}</strong>
                        <span>
                          {item.deviceType} - {item.browser} - {item.os} - {item.arEngine}
                        </span>
                      </div>
                      <time>{new Date(item.occurredAt).toLocaleString()}</time>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="analytics-empty-panel">No viewer errors in this range.</div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
