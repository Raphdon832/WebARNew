import crypto from "crypto";
import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { authRequired } from "../middleware/authMiddleware.js";
import { contentUploadsDir, markerUploadsDir, uploadsRootDir } from "../lib/uploads.js";

const router = express.Router();

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const getFileExtension = (originalName = "") => path.extname(originalName).toLowerCase();

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

router.post("/model", uploadMiddleware(modelUpload), (req, res) => sendUploadResponse(req, res));

router.post("/video", uploadMiddleware(videoUpload), (req, res) => sendUploadResponse(req, res));

export default router;
