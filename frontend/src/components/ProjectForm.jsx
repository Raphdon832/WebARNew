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
  onLoadingBackgroundUpload,
  onContentUpload,
  markerUploading,
  mindUploading,
  mindCompiling,
  mindCompileProgress,
  loadingBackgroundUploading,
  contentUploading,
  transform,
  onTransformChange,
  videoOptions = {},
  onVideoOptionChange,
  loadingScreen = {},
  onLoadingScreenChange,
  trackingOptions = {},
  onTrackingOptionChange,
  onGenerateMindFromMarker,
  onSave,
  saving
}) => {
  const vectorInputStyle = {
    width: "100%",
    padding: "10px 8px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(8,14,32,0.6)",
    color: "#fff"
  };

  const vectorGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
    marginTop: 8
  };

  const booleanGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
    marginTop: 8
  };

  const optionCardStyle = {
    marginBottom: 16,
    padding: 12,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.02)"
  };

  const renderVectorInputs = (label, group, step = "0.01") => (
    <div style={{ marginBottom: 14 }}>
      <span style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)" }}>
        {label}
      </span>
      <div style={vectorGridStyle}>
        {["x", "y", "z"].map((axis) => (
          <label key={`${group}-${axis}`} style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            {axis.toUpperCase()}
            <input
              type="number"
              step={step}
              style={vectorInputStyle}
              value={transform[group][axis]}
              onChange={(e) => onTransformChange(group, axis, e.target.value)}
            />
          </label>
        ))}
      </div>
    </div>
  );

  const renderVideoToggle = (key, label) => (
    <label
      key={key}
      style={{
        fontSize: 13,
        color: "rgba(255,255,255,0.85)",
        display: "flex",
        gap: 8,
        alignItems: "center",
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "8px 10px",
        borderRadius: 8,
        background: "rgba(4,10,24,0.45)"
      }}
    >
      <input
        type="checkbox"
        checked={Boolean(videoOptions?.[key])}
        onChange={(e) => onVideoOptionChange(key, e.target.checked)}
      />
      {label}
    </label>
  );

  const renderTrackingInput = ({ key, label, min, max, step, hint }) => (
    <label key={key} style={{ display: "block", marginBottom: 12, fontSize: 13 }}>
      <span style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.72)" }}>
        {label}
      </span>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        style={vectorInputStyle}
        value={trackingOptions?.[key] ?? ""}
        onChange={(e) => onTrackingOptionChange(key, e.target.value)}
      />
      {hint && (
        <small style={{ display: "block", marginTop: 5, color: "rgba(255,255,255,0.56)" }}>
          {hint}
        </small>
      )}
    </label>
  );

  return (
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
        <input
          type="file"
          accept=".mind,application/octet-stream"
          onChange={(e) => onMindFileUpload(e.target.files?.[0])}
        />
        <small style={{ display: "block", marginTop: 6, color: "rgba(255,255,255,0.65)" }}>
          MindAR needs the generated .mind target file that matches your marker image.
        </small>
        <button
          type="button"
          onClick={onGenerateMindFromMarker}
          disabled={markerUploading || mindUploading || mindCompiling}
          style={{
            marginTop: 10,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(120,216,255,0.45)",
            background: "rgba(24,122,174,0.18)",
            color: "#d7f2ff",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 13
          }}
        >
          {mindCompiling ? "Generating .mind..." : "Generate .mind From Marker Image"}
        </button>
        {mindCompiling && (
          <small style={{ display: "block", marginTop: 6, color: "rgba(255,255,255,0.72)" }}>
            Compiling marker target: {Math.round(mindCompileProgress || 0)}%
          </small>
        )}
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
          accept={
            contentType === "video"
              ? ".mp4,.webm,.ogg,.mov,video/*"
              : ".glb,.gltf,model/gltf-binary,model/gltf+json"
          }
          onChange={(e) => onContentUpload(e.target.files?.[0])}
        />
        {contentUploading && (
          <small style={{ display: "block", marginTop: 6 }}>
            Uploading {contentType === "video" ? "video" : "model"}...
          </small>
        )}
      </label>

      <div style={optionCardStyle}>
        <h3 style={{ margin: "0 0 10px", fontSize: 15 }}>
          {contentType === "video" ? "Video Placement" : "Object Placement"}
        </h3>
        <small style={{ display: "block", marginBottom: 10, color: "rgba(255,255,255,0.65)" }}>
          Video keeps its native aspect ratio automatically. Use position, rotation, and scale to
          place it on the marker.
        </small>
        {renderVectorInputs("Position (meters)", "position")}
        {renderVectorInputs("Rotation (degrees)", "rotation", "1")}
        {renderVectorInputs("Scale", "scale")}
      </div>

      {contentType === "video" && (
        <div style={optionCardStyle}>
          <h3 style={{ margin: "0 0 10px", fontSize: 15 }}>Video Playback & Display</h3>
          <small style={{ display: "block", marginBottom: 10, color: "rgba(255,255,255,0.65)" }}>
            These options apply in both editor preview and published AR viewer.
          </small>

          <div style={booleanGridStyle}>
            {renderVideoToggle("autoplay", "Autoplay")}
            {renderVideoToggle("loop", "Loop")}
            {renderVideoToggle("muted", "Muted")}
            {renderVideoToggle("playsInline", "Play Inline")}
            {renderVideoToggle("showControls", "Show Controls")}
            {renderVideoToggle("maintainAspectRatio", "Maintain Aspect Ratio")}
            {renderVideoToggle("invertAspectRatio", "Invert Aspect Ratio")}
            {renderVideoToggle("flipHorizontal", "Flip Horizontal")}
            {renderVideoToggle("flipVertical", "Flip Vertical")}
            {renderVideoToggle("pauseWhenTargetLost", "Pause On Target Lost")}
            {renderVideoToggle("restartOnTargetFound", "Restart On Target Found")}
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={{ display: "block", marginBottom: 10, fontSize: 13 }}>
              <span style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.72)" }}>
                Fit Mode
              </span>
              <select
                value={videoOptions.fit}
                style={vectorInputStyle}
                onChange={(e) => onVideoOptionChange("fit", e.target.value)}
              >
                <option value="contain">Contain (recommended)</option>
                <option value="cover">Cover</option>
                <option value="fill">Fill</option>
              </select>
            </label>

            <div style={vectorGridStyle}>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                Opacity (0 - 1)
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  style={vectorInputStyle}
                  value={videoOptions.opacity}
                  onChange={(e) => onVideoOptionChange("opacity", e.target.value)}
                />
              </label>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                Playback Rate
                <input
                  type="number"
                  min="0.25"
                  max="3"
                  step="0.05"
                  style={vectorInputStyle}
                  value={videoOptions.playbackRate}
                  onChange={(e) => onVideoOptionChange("playbackRate", e.target.value)}
                />
              </label>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                Start Time (sec)
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  style={vectorInputStyle}
                  value={videoOptions.startTimeSec}
                  onChange={(e) => onVideoOptionChange("startTimeSec", e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>
      )}

      <div style={optionCardStyle}>
        <h3 style={{ margin: "0 0 10px", fontSize: 15 }}>Tracking Stability</h3>
        <small style={{ display: "block", marginBottom: 12, color: "rgba(255,255,255,0.65)" }}>
          Stabilizes marker pose jitter in the published viewer. Lower beta is steadier; higher beta
          reacts faster but can shake more.
        </small>
        <div style={vectorGridStyle}>
          {renderTrackingInput({
            key: "filterMinCF",
            label: "Min Cutoff",
            min: "0.0001",
            max: "1",
            step: "0.0001",
            hint: "Keep low for smoother still shots."
          })}
          {renderTrackingInput({
            key: "filterBeta",
            label: "Motion Beta",
            min: "0",
            max: "1000",
            step: "1",
            hint: "8 is stable; 20+ responds faster."
          })}
          {renderTrackingInput({
            key: "missTolerance",
            label: "Miss Frames",
            min: "1",
            max: "30",
            step: "1",
            hint: "Higher reduces flicker when tracking briefly drops."
          })}
        </div>
        <div style={{ marginTop: 2 }}>
          {renderTrackingInput({
            key: "warmupTolerance",
            label: "Warmup Frames",
            min: "1",
            max: "30",
            step: "1",
            hint: "Higher waits for a steadier lock before showing content."
          })}
        </div>
      </div>

      <div style={optionCardStyle}>
        <h3 style={{ margin: "0 0 10px", fontSize: 15 }}>Loading Screen</h3>
        <small style={{ display: "block", marginBottom: 10, color: "rgba(255,255,255,0.65)" }}>
          Customize the pre-AR experience overlay shown before the camera session starts.
        </small>

        <AssetUploader
          label="Loading Background Image URL"
          placeholder="https://cdn.example.com/loading-background.jpg"
          value={loadingScreen.backgroundImageUrl || ""}
          onChange={(value) => onLoadingScreenChange("backgroundImageUrl", value)}
        />

        <label style={{ display: "block", marginBottom: 12 }}>
          <span style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.7)" }}>
            Upload Loading Background Image
          </span>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
            onChange={(e) => onLoadingBackgroundUpload(e.target.files?.[0])}
          />
          {loadingBackgroundUploading && (
            <small style={{ display: "block", marginTop: 6 }}>
              Uploading loading background image...
            </small>
          )}
        </label>

        <label
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.85)",
            display: "flex",
            gap: 8,
            alignItems: "center"
          }}
        >
          <input
            type="checkbox"
            checked={Boolean(loadingScreen.showStartButton)}
            onChange={(e) => onLoadingScreenChange("showStartButton", e.target.checked)}
          />
          Show custom start button before AR starts
        </label>

        {loadingScreen.showStartButton && (
          <AssetUploader
            label="Start Button Text"
            placeholder="Play"
            value={loadingScreen.startButtonText || "Play"}
            onChange={(value) => onLoadingScreenChange("startButtonText", value)}
          />
        )}
      </div>

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
        disabled={
          saving ||
          markerUploading ||
          mindUploading ||
          mindCompiling ||
          loadingBackgroundUploading ||
          contentUploading
        }
      >
        {saving ? "Publishing..." : "Save & Publish"}
      </button>
    </div>
  );
};

export default ProjectForm;
