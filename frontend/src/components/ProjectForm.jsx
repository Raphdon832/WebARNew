import React, { useState } from "react";
import AssetUploader from "./AssetUploader";

const AccordionSection = ({ title, helper, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      style={{
        marginBottom: 12,
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.02)",
        overflow: "hidden"
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: "100%",
          border: "none",
          background: "rgba(4,10,24,0.35)",
          color: "#fff",
          padding: "12px 14px",
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 12,
          alignItems: "center",
          textAlign: "left"
        }}
      >
        <span>
          <strong style={{ display: "block", fontSize: 15 }}>{title}</strong>
          {helper && (
            <small
              style={{
                display: "block",
                marginTop: 3,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.35
              }}
            >
              {helper}
            </small>
          )}
        </span>
        <span
          aria-hidden="true"
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.18)",
            display: "grid",
            placeItems: "center",
            fontSize: 18,
            lineHeight: 1,
            color: "rgba(255,255,255,0.82)",
            background: "rgba(255,255,255,0.04)"
          }}
        >
          {open ? "-" : "+"}
        </span>
      </button>
      {open && <div style={{ padding: 12 }}>{children}</div>}
    </section>
  );
};

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
  markerQualityChecking,
  markerQuality,
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
  onGenerateEighthWallTarget,
  eighthWallGenerating,
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

  const renderTrackingTextInput = ({ key, label, placeholder, hint }) => (
    <label key={key} style={{ display: "block", marginBottom: 12, fontSize: 13 }}>
      <span style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.72)" }}>
        {label}
      </span>
      <input
        type="text"
        placeholder={placeholder}
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

  const markerQualityColor =
    markerQuality?.score === null || markerQuality?.score === undefined
      ? "#9fb4d8"
      : markerQuality.score >= 68
        ? "#6ff0a8"
        : markerQuality.score >= 52
          ? "#ffd166"
          : "#ff8c8c";
  const selectedArEngine = trackingOptions?.arEngine === "8thwall" ? "8thwall" : "mindar";

  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <AccordionSection
        title="Project Basics"
        helper="Name the project and attach the marker image."
        defaultOpen
      >
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
          {markerQualityChecking && (
            <small style={{ display: "block", marginTop: 6, color: "rgba(255,255,255,0.72)" }}>
              Checking marker tracking quality...
            </small>
          )}
        </label>

        {markerQuality && (
          <div
            style={{
              margin: "-6px 0 16px",
              padding: 12,
              borderRadius: 10,
              border: `1px solid ${markerQualityColor}`,
              background: "rgba(5,12,28,0.68)"
            }}
          >
            <strong style={{ display: "block", color: markerQualityColor, marginBottom: 6 }}>
              Marker Quality: {markerQuality.rating}
              {Number.isFinite(markerQuality.score) ? ` (${markerQuality.score}/100)` : ""}
            </strong>
            {markerQuality.dimensions && (
              <small style={{ display: "block", color: "rgba(255,255,255,0.65)", marginBottom: 6 }}>
                {markerQuality.dimensions.width} x {markerQuality.dimensions.height}px
              </small>
            )}
            <small style={{ display: "block", color: "rgba(255,255,255,0.72)" }}>
              {markerQuality.summary}
            </small>
            {markerQuality.issues?.length > 0 && (
              <div style={{ display: "grid", gap: 4, marginTop: 8 }}>
                {markerQuality.issues.map((issue) => (
                  <small key={issue} style={{ color: "rgba(255,255,255,0.68)" }}>
                    - {issue}
                  </small>
                ))}
              </div>
            )}
          </div>
        )}
      </AccordionSection>

      <AccordionSection
        title="Marker Target"
        helper="Attach or generate the .mind target file used for MindAR tracking."
      >
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
      </AccordionSection>

      <AccordionSection title="AR Content" helper="Choose the asset type and upload the result shown on the marker.">
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
      </AccordionSection>

      <AccordionSection
        title={contentType === "video" ? "Video Placement" : "Object Placement"}
        helper="Use position, rotation, and scale to place the result on the marker."
      >
        {renderVectorInputs("Position (meters)", "position")}
        {renderVectorInputs("Rotation (degrees)", "rotation", "1")}
        {renderVectorInputs("Scale", "scale")}
      </AccordionSection>

      {contentType === "video" && (
        <AccordionSection
          title="Video Playback & CTA"
          helper="Playback, display, and post-playback CTA settings for the viewer."
        >
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

          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 8,
              border: "1px solid rgba(127,207,194,0.22)",
              background: "rgba(127,207,194,0.06)"
            }}
          >
            {renderVideoToggle("ctaEnabled", "Show CTA After Playback")}
            {videoOptions.ctaEnabled && (
              <div style={{ marginTop: 12 }}>
                <AssetUploader
                  label="CTA Button Text"
                  placeholder="Learn More"
                  value={videoOptions.ctaLabel || ""}
                  onChange={(value) => onVideoOptionChange("ctaLabel", value)}
                />
                <AssetUploader
                  label="CTA Link URL"
                  placeholder="https://example.com"
                  value={videoOptions.ctaUrl || ""}
                  onChange={(value) => onVideoOptionChange("ctaUrl", value)}
                />
                <label style={{ display: "block", marginBottom: 10, fontSize: 13 }}>
                  <span
                    style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.72)" }}
                  >
                    Show After Completed Plays
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    step="1"
                    style={vectorInputStyle}
                    value={videoOptions.ctaShowAfterPlays}
                    onChange={(e) => onVideoOptionChange("ctaShowAfterPlays", e.target.value)}
                  />
                </label>
                <small
                  style={{
                    display: "block",
                    color: "rgba(255,255,255,0.62)",
                    lineHeight: 1.45
                  }}
                >
                  The CTA appears after this threshold and the video keeps following the loop
                  setting above.
                </small>
              </div>
            )}
          </div>
        </AccordionSection>
      )}

      <AccordionSection
        title="AR Engine & Tracking"
        helper="Runtime, smoothing, camera, and advanced target settings."
      >
        <label style={{ display: "block", marginBottom: 12, fontSize: 13 }}>
          <span style={{ display: "block", marginBottom: 6, color: "rgba(255,255,255,0.72)" }}>
            AR Runtime
          </span>
          <select
            value={selectedArEngine}
            style={vectorInputStyle}
            onChange={(e) => onTrackingOptionChange("arEngine", e.target.value)}
          >
            <option value="mindar">MindAR (production)</option>
            <option value="8thwall">8th Wall (experimental)</option>
          </select>
        </label>

        {selectedArEngine === "8thwall" && (
          <div
            style={{
              marginBottom: 14,
              padding: 10,
              borderRadius: 8,
              border: "1px solid rgba(255,209,102,0.42)",
              background: "rgba(255,209,102,0.08)"
            }}
          >
            <small style={{ color: "rgba(255,245,210,0.86)" }}>
              Generate an 8th Wall Image Target JSON from the marker image before publishing this
              runtime. The viewer uses this JSON instead of a .mind file.
            </small>
            <div style={{ marginTop: 10 }}>
              {renderTrackingTextInput({
                key: "eighthWallTargetName",
                label: "8th Wall Target Name",
                placeholder: "webar-marker",
                hint: "Must match the name inside the 8th Wall target JSON."
              })}
              {renderTrackingTextInput({
                key: "eighthWallTargetUrl",
                label: "8th Wall Target JSON URL",
                placeholder: "https://cdn.example.com/image-target.json",
                hint: "Generated automatically from the marker image for 8th Wall tracking."
              })}
              {renderTrackingInput({
                key: "eighthWallRotationCorrectionZ",
                label: "8th Wall Rotation Fix",
                min: "-360",
                max: "360",
                step: "1",
                hint: "-90 fixes the default 8th Wall image-target plane orientation."
              })}
              <button
                type="button"
                onClick={onGenerateEighthWallTarget}
                disabled={eighthWallGenerating || markerUploading}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,209,102,0.55)",
                  background: "rgba(255,209,102,0.14)",
                  color: "#ffe7a3",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13
                }}
              >
                {eighthWallGenerating
                  ? "Generating 8th Wall Target..."
                  : "Generate 8th Wall Target"}
              </button>
            </div>
          </div>
        )}

        <small style={{ display: "block", marginBottom: 12, color: "rgba(255,255,255,0.65)" }}>
          Stabilizes marker pose jitter in the published viewer. Higher smoothing is steadier but
          adds more visual lag.
        </small>
        <div style={booleanGridStyle}>
          <label
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
              checked={trackingOptions?.poseSmoothingEnabled !== false}
              onChange={(e) => onTrackingOptionChange("poseSmoothingEnabled", e.target.checked)}
            />
            Pose Smoothing
          </label>
        </div>
        <div style={vectorGridStyle}>
          {renderTrackingInput({
            key: "poseSmoothingAmount",
            label: "Smooth Amount",
            min: "0",
            max: "0.95",
            step: "0.01",
            hint: "0.72 is steady; lower tracks faster."
          })}
          {renderTrackingInput({
            key: "poseSmoothingDeadband",
            label: "Position Deadband",
            min: "0",
            max: "0.05",
            step: "0.0005",
            hint: "Freezes tiny position changes."
          })}
          {renderTrackingInput({
            key: "poseRotationDeadband",
            label: "Rotation Deadband",
            min: "0",
            max: "5",
            step: "0.05",
            hint: "Degrees ignored before smoothing."
          })}
        </div>
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
            hint: "4 is steadier; 12+ responds faster."
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
        <div style={vectorGridStyle}>
          {renderTrackingInput({
            key: "cameraWidth",
            label: "Camera Width",
            min: "640",
            max: "2560",
            step: "1",
            hint: "1920 improves detail when the device can sustain it."
          })}
          {renderTrackingInput({
            key: "cameraHeight",
            label: "Camera Height",
            min: "360",
            max: "1440",
            step: "1",
            hint: "1080 pairs with 1920 width."
          })}
          {renderTrackingInput({
            key: "cameraFrameRate",
            label: "Camera FPS",
            min: "15",
            max: "60",
            step: "1",
            hint: "30 is the most stable default."
          })}
        </div>
      </AccordionSection>

      <AccordionSection
        title="Loading Screen"
        helper="Customize the pre-AR experience before the camera starts."
      >
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
          Show custom launch button before AR starts
        </label>

        {loadingScreen.showStartButton && (
          <AssetUploader
            label="Launch Button Text"
            placeholder="Launch"
            value={loadingScreen.startButtonText || "Launch"}
            onChange={(value) => onLoadingScreenChange("startButtonText", value)}
          />
        )}

        <AssetUploader
          label="Camera Instruction Text"
          placeholder="Point the camera to the image"
          value={loadingScreen.scanInstructionText || ""}
          onChange={(value) => onLoadingScreenChange("scanInstructionText", value)}
        />

        <label
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.85)",
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginTop: 12
          }}
        >
          <input
            type="checkbox"
            checked={Boolean(loadingScreen.showScanAnimation)}
            onChange={(e) => onLoadingScreenChange("showScanAnimation", e.target.checked)}
          />
          Show scan animation over camera
        </label>
      </AccordionSection>

      <AccordionSection title="Publish" helper="Add optional viewer text and save the experience.">
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
            eighthWallGenerating ||
            loadingBackgroundUploading ||
            contentUploading
          }
        >
          {saving ? "Publishing..." : "Save & Publish"}
        </button>
      </AccordionSection>
    </div>
  );
};

export default ProjectForm;
