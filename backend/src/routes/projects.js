import express from "express";
import slugify from "slugify";
import {
  createProjectDoc,
  findProjectBySlug,
  incrementProjectView,
  listProjectsByOwner
} from "../models/Project.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

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

    res.json(project);
  } catch (err) {
    console.error("Create project error", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authRequired, async (req, res) => {
  try {
    const projects = await listProjectsByOwner(req.userId);
    res.json(projects);
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
    res.json(updatedProject || project);
  } catch (err) {
    console.error("Fetch project error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
