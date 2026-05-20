import React, { useEffect, useMemo, useRef, useState } from "react";

const frameStyle = {
  position: "relative",
  width: "100%",
  aspectRatio: "16 / 10",
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.15)",
  overflow: "hidden",
  background:
    "radial-gradient(120% 100% at 50% 0%, rgba(0,195,255,0.2), rgba(0,0,0,0.9) 60%, #000)"
};

const readNumber = (value, fallback) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toInputNumber = (value, precision = 3) => {
  const rounded = Number.parseFloat(Number(value).toFixed(precision));
  if (!Number.isFinite(rounded) || Math.abs(rounded) < 0.000001) return "0";
  return String(rounded);
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeUrl = (url) => {
  if (!url) return "";
  if (window.location.protocol !== "https:") return url;
  if (url.startsWith("http://")) return `https://${url.slice("http://".length)}`;
  return url;
};

const EditorCanvas = ({
  markerImageUrl,
  contentType,
  contentUrl,
  labelText,
  transform,
  videoOptions,
  onTransformChange,
  name
}) => {
  const pxPerMeter = 180;
  const previewAreaRef = useRef(null);
  const gizmoTargetRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const activeGestureRef = useRef(null);
  const [gizmoMode, setGizmoMode] = useState("move");
  const [previewMuted, setPreviewMuted] = useState(true);
  const [markerAspectRatio, setMarkerAspectRatio] = useState(1);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9);
  const [previewAreaSize, setPreviewAreaSize] = useState({ width: 0, height: 0 });

  const positionX = readNumber(transform?.position?.x, 0);
  const positionY = readNumber(transform?.position?.y, 0);
  const positionZ = readNumber(transform?.position?.z, 0);
  const rotationX = readNumber(transform?.rotation?.x, 0);
  const rotationY = readNumber(transform?.rotation?.y, 0);
  const rotationZ = readNumber(transform?.rotation?.z, 0);
  const scaleX = clamp(readNumber(transform?.scale?.x, contentType === "video" ? 1 : 0.2), 0.01, 20);
  const scaleY = clamp(readNumber(transform?.scale?.y, contentType === "video" ? 1 : 0.2), 0.01, 20);
  const scaleZ = clamp(readNumber(transform?.scale?.z, contentType === "video" ? 1 : 0.2), 0.01, 20);

  const layerTransform = [
    `translate(${positionX * pxPerMeter}px, ${-positionY * pxPerMeter}px)`,
    `rotateX(${rotationX}deg)`,
    `rotateY(${rotationY}deg)`,
    `rotateZ(${rotationZ}deg)`,
    `scale3d(${scaleX}, ${scaleY}, ${scaleZ})`,
    `translateZ(${positionZ * 140}px)`
  ].join(" ");

  const normalizedMarkerUrl = normalizeUrl(markerImageUrl);
  const normalizedContentUrl = normalizeUrl(contentUrl);
  const hasVideoPreview = contentType === "video" && Boolean(normalizedContentUrl);
  const hasModelPreview = contentType === "model" && Boolean(normalizedContentUrl);
  const fitMode =
    videoOptions?.fit === "cover" || videoOptions?.fit === "fill" ? videoOptions.fit : "contain";
  const previewOpacity = clamp(readNumber(videoOptions?.opacity, 1), 0, 1);
  const playbackRate = clamp(readNumber(videoOptions?.playbackRate, 1), 0.25, 3);
  const startTimeSec = Math.max(0, readNumber(videoOptions?.startTimeSec, 0));
  const maintainAspect = videoOptions?.maintainAspectRatio !== false;
  const invertedAspect = Boolean(videoOptions?.invertAspectRatio);
  const flipScaleX = videoOptions?.flipHorizontal ? -1 : 1;
  const flipScaleY = videoOptions?.flipVertical ? -1 : 1;

  useEffect(() => {
    if (!normalizedMarkerUrl) {
      setMarkerAspectRatio(1);
      return;
    }

    const img = new Image();
    img.onload = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;
      const ratio = img.naturalWidth / img.naturalHeight;
      if (Number.isFinite(ratio) && ratio > 0) {
        setMarkerAspectRatio(ratio);
      }
    };
    img.src = normalizedMarkerUrl;
  }, [normalizedMarkerUrl]);

  useEffect(() => {
    const previewAreaEl = previewAreaRef.current;
    if (!previewAreaEl) return;

    const updateSize = () => {
      const rect = previewAreaEl.getBoundingClientRect();
      setPreviewAreaSize({ width: rect.width, height: rect.height });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }

    const observer = new ResizeObserver(() => updateSize());
    observer.observe(previewAreaEl);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasVideoPreview) return;
    const videoEl = videoPreviewRef.current;
    if (!videoEl) return;

    const onLoadedMeta = () => {
      if (!videoEl.videoWidth || !videoEl.videoHeight) return;
      const ratio = videoEl.videoWidth / videoEl.videoHeight;
      if (Number.isFinite(ratio) && ratio > 0) {
        setVideoAspectRatio(ratio);
      }

      if (startTimeSec > 0 && Number.isFinite(videoEl.duration) && startTimeSec < videoEl.duration) {
        videoEl.currentTime = startTimeSec;
      }
    };

    videoEl.addEventListener("loadedmetadata", onLoadedMeta);
    onLoadedMeta();
    return () => videoEl.removeEventListener("loadedmetadata", onLoadedMeta);
  }, [hasVideoPreview, startTimeSec, normalizedContentUrl]);

  useEffect(() => {
    if (!hasVideoPreview) return;
    const videoEl = videoPreviewRef.current;
    if (!videoEl) return;

    videoEl.playbackRate = playbackRate;
    videoEl.muted = previewMuted;
    videoEl.defaultMuted = previewMuted;
    if (videoOptions?.autoplay) {
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  }, [hasVideoPreview, playbackRate, videoOptions?.autoplay, previewMuted]);

  const markerRenderSize = useMemo(() => {
    const width = previewAreaSize.width;
    const height = previewAreaSize.height;
    if (!width || !height) return { width: 0, height: 0 };

    const areaRatio = width / height;
    if (areaRatio > markerAspectRatio) {
      const fittedHeight = height;
      return {
        width: fittedHeight * markerAspectRatio,
        height: fittedHeight
      };
    }

    const fittedWidth = width;
    return {
      width: fittedWidth,
      height: fittedWidth / markerAspectRatio
    };
  }, [previewAreaSize, markerAspectRatio]);

  const videoPlane = useMemo(() => {
    const base = 240;
    if (!maintainAspect) return { width: base, height: base };

    let ratio = videoAspectRatio || 16 / 9;
    if (invertedAspect && ratio > 0) ratio = 1 / ratio;

    if (ratio >= 1) {
      return { width: base, height: base / ratio };
    }
    return { width: base * ratio, height: base };
  }, [maintainAspect, videoAspectRatio, invertedAspect]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const gesture = activeGestureRef.current;
      if (!gesture || !onTransformChange) return;

      if (gesture.type === "move") {
        const nextPositionX = gesture.startPosition.x + (event.clientX - gesture.startClientX) / pxPerMeter;
        const nextPositionY = gesture.startPosition.y - (event.clientY - gesture.startClientY) / pxPerMeter;

        onTransformChange("position", "x", toInputNumber(nextPositionX));
        onTransformChange("position", "y", toInputNumber(nextPositionY));
      }

      if (gesture.type === "scale") {
        const dx = event.clientX - gesture.centerX;
        const dy = event.clientY - gesture.centerY;
        const distance = Math.hypot(dx, dy);
        const factor = clamp(distance / gesture.startDistance, 0.05, 40);

        onTransformChange("scale", "x", toInputNumber(gesture.startScale.x * factor));
        onTransformChange("scale", "y", toInputNumber(gesture.startScale.y * factor));
        onTransformChange("scale", "z", toInputNumber(gesture.startScale.z * factor));
      }

      if (gesture.type === "rotate") {
        const currentAngle = Math.atan2(event.clientY - gesture.centerY, event.clientX - gesture.centerX);
        let deltaAngle = currentAngle - gesture.startAngle;
        if (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
        if (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

        const nextZ = gesture.startRotationZ + (deltaAngle * 180) / Math.PI;
        onTransformChange("rotation", "z", toInputNumber(nextZ, 1));
      }
    };

    const clearGesture = () => {
      activeGestureRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", clearGesture);
    window.addEventListener("pointercancel", clearGesture);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", clearGesture);
      window.removeEventListener("pointercancel", clearGesture);
    };
  }, [onTransformChange]);

  const beginGesture = (type, event) => {
    if (!onTransformChange) return;
    const targetRect = gizmoTargetRef.current?.getBoundingClientRect();
    if (!targetRect) return;

    event.preventDefault();
    event.stopPropagation();

    const centerX = targetRect.left + targetRect.width / 2;
    const centerY = targetRect.top + targetRect.height / 2;

    if (type === "move") {
      activeGestureRef.current = {
        type,
        startClientX: event.clientX,
        startClientY: event.clientY,
        startPosition: {
          x: positionX,
          y: positionY
        }
      };
      return;
    }

    if (type === "scale") {
      const startDistance = Math.hypot(event.clientX - centerX, event.clientY - centerY) || 1;
      activeGestureRef.current = {
        type,
        centerX,
        centerY,
        startDistance,
        startScale: {
          x: scaleX,
          y: scaleY,
          z: scaleZ
        }
      };
      return;
    }

    if (type === "rotate") {
      const startAngle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
      activeGestureRef.current = {
        type,
        centerX,
        centerY,
        startAngle,
        startRotationZ: rotationZ
      };
    }
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16 }}>Live Preview</h3>
          <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
            Approximate marker-plane composition
          </p>
        </div>
        {contentType === "video" && (
          <button
            type="button"
            onClick={() => setPreviewMuted((prev) => !prev)}
            style={{
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.32)",
              padding: "6px 12px",
              fontSize: 12,
              cursor: "pointer",
              color: "#fff",
              background: "rgba(0,0,0,0.5)"
            }}
          >
            {previewMuted ? "Unmute Preview" : "Mute Preview"}
          </button>
        )}
      </div>

      <div style={frameStyle}>
        <div
          style={{
            position: "absolute",
            inset: 14,
            borderRadius: 12,
            border: "1px dashed rgba(255,255,255,0.26)",
            display: "grid",
            placeItems: "center",
            overflow: "hidden"
          }}
          ref={previewAreaRef}
        >
          <div
            style={{
              position: "relative",
              width: markerRenderSize.width || "100%",
              height: markerRenderSize.height || "100%",
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(0,0,0,0.35)"
            }}
          >
            {normalizedMarkerUrl ? (
              <img
                src={normalizedMarkerUrl}
                alt="Marker"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.35,
                  filter: "grayscale(100%) contrast(1.2)"
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  color: "rgba(255,255,255,0.65)",
                  fontSize: 14
                }}
              >
                Upload a marker image to preview composition
              </div>
            )}

            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                perspective: 900
              }}
            >
              <div
                style={{
                  transform: layerTransform,
                  transformStyle: "preserve-3d",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <div
                  ref={gizmoTargetRef}
                  onPointerDown={(event) => {
                    if (gizmoMode === "move") beginGesture("move", event);
                  }}
                  style={{
                    position: "relative",
                    display: "grid",
                    placeItems: "center",
                    cursor: gizmoMode === "move" ? "move" : "default",
                    touchAction: "none"
                  }}
                >
                  {hasVideoPreview && (
                    <video
                      ref={videoPreviewRef}
                      src={normalizedContentUrl}
                      muted={previewMuted}
                      autoPlay={Boolean(videoOptions?.autoplay)}
                      loop={Boolean(videoOptions?.loop)}
                      controls={Boolean(videoOptions?.showControls)}
                      playsInline={Boolean(videoOptions?.playsInline)}
                      style={{
                        width: videoPlane.width,
                        height: videoPlane.height,
                        maxWidth: "58vw",
                        borderRadius: 10,
                        boxShadow: "0 16px 32px rgba(0,0,0,0.45)",
                        objectFit: fitMode,
                        opacity: previewOpacity,
                        transform: `scale(${flipScaleX}, ${flipScaleY})`
                      }}
                    />
                  )}

                  {hasModelPreview && (
                    <div
                      style={{
                        width: 190,
                        height: 130,
                        borderRadius: 12,
                        border: "1px solid rgba(122,214,255,0.6)",
                        background:
                          "linear-gradient(145deg, rgba(13,44,73,0.82), rgba(20,116,173,0.35))",
                        display: "grid",
                        placeItems: "center",
                        color: "rgba(255,255,255,0.92)",
                        fontWeight: 600,
                        boxShadow: "0 16px 32px rgba(0,0,0,0.45)"
                      }}
                    >
                      3D Model
                    </div>
                  )}

                  {!hasVideoPreview && !hasModelPreview && (
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: 999,
                        border: "1px solid rgba(255,255,255,0.35)",
                        background: "rgba(0,0,0,0.5)",
                        color: "rgba(255,255,255,0.86)",
                        fontSize: 13
                      }}
                    >
                      Upload a {contentType === "video" ? "video" : "3D model"} to preview
                    </div>
                  )}

                  <div
                    style={{
                      position: "absolute",
                      inset: -6,
                      border: "1px solid rgba(100,208,255,0.85)",
                      borderRadius: 10,
                      pointerEvents: "none"
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Rotate object"
                    onPointerDown={(event) => {
                      setGizmoMode("rotate");
                      beginGesture("rotate", event);
                    }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: -28,
                      transform: "translateX(-50%)",
                      width: 16,
                      height: 16,
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.75)",
                      background: gizmoMode === "rotate" ? "#35e8aa" : "#0a1f38",
                      cursor: "grab",
                      touchAction: "none"
                    }}
                  />
                  <button
                    type="button"
                    aria-label="Scale object"
                    onPointerDown={(event) => {
                      setGizmoMode("scale");
                      beginGesture("scale", event);
                    }}
                    style={{
                      position: "absolute",
                      right: -10,
                      bottom: -10,
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      border: "1px solid rgba(255,255,255,0.82)",
                      background: gizmoMode === "scale" ? "#35e8aa" : "#0a1f38",
                      cursor: "nwse-resize",
                      touchAction: "none"
                    }}
                  />
                </div>

                {labelText && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "6px 10px",
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.55)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      fontSize: 13
                    }}
                  >
                    {labelText}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            display: "flex",
            gap: 8
          }}
        >
          {[
            { key: "move", label: "Move" },
            { key: "rotate", label: "Rotate" },
            { key: "scale", label: "Scale" }
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setGizmoMode(option.key)}
              style={{
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.35)",
                padding: "6px 10px",
                fontSize: 12,
                cursor: "pointer",
                color: "#fff",
                background:
                  gizmoMode === option.key
                    ? "linear-gradient(130deg, rgba(20,180,255,0.95), rgba(31,231,145,0.88))"
                    : "rgba(0,0,0,0.5)"
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            padding: "6px 8px",
            borderRadius: 8,
            fontSize: 11,
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.8)"
          }}
        >
          {name || "Untitled Project"} | Drag object to move, top handle to rotate, corner handle to scale
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
