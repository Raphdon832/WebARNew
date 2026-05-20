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
  filterBeta: "8",
  warmupTolerance: "5",
  missTolerance: "10"
});

export const toInputTrackingOptions = (rawOptions = {}) => {
  const defaults = createDefaultTrackingOptions();

  return {
    filterMinCF: String(rawOptions.filterMinCF ?? defaults.filterMinCF),
    filterBeta: String(rawOptions.filterBeta ?? defaults.filterBeta),
    warmupTolerance: String(rawOptions.warmupTolerance ?? defaults.warmupTolerance),
    missTolerance: String(rawOptions.missTolerance ?? defaults.missTolerance)
  };
};

export const normalizeTrackingOptions = (inputOptions = {}) => {
  const raw = toInputTrackingOptions(inputOptions);

  return {
    filterMinCF: clamp(parseNumber(raw.filterMinCF, 0.001), 0.0001, 1),
    filterBeta: clamp(parseNumber(raw.filterBeta, 8), 0, 1000),
    warmupTolerance: clamp(parseInteger(raw.warmupTolerance, 5), 1, 30),
    missTolerance: clamp(parseInteger(raw.missTolerance, 10), 1, 30)
  };
};
