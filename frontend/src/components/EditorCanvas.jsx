import React from "react";

const frameStyle = {
  position: "relative",
  width: "100%",
  aspectRatio: "4 / 3",
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
  name
}) => {
  const pxPerMeter = 180;

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

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16 }}>Live Preview</h3>
          <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
            Approximate marker-plane composition
          </p>
        </div>
      </div>

      <div style={frameStyle}>
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
            inset: "10% 10%",
            border: "1px dashed rgba(255,255,255,0.35)",
            borderRadius: 12,
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
            {hasVideoPreview && (
              <video
                src={normalizedContentUrl}
                muted
                autoPlay
                loop
                playsInline
                style={{
                  width: 240,
                  maxWidth: "58vw",
                  borderRadius: 10,
                  boxShadow: "0 16px 32px rgba(0,0,0,0.45)"
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
          {name || "Untitled Project"}
        </div>
      </div>
    </div>
  );
};

export default EditorCanvas;
