const isBoolean = (value) => typeof value === "boolean";

const sanitizeText = (value, fallback, maxLength = 64) => {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  return trimmed.slice(0, maxLength);
};

const sanitizeOptionalText = (value, maxLength = 64) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

export const createDefaultLoadingScreenOptions = () => ({
  backgroundImageUrl: "",
  showStartButton: false,
  startButtonText: "Play",
  scanInstructionText: "",
  showScanAnimation: false
});

export const toInputLoadingScreenOptions = (rawOptions = {}) => {
  const defaults = createDefaultLoadingScreenOptions();
  return {
    backgroundImageUrl:
      typeof rawOptions.backgroundImageUrl === "string"
        ? rawOptions.backgroundImageUrl
        : defaults.backgroundImageUrl,
    showStartButton: isBoolean(rawOptions.showStartButton)
      ? rawOptions.showStartButton
      : defaults.showStartButton,
    startButtonText: sanitizeText(rawOptions.startButtonText, defaults.startButtonText),
    scanInstructionText: sanitizeOptionalText(rawOptions.scanInstructionText, 96),
    showScanAnimation: isBoolean(rawOptions.showScanAnimation)
      ? rawOptions.showScanAnimation
      : defaults.showScanAnimation
  };
};

export const normalizeLoadingScreenOptions = (rawOptions = {}) => {
  const input = toInputLoadingScreenOptions(rawOptions);

  return {
    backgroundImageUrl: input.backgroundImageUrl,
    showStartButton: Boolean(input.showStartButton),
    startButtonText: sanitizeText(input.startButtonText, "Play"),
    scanInstructionText: sanitizeOptionalText(input.scanInstructionText, 96),
    showScanAnimation: Boolean(input.showScanAnimation)
  };
};
