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
  arEngine: "mindar",
  filterMinCF: "0.001",
  filterBeta: "4",
  warmupTolerance: "6",
  missTolerance: "12",
  poseSmoothingEnabled: true,
  poseSmoothingAmount: "0.72",
  poseSmoothingDeadband: "0.0015",
  poseRotationDeadband: "0.18",
  cameraWidth: "1920",
  cameraHeight: "1080",
  cameraFrameRate: "30",
  cameraFacingMode: "environment",
  eighthWallTargetName: "webar-marker",
  eighthWallTargetUrl: "",
  eighthWallRotationCorrectionZ: "-90"
});

export const toInputTrackingOptions = (rawOptions = {}) => {
  const defaults = createDefaultTrackingOptions();

  return {
    arEngine: rawOptions.arEngine === "8thwall" ? "8thwall" : defaults.arEngine,
    filterMinCF: String(rawOptions.filterMinCF ?? defaults.filterMinCF),
    filterBeta: String(rawOptions.filterBeta ?? defaults.filterBeta),
    warmupTolerance: String(rawOptions.warmupTolerance ?? defaults.warmupTolerance),
    missTolerance: String(rawOptions.missTolerance ?? defaults.missTolerance),
    poseSmoothingEnabled:
      rawOptions.poseSmoothingEnabled ?? defaults.poseSmoothingEnabled,
    poseSmoothingAmount: String(
      rawOptions.poseSmoothingAmount ?? defaults.poseSmoothingAmount
    ),
    poseSmoothingDeadband: String(
      rawOptions.poseSmoothingDeadband ?? defaults.poseSmoothingDeadband
    ),
    poseRotationDeadband: String(
      rawOptions.poseRotationDeadband ?? defaults.poseRotationDeadband
    ),
    cameraWidth: String(rawOptions.cameraWidth ?? defaults.cameraWidth),
    cameraHeight: String(rawOptions.cameraHeight ?? defaults.cameraHeight),
    cameraFrameRate: String(rawOptions.cameraFrameRate ?? defaults.cameraFrameRate),
    cameraFacingMode: rawOptions.cameraFacingMode || defaults.cameraFacingMode,
    eighthWallTargetName: String(
      rawOptions.eighthWallTargetName ?? defaults.eighthWallTargetName
    ),
    eighthWallTargetUrl: String(rawOptions.eighthWallTargetUrl ?? defaults.eighthWallTargetUrl),
    eighthWallRotationCorrectionZ: String(
      rawOptions.eighthWallRotationCorrectionZ ?? defaults.eighthWallRotationCorrectionZ
    )
  };
};

export const normalizeTrackingOptions = (inputOptions = {}) => {
  const raw = toInputTrackingOptions(inputOptions);

  return {
    arEngine: raw.arEngine === "8thwall" ? "8thwall" : "mindar",
    filterMinCF: clamp(parseNumber(raw.filterMinCF, 0.001), 0.0001, 1),
    filterBeta: clamp(parseNumber(raw.filterBeta, 4), 0, 1000),
    warmupTolerance: clamp(parseInteger(raw.warmupTolerance, 6), 1, 30),
    missTolerance: clamp(parseInteger(raw.missTolerance, 12), 1, 30),
    poseSmoothingEnabled: Boolean(raw.poseSmoothingEnabled),
    poseSmoothingAmount: clamp(parseNumber(raw.poseSmoothingAmount, 0.72), 0, 0.95),
    poseSmoothingDeadband: clamp(parseNumber(raw.poseSmoothingDeadband, 0.0015), 0, 0.05),
    poseRotationDeadband: clamp(parseNumber(raw.poseRotationDeadband, 0.18), 0, 5),
    cameraWidth: clamp(parseInteger(raw.cameraWidth, 1920), 640, 2560),
    cameraHeight: clamp(parseInteger(raw.cameraHeight, 1080), 360, 1440),
    cameraFrameRate: clamp(parseInteger(raw.cameraFrameRate, 30), 15, 60),
    cameraFacingMode: raw.cameraFacingMode === "user" ? "user" : "environment",
    eighthWallTargetName: raw.eighthWallTargetName?.trim() || "webar-marker",
    eighthWallTargetUrl: raw.eighthWallTargetUrl?.trim() || "",
    eighthWallRotationCorrectionZ: clamp(
      parseNumber(raw.eighthWallRotationCorrectionZ, -90),
      -360,
      360
    )
  };
};
