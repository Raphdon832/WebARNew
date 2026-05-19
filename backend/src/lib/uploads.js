import path from "path";

export const uploadsRootDir = process.env.UPLOADS_DIR || path.resolve(process.cwd(), "uploads");
export const markerUploadsDir = path.join(uploadsRootDir, "markers");
export const contentUploadsDir = path.join(uploadsRootDir, "content");
