import { ensureMindARLoaded } from "./useMindAR";

const normalizeUrl = (url) => {
  if (!url) return "";
  if (window.location.protocol !== "https:") return url;
  if (url.startsWith("http://")) return `https://${url.slice("http://".length)}`;
  return url;
};

const getCompilerClass = () => window.MINDAR?.IMAGE?.Compiler || window.MINDAR?.Compiler;

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load marker image for compilation"));
    img.src = src;
  });

const compileFromImageSrc = async (src, onProgress) => {
  await ensureMindARLoaded();
  const CompilerClass = getCompilerClass();
  if (!CompilerClass) {
    throw new Error("MindAR compiler is unavailable");
  }

  const image = await loadImage(src);
  const compiler = new CompilerClass();

  await compiler.compileImageTargets([image], (progress) => {
    if (typeof onProgress === "function") onProgress(progress);
  });

  const buffer = await compiler.exportData();
  return new Blob([buffer], { type: "application/octet-stream" });
};

export const compileMindFileFromImageFile = async (file, onProgress) => {
  const objectUrl = URL.createObjectURL(file);
  try {
    return await compileFromImageSrc(objectUrl, onProgress);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const compileMindFileFromImageUrl = (url, onProgress) =>
  compileFromImageSrc(normalizeUrl(url), onProgress);
