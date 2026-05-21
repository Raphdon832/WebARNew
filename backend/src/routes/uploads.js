import crypto from "crypto";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import { authRequired } from "../middleware/authMiddleware.js";
import {
  contentUploadsDir,
  eighthWallTargetsDir,
  markerUploadsDir,
  uploadsRootDir
} from "../lib/uploads.js";

const router = express.Router();

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const getFileExtension = (originalName = "") => path.extname(originalName).toLowerCase();

const sanitizeTargetName = (value = "webar-marker") => {
  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "webar-marker";
};

const getImageExtensionFromFormat = (format = "") => {
  if (format === "jpeg" || format === "jpg") return "jpg";
  if (format === "png") return "png";
  if (format === "webp") return "webp";
  return "jpg";
};

const createUploader = ({ subDir, allowedExtensions, allowedMimePrefixes }) => {
  const uploadDir = subDir === "markers" ? markerUploadsDir : contentUploadsDir;

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      ensureDir(uploadDir);
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const extension = getFileExtension(file.originalname);
      cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const extension = getFileExtension(file.originalname);
      const hasAllowedExtension = allowedExtensions.includes(extension);
      const hasAllowedMimeType =
        allowedMimePrefixes.length === 0 ||
        allowedMimePrefixes.some((prefix) => file.mimetype.startsWith(prefix));

      if (!hasAllowedExtension || !hasAllowedMimeType) {
        return cb(new Error("Unsupported file type"));
      }

      cb(null, true);
    }
  });
};

const markerImageUpload = createUploader({
  subDir: "markers",
  allowedExtensions: [".png", ".jpg", ".jpeg"],
  allowedMimePrefixes: ["image/"]
});

const markerTargetUpload = createUploader({
  subDir: "markers",
  allowedExtensions: [".mind"],
  allowedMimePrefixes: []
});

const modelUpload = createUploader({
  subDir: "content",
  allowedExtensions: [".glb", ".gltf"],
  allowedMimePrefixes: []
});

const videoUpload = createUploader({
  subDir: "content",
  allowedExtensions: [".mp4", ".webm", ".ogg", ".mov"],
  allowedMimePrefixes: ["video/"]
});

const uploadMiddleware = (uploader) => (req, res, next) => {
  uploader.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload failed" });
    }
    next();
  });
};

const toPublicUrl = (req, filePath) => {
  const relativePath = path.relative(uploadsRootDir, filePath).split(path.sep).join("/");
  const forwardedProtocol = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || req.protocol;
  const host = forwardedHost || req.get("host");

  return `${protocol}://${host}/uploads/${relativePath}`;
};

const getRequestHost = (req) => req.get("x-forwarded-host")?.split(",")[0]?.trim() || req.get("host");

const resolveLocalUploadPathFromUrl = (markerImageUrl, req) => {
  try {
    const parsedUrl = new URL(markerImageUrl);
    const uploadPrefix = "/uploads/";
    if (!parsedUrl.pathname.startsWith(uploadPrefix)) return null;

    const requestHost = getRequestHost(req);
    const isSameBackend =
      parsedUrl.host === requestHost ||
      ["localhost", "127.0.0.1", "0.0.0.0"].includes(parsedUrl.hostname);

    if (!isSameBackend) return null;

    const relativeUploadPath = decodeURIComponent(parsedUrl.pathname.slice(uploadPrefix.length));
    const absolutePath = path.resolve(uploadsRootDir, relativeUploadPath);
    const uploadsRoot = path.resolve(uploadsRootDir);
    if (!absolutePath.startsWith(`${uploadsRoot}${path.sep}`)) return null;

    return absolutePath;
  } catch (_err) {
    return null;
  }
};

const readMarkerImageBuffer = async (markerImageUrl, req) => {
  const localUploadPath = resolveLocalUploadPathFromUrl(markerImageUrl, req);
  if (localUploadPath) {
    if (!fs.existsSync(localUploadPath)) {
      throw new Error(
        "Marker image file is not available on this backend. Re-upload the marker image, then generate the 8th Wall target."
      );
    }

    return fs.promises.readFile(localUploadPath);
  }

  const response = await fetch(markerImageUrl);
  if (!response.ok) {
    throw new Error("Marker image could not be downloaded");
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error("Marker URL did not return an image");
  }

  return Buffer.from(await response.arrayBuffer());
};

const generateEightWallImageTarget = async ({ markerImageUrl, targetName, req }) => {
  if (!markerImageUrl) {
    throw new Error("Marker image URL is required");
  }

  const markerBuffer = await readMarkerImageBuffer(markerImageUrl, req);
  const image = sharp(markerBuffer, { failOn: "none" }).rotate();
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Marker image dimensions could not be read");
  }

  const safeName = sanitizeTargetName(targetName);
  const extension = getImageExtensionFromFormat(metadata.format);
  const bundleId = `${Date.now()}-${crypto.randomUUID()}`;
  const bundleDir = path.join(eighthWallTargetsDir, bundleId);
  ensureDir(bundleDir);

  const resources = {
    originalImage: `${safeName}_original.${extension}`,
    croppedImage: `${safeName}_cropped.${extension}`,
    thumbnailImage: `${safeName}_thumbnail.${extension}`,
    luminanceImage: `${safeName}_luminance.${extension}`
  };

  const targetJsonPath = path.join(bundleDir, `${safeName}.json`);
  const originalImagePath = path.join(bundleDir, resources.originalImage);
  const croppedImagePath = path.join(bundleDir, resources.croppedImage);
  const thumbnailImagePath = path.join(bundleDir, resources.thumbnailImage);
  const luminanceImagePath = path.join(bundleDir, resources.luminanceImage);

  const toOutputFormat = (pipeline) =>
    extension === "png"
      ? pipeline.png()
      : extension === "webp"
        ? pipeline.webp({ quality: 90 })
        : pipeline.jpeg({ quality: 92, mozjpeg: true });

  await Promise.all([
    toOutputFormat(image.clone()).toFile(originalImagePath),
    toOutputFormat(image.clone()).toFile(croppedImagePath),
    toOutputFormat(image.clone().resize({ height: 350 })).toFile(thumbnailImagePath),
    toOutputFormat(image.clone().resize({ height: 640 }).grayscale()).toFile(luminanceImagePath)
  ]);

  const targetData = {
    imagePath: resources.luminanceImage,
    metadata: null,
    name: safeName,
    type: "PLANAR",
    properties: {
      top: 0,
      left: 0,
      width: metadata.width,
      height: metadata.height,
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      isRotated: false
    },
    resources,
    created: Date.now(),
    updated: Date.now()
  };

  await fs.promises.writeFile(targetJsonPath, `${JSON.stringify(targetData, null, 2)}\n`);

  const warnings = [];
  if (metadata.width < 480 || metadata.height < 640) {
    warnings.push("Marker image is below 480 x 640px; tracking quality may be weaker.");
  }

  return {
    url: toPublicUrl(req, targetJsonPath),
    targetName: safeName,
    imageUrl: toPublicUrl(req, luminanceImagePath),
    resources: Object.fromEntries(
      Object.entries(resources).map(([key, fileName]) => [
        key,
        toPublicUrl(req, path.join(bundleDir, fileName))
      ])
    ),
    warnings
  };
};

const sendUploadResponse = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  return res.json({
    url: toPublicUrl(req, req.file.path),
    fileName: req.file.filename,
    size: req.file.size
  });
};

router.use(authRequired);

router.post("/marker-image", uploadMiddleware(markerImageUpload), (req, res) =>
  sendUploadResponse(req, res)
);

router.post("/marker-target", uploadMiddleware(markerTargetUpload), (req, res) =>
  sendUploadResponse(req, res)
);

router.post("/eighthwall-target", async (req, res) => {
  try {
    const target = await generateEightWallImageTarget({
      markerImageUrl: req.body?.markerImageUrl,
      targetName: req.body?.targetName,
      req
    });

    res.json(target);
  } catch (err) {
    console.error("8th Wall target generation error", err);
    res.status(400).json({ message: err.message || "8th Wall target generation failed" });
  }
});

router.post("/model", uploadMiddleware(modelUpload), (req, res) => sendUploadResponse(req, res));

router.post("/video", uploadMiddleware(videoUpload), (req, res) => sendUploadResponse(req, res));

export default router;
