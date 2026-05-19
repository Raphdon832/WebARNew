const isBoolean = (value) => typeof value === "boolean";

const parseNumber = (value, fallback) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const createDefaultVideoOptions = () => ({
  autoplay: true,
  loop: true,
  muted: true,
  playsInline: true,
  showControls: false,
  maintainAspectRatio: true,
  invertAspectRatio: false,
  flipHorizontal: false,
  flipVertical: false,
  fit: "contain",
  playbackRate: "1",
  opacity: "1",
  startTimeSec: "0",
  pauseWhenTargetLost: true,
  restartOnTargetFound: false
});

export const toInputVideoOptions = (rawOptions = {}) => {
  const defaults = createDefaultVideoOptions();

  return {
    autoplay: isBoolean(rawOptions.autoplay) ? rawOptions.autoplay : defaults.autoplay,
    loop: isBoolean(rawOptions.loop) ? rawOptions.loop : defaults.loop,
    muted: isBoolean(rawOptions.muted) ? rawOptions.muted : defaults.muted,
    playsInline: isBoolean(rawOptions.playsInline) ? rawOptions.playsInline : defaults.playsInline,
    showControls: isBoolean(rawOptions.showControls) ? rawOptions.showControls : defaults.showControls,
    maintainAspectRatio: isBoolean(rawOptions.maintainAspectRatio)
      ? rawOptions.maintainAspectRatio
      : defaults.maintainAspectRatio,
    invertAspectRatio: isBoolean(rawOptions.invertAspectRatio)
      ? rawOptions.invertAspectRatio
      : defaults.invertAspectRatio,
    flipHorizontal: isBoolean(rawOptions.flipHorizontal)
      ? rawOptions.flipHorizontal
      : defaults.flipHorizontal,
    flipVertical: isBoolean(rawOptions.flipVertical) ? rawOptions.flipVertical : defaults.flipVertical,
    fit:
      rawOptions.fit === "cover" || rawOptions.fit === "fill" || rawOptions.fit === "contain"
        ? rawOptions.fit
        : defaults.fit,
    playbackRate: String(rawOptions.playbackRate ?? defaults.playbackRate),
    opacity: String(rawOptions.opacity ?? defaults.opacity),
    startTimeSec: String(rawOptions.startTimeSec ?? defaults.startTimeSec),
    pauseWhenTargetLost: isBoolean(rawOptions.pauseWhenTargetLost)
      ? rawOptions.pauseWhenTargetLost
      : defaults.pauseWhenTargetLost,
    restartOnTargetFound: isBoolean(rawOptions.restartOnTargetFound)
      ? rawOptions.restartOnTargetFound
      : defaults.restartOnTargetFound
  };
};

export const normalizeVideoOptions = (inputOptions = {}) => {
  const raw = toInputVideoOptions(inputOptions);

  return {
    autoplay: Boolean(raw.autoplay),
    loop: Boolean(raw.loop),
    muted: Boolean(raw.muted),
    playsInline: Boolean(raw.playsInline),
    showControls: Boolean(raw.showControls),
    maintainAspectRatio: Boolean(raw.maintainAspectRatio),
    invertAspectRatio: Boolean(raw.invertAspectRatio),
    flipHorizontal: Boolean(raw.flipHorizontal),
    flipVertical: Boolean(raw.flipVertical),
    fit: raw.fit,
    playbackRate: clamp(parseNumber(raw.playbackRate, 1), 0.25, 3),
    opacity: clamp(parseNumber(raw.opacity, 1), 0, 1),
    startTimeSec: Math.max(0, parseNumber(raw.startTimeSec, 0)),
    pauseWhenTargetLost: Boolean(raw.pauseWhenTargetLost),
    restartOnTargetFound: Boolean(raw.restartOnTargetFound)
  };
};
