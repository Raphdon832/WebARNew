const resolveViewerOrigin = () => {
  const configuredOrigin = import.meta.env.VITE_STUDIO_ORIGIN || window.location.origin;
  return configuredOrigin.replace(/\/$/, "");
};

export const buildViewerPath = (project) => {
  if (!project?.slug) return "";
  return `/v/${project.slug}`;
};

export const buildViewerUrl = (project, origin = resolveViewerOrigin()) => {
  const path = buildViewerPath(project);
  if (!path) return "";
  return `${origin}${path}`;
};
