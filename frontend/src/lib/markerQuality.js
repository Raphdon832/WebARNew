const normalizeUrl = (url) => {
  if (!url) return "";
  if (window.location.protocol !== "https:") return url;
  if (url.startsWith("http://")) return `https://${url.slice("http://".length)}`;
  return url;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read marker image for quality scoring"));
    image.src = src;
  });

const scoreResolution = (minDimension) => {
  if (minDimension >= 900) return 25;
  if (minDimension >= 700) return 22;
  if (minDimension >= 480) return 18;
  if (minDimension >= 320) return 10;
  return 4;
};

const ratingFromScore = (score) => {
  if (score >= 82) return "Excellent";
  if (score >= 68) return "Good";
  if (score >= 52) return "Fair";
  return "Poor";
};

export const analyzeMarkerImage = (image) => {
  const naturalWidth = image.naturalWidth || image.width;
  const naturalHeight = image.naturalHeight || image.height;
  const maxSampleSize = 240;
  const scale = Math.min(1, maxSampleSize / Math.max(naturalWidth, naturalHeight));
  const width = Math.max(8, Math.round(naturalWidth * scale));
  const height = Math.max(8, Math.round(naturalHeight * scale));

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("Browser canvas support is required for marker quality scoring");
  }
  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const { data } = context.getImageData(0, 0, width, height);
  const gray = new Float32Array(width * height);
  let total = 0;
  let totalSquared = 0;

  for (let i = 0; i < width * height; i += 1) {
    const offset = i * 4;
    const value = data[offset] * 0.299 + data[offset + 1] * 0.587 + data[offset + 2] * 0.114;
    gray[i] = value;
    total += value;
    totalSquared += value * value;
  }

  const pixelCount = width * height;
  const mean = total / pixelCount;
  const variance = totalSquared / pixelCount - mean * mean;
  const contrast = Math.sqrt(Math.max(0, variance));
  const cells = new Array(16).fill(0);
  let edgeCount = 0;
  let strongEdgeCount = 0;

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const topLeft = gray[(y - 1) * width + x - 1];
      const top = gray[(y - 1) * width + x];
      const topRight = gray[(y - 1) * width + x + 1];
      const left = gray[y * width + x - 1];
      const right = gray[y * width + x + 1];
      const bottomLeft = gray[(y + 1) * width + x - 1];
      const bottom = gray[(y + 1) * width + x];
      const bottomRight = gray[(y + 1) * width + x + 1];
      const gradientX = -topLeft - 2 * left - bottomLeft + topRight + 2 * right + bottomRight;
      const gradientY = -topLeft - 2 * top - topRight + bottomLeft + 2 * bottom + bottomRight;
      const gradient = Math.hypot(gradientX, gradientY) / 4;

      if (gradient > 32) {
        edgeCount += 1;
        const cellX = Math.min(3, Math.floor((x / width) * 4));
        const cellY = Math.min(3, Math.floor((y / height) * 4));
        cells[cellY * 4 + cellX] += 1;
      }

      if (gradient > 72) {
        strongEdgeCount += 1;
      }
    }
  }

  const sampleArea = Math.max(1, (width - 2) * (height - 2));
  const edgeDensity = edgeCount / sampleArea;
  const strongEdgeDensity = strongEdgeCount / sampleArea;
  const cellThreshold = sampleArea * 0.003;
  const coveredCells = cells.filter((count) => count >= cellThreshold).length;
  const minDimension = Math.min(naturalWidth, naturalHeight);
  const aspectRatio = naturalWidth / naturalHeight;

  const resolutionScore = scoreResolution(minDimension);
  const contrastScore = clamp((contrast - 18) / 46, 0, 1) * 25;
  const edgeScore = clamp(edgeDensity / 0.08, 0, 1) * 28;
  const strongEdgeScore = clamp(strongEdgeDensity / 0.025, 0, 1) * 8;
  const coverageScore = (coveredCells / 16) * 14;
  const score = Math.round(
    resolutionScore + contrastScore + edgeScore + strongEdgeScore + coverageScore
  );

  const issues = [];
  if (minDimension < 480) issues.push("Use at least 480px on the shortest side; 700px+ is better.");
  if (contrast < 30) issues.push("Increase contrast between light and dark areas.");
  if (edgeDensity < 0.035) issues.push("Add more distinctive detail, text, corners, or texture.");
  if (coveredCells < 8) issues.push("Spread visual features across the whole marker, not just one area.");
  if (aspectRatio > 3 || aspectRatio < 1 / 3) {
    issues.push("Avoid extremely narrow marker images where possible.");
  }

  return {
    score: clamp(score, 0, 100),
    rating: ratingFromScore(score),
    dimensions: {
      width: naturalWidth,
      height: naturalHeight
    },
    metrics: {
      contrast: Number(contrast.toFixed(1)),
      edgeDensity: Number(edgeDensity.toFixed(3)),
      strongEdgeDensity: Number(strongEdgeDensity.toFixed(3)),
      coveredCells
    },
    issues,
    summary:
      issues.length > 0
        ? "This marker may track, but it can jitter or lose lock under poor lighting."
        : "This marker has enough resolution, contrast, and distributed detail for stable tracking."
  };
};

export const evaluateMarkerQualityFromImageFile = async (file) => {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    return analyzeMarkerImage(image);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const evaluateMarkerQualityFromImageUrl = async (url) => {
  const image = await loadImage(normalizeUrl(url));
  return analyzeMarkerImage(image);
};
