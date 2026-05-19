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

const Editor = () => {
  const [name, setName] = useState("");
  const [contentType, setContentType] = useState("model");
  const [markerImageUrl, setMarkerImageUrl] = useState("");
  const [mindFileUrl, setMindFileUrl] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [labelText, setLabelText] = useState("");
  const [slug, setSlug] = useState(null);
  const [saving, setSaving] = useState(false);
  const [markerUploading, setMarkerUploading] = useState(false);
  const [mindUploading, setMindUploading] = useState(false);
  const [contentUploading, setContentUploading] = useState(false);
  const [error, setError] = useState(null);

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
          labelText
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
            setContentType={setContentType}
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
