import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorCanvas from "../components/EditorCanvas";
import ProjectForm from "../components/ProjectForm";
import { createProject, fetchProjectById, updateProject } from "../api/projects";
import {
  uploadMarkerImage,
  uploadMarkerTarget,
  uploadModel,
  uploadVideo
} from "../api/uploads";
import {
  createDefaultVideoOptions,
  normalizeVideoOptions,
  toInputVideoOptions
} from "../lib/videoOptions";
import {
  createDefaultLoadingScreenOptions,
  normalizeLoadingScreenOptions,
  toInputLoadingScreenOptions
} from "../lib/loadingScreenOptions";
import {
  createDefaultTrackingOptions,
  normalizeTrackingOptions,
  toInputTrackingOptions
} from "../lib/trackingOptions";
import {
  compileMindFileFromImageFile,
  compileMindFileFromImageUrl
} from "../lib/mindFileCompiler";

const createDefaultTransform = (type = "model") => ({
  position: { x: "0", y: "0", z: "0" },
  rotation: { x: "0", y: "0", z: "0" },
  scale: type === "video" ? { x: "1", y: "1", z: "1" } : { x: "0.2", y: "0.2", z: "0.2" }
});

const parseNumber = (value, fallback) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toInputTransform = (rawTransform, type) => {
  const fallback = createDefaultTransform(type);
  return {
    position: {
      x: String(rawTransform?.position?.x ?? fallback.position.x),
      y: String(rawTransform?.position?.y ?? fallback.position.y),
      z: String(rawTransform?.position?.z ?? fallback.position.z)
    },
    rotation: {
      x: String(rawTransform?.rotation?.x ?? fallback.rotation.x),
      y: String(rawTransform?.rotation?.y ?? fallback.rotation.y),
      z: String(rawTransform?.rotation?.z ?? fallback.rotation.z)
    },
    scale: {
      x: String(rawTransform?.scale?.x ?? fallback.scale.x),
      y: String(rawTransform?.scale?.y ?? fallback.scale.y),
      z: String(rawTransform?.scale?.z ?? fallback.scale.z)
    }
  };
};

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id && id !== "new";

  const [name, setName] = useState("");
  const [contentType, setContentType] = useState("model");
  const [markerImageUrl, setMarkerImageUrl] = useState("");
  const [mindFileUrl, setMindFileUrl] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [labelText, setLabelText] = useState("");
  const [transform, setTransform] = useState(createDefaultTransform("model"));
  const [videoOptions, setVideoOptions] = useState(createDefaultVideoOptions());
  const [loadingScreen, setLoadingScreen] = useState(createDefaultLoadingScreenOptions());
  const [trackingOptions, setTrackingOptions] = useState(createDefaultTrackingOptions());
  const [projectSlug, setProjectSlug] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingProject, setLoadingProject] = useState(Boolean(isEditing));
  const [markerUploading, setMarkerUploading] = useState(false);
  const [mindUploading, setMindUploading] = useState(false);
  const [mindCompiling, setMindCompiling] = useState(false);
  const [mindCompileProgress, setMindCompileProgress] = useState(0);
  const [loadingBackgroundUploading, setLoadingBackgroundUploading] = useState(false);
  const [contentUploading, setContentUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const pageTitle = useMemo(() => (isEditing ? "Edit Project" : "Create Project"), [isEditing]);

  useEffect(() => {
    if (!isEditing) return;

    let active = true;
    setLoadingProject(true);
    setError(null);

    fetchProjectById(id)
      .then((project) => {
        if (!active) return;
        const config = project.config || {};
        const nextType = config.contentType || "model";

        setName(project.name || "");
        setContentType(nextType);
        setMarkerImageUrl(config.markerImageUrl || "");
        setMindFileUrl(config.mindFileUrl || "");
        setContentUrl(config.contentUrl || "");
        setLabelText(config.labelText || "");
        setTransform(toInputTransform(config.transform, nextType));
        setVideoOptions(toInputVideoOptions(config.videoOptions));
        setLoadingScreen(toInputLoadingScreenOptions(config.loadingScreen));
        setTrackingOptions(toInputTrackingOptions(config.trackingOptions));
        setProjectSlug(project.slug || null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.response?.data?.message || "Failed to load project");
      })
      .finally(() => {
        if (active) setLoadingProject(false);
      });

    return () => {
      active = false;
    };
  }, [id, isEditing]);

  const handleTransformChange = (group, axis, value) => {
    setTransform((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [axis]: value
      }
    }));
  };

  const handleContentTypeChange = (nextType) => {
    setContentType(nextType);
    setTransform((prev) => {
      const isDefaultModelScale =
        prev.scale.x === "0.2" && prev.scale.y === "0.2" && prev.scale.z === "0.2";
      const isDefaultVideoScale =
        prev.scale.x === "1" && prev.scale.y === "1" && prev.scale.z === "1";

      if (nextType === "video" && isDefaultModelScale) {
        return {
          ...prev,
          scale: { x: "1", y: "1", z: "1" }
        };
      }

      if (nextType === "model" && isDefaultVideoScale) {
        return {
          ...prev,
          scale: { x: "0.2", y: "0.2", z: "0.2" }
        };
      }

      return prev;
    });
  };

  const handleVideoOptionChange = (key, value) => {
    setVideoOptions((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLoadingScreenChange = (key, value) => {
    setLoadingScreen((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTrackingOptionChange = (key, value) => {
    setTrackingOptions((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const uploadAsset = async (uploadFn, file, setUploading, onSuccess) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const { url } = await uploadFn(file);
      onSuccess(url);
    } catch (err) {
      setError(err.response?.data?.message || "Asset upload failed");
    } finally {
      setUploading(false);
    }
  };

  const generateMindFilename = (name = "marker") => {
    const base = name.replace(/\.[^/.]+$/, "") || "marker";
    return `${base}-${Date.now()}.mind`;
  };

  const handleGenerateMindFromMarker = async ({ file, markerUrl, silentError } = {}) => {
    const sourceUrl = markerUrl || markerImageUrl;
    if (!file && !sourceUrl) {
      setError("Provide a marker image first, then generate the .mind target file");
      return false;
    }

    setMindCompiling(true);
    setMindCompileProgress(0);
    setError(null);
    setSuccess(null);

    try {
      const compiledBlob = file
        ? await compileMindFileFromImageFile(file, (progress) => setMindCompileProgress(progress))
        : await compileMindFileFromImageUrl(sourceUrl, (progress) => setMindCompileProgress(progress));

      const compiledFileName = generateMindFilename(file?.name || "marker");
      const compiledFile = new File([compiledBlob], compiledFileName, {
        type: "application/octet-stream"
      });

      setMindUploading(true);
      const uploadResult = await uploadMarkerTarget(compiledFile);
      setMindFileUrl(uploadResult.url);
      setSuccess("Marker target (.mind) generated and attached automatically.");
      return true;
    } catch (err) {
      const fallbackMessage =
        "Automatic .mind generation failed. You can still upload a .mind file manually.";
      if (!silentError) {
        setError(
          err?.message?.includes("Failed to load marker image")
            ? "Could not read marker image for compilation. If using external URL, ensure it allows CORS."
            : err.response?.data?.message || fallbackMessage
        );
      }
      return false;
    } finally {
      setMindCompiling(false);
      setMindUploading(false);
      setMindCompileProgress(0);
    }
  };

  const handleMarkerImageUpload = async (file) => {
    if (!file) return;

    setMarkerUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const { url } = await uploadMarkerImage(file);
      setMarkerImageUrl(url);
      await handleGenerateMindFromMarker({ file, markerUrl: url, silentError: false });
    } catch (err) {
      setError(err.response?.data?.message || "Marker image upload failed");
    } finally {
      setMarkerUploading(false);
    }
  };

  const handleMindFileUpload = (file) =>
    uploadAsset(uploadMarkerTarget, file, setMindUploading, setMindFileUrl);

  const handleLoadingBackgroundUpload = (file) =>
    uploadAsset(uploadMarkerImage, file, setLoadingBackgroundUploading, (url) =>
      setLoadingScreen((prev) => ({
        ...prev,
        backgroundImageUrl: url
      }))
    );

  const handleContentUpload = (file) =>
    uploadAsset(
      contentType === "video" ? uploadVideo : uploadModel,
      file,
      setContentUploading,
      setContentUrl
    );

  const handleSave = async () => {
    if (!name || !markerImageUrl || !contentUrl) {
      setError("Project name, marker image, and content are required");
      return;
    }
    if (markerImageUrl.includes("/uploads/markers/") && !mindFileUrl) {
      setError("Please upload the matching .mind marker target file for uploaded markers");
      return;
    }

    const normalizedTransform = {
      position: {
        x: parseNumber(transform.position.x, 0),
        y: parseNumber(transform.position.y, 0),
        z: parseNumber(transform.position.z, 0)
      },
      rotation: {
        x: parseNumber(transform.rotation.x, 0),
        y: parseNumber(transform.rotation.y, 0),
        z: parseNumber(transform.rotation.z, 0)
      },
      scale: {
        x: parseNumber(transform.scale.x, contentType === "video" ? 1 : 0.2),
        y: parseNumber(transform.scale.y, contentType === "video" ? 1 : 0.2),
        z: parseNumber(transform.scale.z, contentType === "video" ? 1 : 0.2)
      }
    };

    if (
      normalizedTransform.scale.x <= 0 ||
      normalizedTransform.scale.y <= 0 ||
      normalizedTransform.scale.z <= 0
    ) {
      setError("Scale values must be greater than zero");
      return;
    }

    const normalizedVideoOptions = normalizeVideoOptions(videoOptions);
    const normalizedLoadingScreen = normalizeLoadingScreenOptions(loadingScreen);
    const normalizedTrackingOptions = normalizeTrackingOptions(trackingOptions);

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name,
        config: {
          markerImageUrl,
          mindFileUrl,
          contentType,
          contentUrl,
          labelText,
          transform: normalizedTransform,
          videoOptions: normalizedVideoOptions,
          loadingScreen: normalizedLoadingScreen,
          trackingOptions: normalizedTrackingOptions
        }
      };

      const project = isEditing ? await updateProject(id, payload) : await createProject(payload);

      setProjectSlug(project.slug);
      setSuccess(isEditing ? "Project updated successfully." : "Project published successfully.");

      if (!isEditing) {
        navigate(`/editor/${project.id}`, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  if (loadingProject) {
    return (
      <div className="editor-layout">
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div className="editor-layout">
      <div className="editor-hero">
        <div>
          <h1>{pageTitle}</h1>
          <p>Build interactive marker-based AR scenes with precise placement controls.</p>
        </div>
        <button className="ghost-btn" type="button" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
      <div className="editor-grid">
        <EditorCanvas
          markerImageUrl={markerImageUrl}
          contentType={contentType}
          contentUrl={contentUrl}
          labelText={labelText}
          transform={transform}
          videoOptions={videoOptions}
          onTransformChange={handleTransformChange}
          name={name}
        />
        <div className="editor-panel">
          <ProjectForm
            name={name}
            setName={setName}
            contentType={contentType}
            setContentType={handleContentTypeChange}
            markerImageUrl={markerImageUrl}
            setMarkerImageUrl={setMarkerImageUrl}
            mindFileUrl={mindFileUrl}
            setMindFileUrl={setMindFileUrl}
            contentUrl={contentUrl}
            setContentUrl={setContentUrl}
            labelText={labelText}
            setLabelText={setLabelText}
            onMarkerImageUpload={handleMarkerImageUpload}
            onMindFileUpload={handleMindFileUpload}
            onLoadingBackgroundUpload={handleLoadingBackgroundUpload}
            onContentUpload={handleContentUpload}
            markerUploading={markerUploading}
            mindUploading={mindUploading}
            mindCompiling={mindCompiling}
            mindCompileProgress={mindCompileProgress}
            loadingBackgroundUploading={loadingBackgroundUploading}
            contentUploading={contentUploading}
            transform={transform}
            onTransformChange={handleTransformChange}
            videoOptions={videoOptions}
            onVideoOptionChange={handleVideoOptionChange}
            loadingScreen={loadingScreen}
            onLoadingScreenChange={handleLoadingScreenChange}
            trackingOptions={trackingOptions}
            onTrackingOptionChange={handleTrackingOptionChange}
            onGenerateMindFromMarker={() => handleGenerateMindFromMarker()}
            onSave={handleSave}
            saving={saving}
          />
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="success-note">{success}</div>}
          {projectSlug && (
            <div className="publish-callout">
              <p>Viewer URL</p>
              <a href={`${window.location.origin}/v/${projectSlug}`} target="_blank" rel="noreferrer">
                {window.location.origin}/v/{projectSlug}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
