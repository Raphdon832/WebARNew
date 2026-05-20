const parseNumber = (value, fallback) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const createDefaultTrackingOptions = () => ({
  filterMinCF: "0.001",
  filterBeta: "4",
  warmupTolerance: "6",
  missTolerance: "12",
  cameraWidth: "1280",
  cameraHeight: "720"
});

export const toInputTrackingOptions = (rawOptions = {}) => {
  const defaults = createDefaultTrackingOptions();

  return {
    filterMinCF: String(rawOptions.filterMinCF ?? defaults.filterMinCF),
    filterBeta: String(rawOptions.filterBeta ?? defaults.filterBeta),
    warmupTolerance: String(rawOptions.warmupTolerance ?? defaults.warmupTolerance),
    missTolerance: String(rawOptions.missTolerance ?? defaults.missTolerance),
    cameraWidth: String(rawOptions.cameraWidth ?? defaults.cameraWidth),
    cameraHeight: String(rawOptions.cameraHeight ?? defaults.cameraHeight)
  };
};

export const normalizeTrackingOptions = (inputOptions = {}) => {
  const raw = toInputTrackingOptions(inputOptions);

  return {
    filterMinCF: clamp(parseNumber(raw.filterMinCF, 0.001), 0.0001, 1),
    filterBeta: clamp(parseNumber(raw.filterBeta, 4), 0, 1000),
    warmupTolerance: clamp(parseInteger(raw.warmupTolerance, 6), 1, 30),
    missTolerance: clamp(parseInteger(raw.missTolerance, 12), 1, 30),
    cameraWidth: clamp(parseInteger(raw.cameraWidth, 1280), 640, 1920),
    cameraHeight: clamp(parseInteger(raw.cameraHeight, 720), 360, 1080)
  };
};
