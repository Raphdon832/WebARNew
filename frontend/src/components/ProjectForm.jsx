import React from "react";
import AssetUploader from "./AssetUploader";

const ProjectForm = ({
  name,
  setName,
  contentType,
  setContentType,
  markerImageUrl,
  setMarkerImageUrl,
  mindFileUrl,
  setMindFileUrl,
  contentUrl,
  setContentUrl,
  labelText,
  setLabelText,
  onMarkerImageUpload,
  onMindFileUpload,
  onContentUpload,
  markerUploading,
  mindUploading,
  contentUploading,
  onSave,
  saving
}) => (
  <div style={{ width: "100%", maxWidth: 480 }}>
    <AssetUploader
      label="Project Name"
      placeholder="Hologram postcard"
      value={name}
      onChange={setName}
    />
    <AssetUploader
      label="Marker Image URL (.png / .jpg / .jpeg)"
      placeholder="https://cdn.example.com/marker.jpg"
      value={markerImageUrl}
      onChange={setMarkerImageUrl}
    />
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)" }}>
        Upload Marker Image
      </span>
      <input
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        onChange={(e) => onMarkerImageUpload(e.target.files?.[0])}
      />
      {markerUploading && (
        <small style={{ display: "block", marginTop: 6 }}>Uploading marker image...</small>
      )}
    </label>

    <AssetUploader
      label="Marker Target URL (.mind)"
      placeholder="https://cdn.example.com/marker.mind"
      value={mindFileUrl}
      onChange={setMindFileUrl}
    />
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)" }}>
        Upload Marker Target (.mind)
      </span>
      <input type="file" accept=".mind,application/octet-stream" onChange={(e) => onMindFileUpload(e.target.files?.[0])} />
      <small style={{ display: "block", marginTop: 6, color: "rgba(255,255,255,0.65)" }}>
        MindAR needs the generated .mind target file that matches your marker image.
      </small>
      {mindUploading && (
        <small style={{ display: "block", marginTop: 6 }}>Uploading marker target...</small>
      )}
    </label>

    <div style={{ marginBottom: 16 }}>
      <span style={{ display: "block", marginBottom: 8, color: "rgba(255,255,255,0.7)" }}>
        Result Type
      </span>
      <label style={{ marginRight: 14 }}>
        <input
          type="radio"
          name="contentType"
          value="model"
          checked={contentType === "model"}
          onChange={(e) => setContentType(e.target.value)}
        />{" "}
        3D Model
      </label>
      <label>
        <input
          type="radio"
          name="contentType"
          value="video"
          checked={contentType === "video"}
          onChange={(e) => setContentType(e.target.value)}
        />{" "}
        Video
      </label>
    </div>

    <AssetUploader
      label={
        contentType === "video"
          ? "Video URL (.mp4 / .webm / .ogg / .mov)"
          : "3D Model URL (.glb / .gltf)"
      }
      placeholder={
        contentType === "video"
          ? "https://cdn.example.com/overlay.mp4"
          : "https://cdn.example.com/model.glb"
      }
      value={contentUrl}
      onChange={setContentUrl}
    />
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)" }}>
        Upload {contentType === "video" ? "Video" : "3D Model"}
      </span>
      <input
        type="file"
        accept={contentType === "video" ? ".mp4,.webm,.ogg,.mov,video/*" : ".glb,.gltf,model/gltf-binary,model/gltf+json"}
        onChange={(e) => onContentUpload(e.target.files?.[0])}
      />
      {contentUploading && (
        <small style={{ display: "block", marginTop: 6 }}>
          Uploading {contentType === "video" ? "video" : "model"}...
        </small>
      )}
    </label>
    <AssetUploader
      label="Label Text"
      placeholder="Tap to explore"
      value={labelText}
      onChange={setLabelText}
    />

    <button
      style={{
        width: "100%",
        padding: "14px 16px",
        borderRadius: 10,
        border: "none",
        background: "linear-gradient(135deg,#4e9cff,#8b5dff)",
        color: "#fff",
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
        marginTop: 8
      }}
      onClick={onSave}
      disabled={saving || markerUploading || mindUploading || contentUploading}
    >
      {saving ? "Publishing..." : "Save & Publish"}
    </button>
  </div>
);

export default ProjectForm;
