import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectBySlug } from "../api/projects";
import { useMindAR } from "../lib/useMindAR";
import { normalizeVideoOptions } from "../lib/videoOptions";

const parseNumber = (value, fallback) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toVectorString = (vector) => `${vector.x} ${vector.y} ${vector.z}`;

const resolveTransform = (rawTransform = {}, contentType = "model") => {
  const defaultScale = contentType === "video" ? 1 : 0.2;

  return {
    position: {
      x: parseNumber(rawTransform?.position?.x, 0),
      y: parseNumber(rawTransform?.position?.y, 0),
      z: parseNumber(rawTransform?.position?.z, 0)
    },
    rotation: {
      x: parseNumber(rawTransform?.rotation?.x, 0),
      y: parseNumber(rawTransform?.rotation?.y, 0),
      z: parseNumber(rawTransform?.rotation?.z, 0)
    },
    scale: {
      x: parseNumber(rawTransform?.scale?.x, defaultScale),
      y: parseNumber(rawTransform?.scale?.y, defaultScale),
      z: parseNumber(rawTransform?.scale?.z, defaultScale)
    }
  };
};

const calculateVideoPlaneSize = (aspectRatio, options) => {
  let ratio = aspectRatio;
  if (!Number.isFinite(ratio) || ratio <= 0) ratio = 16 / 9;
  if (options.invertAspectRatio && ratio > 0) ratio = 1 / ratio;

  if (!options.maintainAspectRatio || options.fit === "fill") {
    return { width: 1, height: 1 };
  }

  if (options.fit === "cover") {
    if (ratio >= 1) {
      return { width: ratio, height: 1 };
    }
    return { width: 1, height: 1 / ratio };
  }

  if (ratio >= 1) {
    return { width: 1, height: 1 / ratio };
  }
  return { width: ratio, height: 1 };
};

const Viewer = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [videoNeedsInteraction, setVideoNeedsInteraction] = useState(false);
  const [videoPlaneSize, setVideoPlaneSize] = useState({ width: 1, height: 0.5625 });
  const videoRef = useRef(null);
  const targetRef = useRef(null);
  const manualVideoStartRef = useRef(false);

  const { ready, error: mindArError } = useMindAR();

  useEffect(() => {
    fetchProjectBySlug(slug)
      .then(setProject)
      .catch((err) => {
        console.error(err);
        setError("Experience not found or unavailable.");
      });
  }, [slug]);

  const normalizeAssetUrl = (url) => {
    if (!url) return url;
    if (window.location.protocol !== "https:") return url;
    if (url.startsWith("http://")) {
      return `https://${url.slice("http://".length)}`;
    }
    return url;
  };
  const config = project?.config || {};
  const markerImageUrl = config.markerImageUrl;
  const explicitMindFileUrl = config.mindFileUrl;
  const contentType = config.contentType || "model";
  const contentUrl = config.contentUrl;
  const labelText = config.labelText;
  const rawTransform = config.transform;
  const rawVideoOptions = config.videoOptions;
  const videoOptions = useMemo(() => normalizeVideoOptions(rawVideoOptions), [rawVideoOptions]);

  const resolvedTransform = resolveTransform(rawTransform, contentType);
  const transformPosition = toVectorString(resolvedTransform.position);
  const transformRotation = toVectorString(resolvedTransform.rotation);
  const transformScale = toVectorString(resolvedTransform.scale);
  const mindFileUrl =
    normalizeAssetUrl(explicitMindFileUrl || markerImageUrl?.replace(/\.(png|jpg|jpeg)$/i, ".mind"));
  const resolvedContentUrl = normalizeAssetUrl(contentUrl);

  const applyVideoStartTime = (videoEl) => {
    if (!videoEl) return;
    if (!Number.isFinite(videoEl.duration) || videoOptions.startTimeSec <= 0) return;
    if (videoOptions.startTimeSec >= videoEl.duration) return;
    videoEl.currentTime = videoOptions.startTimeSec;
  };

  const playVideo = (force = false) => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.muted = videoOptions.muted;
    videoEl.defaultMuted = videoOptions.muted;
    videoEl.playsInline = videoOptions.playsInline;
    videoEl.playbackRate = videoOptions.playbackRate;

    if (!force && !videoOptions.autoplay) return;

    const playPromise = videoEl.play();
    if (playPromise?.catch) {
      playPromise
        .then(() => {
          setVideoNeedsInteraction(false);
          setVideoError(null);
        })
        .catch((err) => {
          console.error("Video autoplay failed", err);
          setVideoNeedsInteraction(true);
        });
    }
  };

  useEffect(() => {
    if (!ready || !project || contentType !== "video") return;

    const videoEl = videoRef.current;
    const targetEl = targetRef.current;
    if (!videoEl || !targetEl) return;

    const updateVideoPlane = () => {
      const ratio = videoEl.videoWidth && videoEl.videoHeight ? videoEl.videoWidth / videoEl.videoHeight : 16 / 9;
      setVideoPlaneSize(calculateVideoPlaneSize(ratio, videoOptions));
    };

    const onCanPlay = () => {
      videoEl.playbackRate = videoOptions.playbackRate;
      applyVideoStartTime(videoEl);

      if (videoOptions.autoplay) {
        playVideo(true);
      }
    };

    const onTargetFound = () => {
      if (videoOptions.restartOnTargetFound) {
        applyVideoStartTime(videoEl);
      }

      if (videoOptions.autoplay || manualVideoStartRef.current) {
        playVideo(true);
      }
    };

    const onTargetLost = () => {
      if (videoOptions.pauseWhenTargetLost) {
        videoEl.pause();
      }
    };

    const onVideoError = () => {
      setVideoError(
        "Video failed to load. Try MP4 (H.264) or WebM and verify the uploaded file URL."
      );
    };

    videoEl.addEventListener("loadedmetadata", updateVideoPlane);
    videoEl.addEventListener("canplay", onCanPlay);
    videoEl.addEventListener("error", onVideoError);
    targetEl.addEventListener("targetFound", onTargetFound);
    targetEl.addEventListener("targetLost", onTargetLost);

    updateVideoPlane();
    if (videoOptions.autoplay) {
      playVideo(true);
    }

    return () => {
      videoEl.removeEventListener("loadedmetadata", updateVideoPlane);
      videoEl.removeEventListener("canplay", onCanPlay);
      videoEl.removeEventListener("error", onVideoError);
      targetEl.removeEventListener("targetFound", onTargetFound);
      targetEl.removeEventListener("targetLost", onTargetLost);
    };
  }, [ready, project, contentType, videoOptions]);

  useEffect(() => {
    if (contentType !== "video") return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.playbackRate = videoOptions.playbackRate;
    videoEl.muted = videoOptions.muted;
    videoEl.defaultMuted = videoOptions.muted;
    videoEl.playsInline = videoOptions.playsInline;

    if (!videoOptions.autoplay) {
      videoEl.pause();
      setVideoNeedsInteraction(true);
    }
  }, [contentType, videoOptions]);

  if (error) return <p style={{ padding: 24 }}>{error}</p>;
  if (mindArError)
    return <p style={{ padding: 24 }}>Failed to load AR engine. Check console for details.</p>;
  if (!project || !ready) return <p style={{ padding: 24 }}>Loading AR experience...</p>;
  if (!mindFileUrl) {
    return <p style={{ padding: 24 }}>Marker target (.mind) file is missing for this project.</p>;
  }

  const videoScale = `${videoOptions.flipHorizontal ? -1 : 1} ${videoOptions.flipVertical ? -1 : 1} 1`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "transparent"
      }}
    >
      {contentType === "video" && videoNeedsInteraction && (
        <button
          type="button"
          onClick={() => {
            manualVideoStartRef.current = true;
            playVideo(true);
          }}
          style={{
            position: "fixed",
            zIndex: 30,
            left: 16,
            top: 16,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.3)",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Tap to start video
        </button>
      )}
      {videoError && (
        <p
          style={{
            position: "fixed",
            zIndex: 30,
            left: 16,
            right: 16,
            bottom: 16,
            padding: 10,
            borderRadius: 10,
            background: "rgba(145,0,22,0.85)",
            color: "#fff"
          }}
        >
          {videoError}
        </p>
      )}
      <a-scene
        embedded
        mindar-image={`imageTargetSrc: ${mindFileUrl}; autoStart: true;`}
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: true"
        renderer="alpha: true; colorManagement: true; physicallyCorrectLights: true"
        style={{ background: "transparent" }}
      >
        <a-assets>
          {contentType === "video" ? (
            <video
              id="video-overlay"
              ref={videoRef}
              src={resolvedContentUrl}
              autoPlay={videoOptions.autoplay}
              muted={videoOptions.muted}
              loop={videoOptions.loop}
              playsInline={videoOptions.playsInline}
              controls={videoOptions.showControls}
              preload="auto"
              crossOrigin="anonymous"
              webkit-playsinline="true"
            ></video>
          ) : (
            <a-asset-item id="model" src={resolvedContentUrl}></a-asset-item>
          )}
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: true"></a-camera>

        <a-entity ref={targetRef} mindar-image-target="targetIndex: 0">
          <a-entity
            position={transformPosition}
            rotation={transformRotation}
            scale={transformScale}
          >
            {contentType === "video" ? (
              <a-video
                src="#video-overlay"
                position="0 0 0"
                width={String(videoPlaneSize.width)}
                height={String(videoPlaneSize.height)}
                scale={videoScale}
                material={`shader: flat; side: double; transparent: true; opacity: ${videoOptions.opacity};`}
              ></a-video>
            ) : (
              <a-gltf-model src="#model" position="0 0 0" rotation="0 0 0"></a-gltf-model>
            )}
            {labelText && (
              <a-text
                value={labelText}
                position="0 0.2 0"
                align="center"
                color="#ffffff"
              ></a-text>
            )}
          </a-entity>
        </a-entity>
      </a-scene>
    </div>
  );
};

export default Viewer;
