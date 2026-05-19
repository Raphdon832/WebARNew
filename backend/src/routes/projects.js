import express from "express";
import slugify from "slugify";
import {
  createProjectDoc,
  deleteProjectDoc,
  findProjectById,
  findProjectBySlug,
  incrementProjectView,
  listProjectsByOwner,
  updateProjectDoc
} from "../models/Project.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

const getPublicOrigin = (req) => {
  const forwardedProtocol = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
  const protocol = forwardedProtocol || req.protocol;
  const host = forwardedHost || req.get("host");
  return `${protocol}://${host}`;
};

const rewriteUploadUrlIfLocalhost = (value, publicOrigin) => {
  if (typeof value !== "string") return value;
  const match = value.match(
    /^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(\/uploads\/.+)$/i
  );
  if (!match) return value;
  return `${publicOrigin}${match[1]}`;
};

const rewriteConfigUploadUrls = (config, publicOrigin) => {
  if (!config || typeof config !== "object") return config;

  const rewrittenConfig = { ...config };
  ["markerImageUrl", "mindFileUrl", "contentUrl"].forEach((key) => {
    rewrittenConfig[key] = rewriteUploadUrlIfLocalhost(rewrittenConfig[key], publicOrigin);
  });

  if (rewrittenConfig.loadingScreen && typeof rewrittenConfig.loadingScreen === "object") {
    rewrittenConfig.loadingScreen = {
      ...rewrittenConfig.loadingScreen,
      backgroundImageUrl: rewriteUploadUrlIfLocalhost(
        rewrittenConfig.loadingScreen.backgroundImageUrl,
        publicOrigin
      )
    };
  }

  return rewrittenConfig;
};

const normalizeProjectForClient = (project, req) => {
  if (!project) return project;
  return {
    ...project,
    config: rewriteConfigUploadUrls(project.config, getPublicOrigin(req))
  };
};

const generateSlug = async (name) => {
  const slugBase = slugify(name, { lower: true, strict: true }) || "project";
  let slug = `${slugBase}-${Date.now()}`;

  const exists = await findProjectBySlug(slug);
  if (!exists) return slug;

  slug = `${slugBase}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return slug;
};

router.post("/", authRequired, async (req, res) => {
  try {
    const { name, config } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const slug = await generateSlug(name);

    const project = await createProjectDoc({
      owner: req.userId,
      name,
      slug,
      config
    });

    res.json(normalizeProjectForClient(project, req));
  } catch (err) {
    console.error("Create project error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authRequired, async (req, res) => {
  try {
    const projects = await listProjectsByOwner(req.userId);
    res.json(projects.map((project) => normalizeProjectForClient(project, req)));
  } catch (err) {
    console.error("List projects error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/slug/:slug", async (req, res) => {
  try {
    const project = await findProjectBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ message: "Not found" });
    }

    await incrementProjectView(project.id);
    const updatedProject = await findProjectBySlug(req.params.slug);
    res.json(normalizeProjectForClient(updatedProject || project, req));
  } catch (err) {
    console.error("Fetch project error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", authRequired, async (req, res) => {
  try {
    const project = await findProjectById(req.params.id);
    if (!project || project.owner !== req.userId) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(normalizeProjectForClient(project, req));
  } catch (err) {
    console.error("Fetch project by id error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authRequired, async (req, res) => {
  try {
    const existing = await findProjectById(req.params.id);
    if (!existing || existing.owner !== req.userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { name, config } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const updated = await updateProjectDoc(req.params.id, {
      name,
      config
    });

    res.json(normalizeProjectForClient(updated, req));
  } catch (err) {
    console.error("Update project error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authRequired, async (req, res) => {
  try {
    const existing = await findProjectById(req.params.id);
    if (!existing || existing.owner !== req.userId) {
      return res.status(404).json({ message: "Project not found" });
    }

    await deleteProjectDoc(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Delete project error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
