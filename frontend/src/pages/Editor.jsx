import React, { useState } from "react";
import EditorCanvas from "../components/EditorCanvas";
import ProjectForm from "../components/ProjectForm";
import { createProject } from "../api/projects";
import {
  uploadMarkerImage,
  uploadMarkerTarget,
  uploadModel,
  uploadVideo
} from "../api/uploads";

const defaultTransform = {
  position: { x: "0", y: "0", z: "0" },
  rotation: { x: "0", y: "0", z: "0" },
  scale: { x: "0.2", y: "0.2", z: "0.2" }
};

const parseNumber = (value, fallback) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const Editor = () => {
  const [name, setName] = useState("");
  const [contentType, setContentType] = useState("model");
  const [markerImageUrl, setMarkerImageUrl] = useState("");
  const [mindFileUrl, setMindFileUrl] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [labelText, setLabelText] = useState("");
  const [transform, setTransform] = useState(defaultTransform);
  const [slug, setSlug] = useState(null);
  const [saving, setSaving] = useState(false);
  const [markerUploading, setMarkerUploading] = useState(false);
  const [mindUploading, setMindUploading] = useState(false);
  const [contentUploading, setContentUploading] = useState(false);
  const [error, setError] = useState(null);

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

  const uploadAsset = async (uploadFn, file, setUploading, onSuccess) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadFn(file);
      onSuccess(url);
    } catch (err) {
      setError(err.response?.data?.message || "Asset upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleMarkerImageUpload = (file) =>
    uploadAsset(uploadMarkerImage, file, setMarkerUploading, setMarkerImageUrl);

  const handleMindFileUpload = (file) =>
    uploadAsset(uploadMarkerTarget, file, setMindUploading, setMindFileUrl);

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
        x: parseNumber(transform.scale.x, 1),
        y: parseNumber(transform.scale.y, 1),
        z: parseNumber(transform.scale.z, 1)
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

    setSaving(true);
    setError(null);
    try {
      const project = await createProject({
        name,
        config: {
          markerImageUrl,
          mindFileUrl,
          contentType,
          contentUrl,
          labelText,
          transform: normalizedTransform
        }
      });
      setSlug(project.slug);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="editor-layout">
      <div>
        <h1>Editor</h1>
        <p>Upload assets, configure AR behavior, and publish instantly.</p>
      </div>
      <div className="editor-grid">
        <EditorCanvas />
        <div>
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
            onContentUpload={handleContentUpload}
            markerUploading={markerUploading}
            mindUploading={mindUploading}
            contentUploading={contentUploading}
            transform={transform}
            onTransformChange={handleTransformChange}
            onSave={handleSave}
            saving={saving}
          />
          {error && <div className="auth-error">{error}</div>}
          {slug && (
            <div className="publish-callout">
              <p>Published!</p>
              <a href={`${window.location.origin}/v/${slug}`} target="_blank" rel="noreferrer">
                {window.location.origin}/v/{slug}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
