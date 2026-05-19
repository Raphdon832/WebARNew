import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectBySlug } from "../api/projects";
import { useMindAR } from "../lib/useMindAR";
import { normalizeVideoOptions } from "../lib/videoOptions";
import { normalizeLoadingScreenOptions } from "../lib/loadingScreenOptions";
import { compileMindFileFromImageUrl } from "../lib/mindFileCompiler";

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
  const [loadingProgress, setLoadingProgress] = useState(10);
  const [sceneStarted, setSceneStarted] = useState(false);
  const [mindTargetSrc, setMindTargetSrc] = useState(null);
  const [mindTargetPreparing, setMindTargetPreparing] = useState(false);
  const [mindTargetCompileProgress, setMindTargetCompileProgress] = useState(0);
  const [mindTargetError, setMindTargetError] = useState(null);
  const [mindTargetFallbackActive, setMindTargetFallbackActive] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [videoNeedsInteraction, setVideoNeedsInteraction] = useState(false);
  const [videoPlaneSize, setVideoPlaneSize] = useState({ width: 1, height: 0.5625 });
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const targetRef = useRef(null);
  const manualVideoStartRef = useRef(false);
  const mindArStartedRef = useRef(false);

  const { ready, error: mindArError } = useMindAR();

  useEffect(() => {
    fetchProjectBySlug(slug)
      .then(setProject)
      .catch((err) => {
        console.error(err);
        setError("Experience not found or unavailable.");
      });
  }, [slug]);

  useEffect(() => {
    setSceneStarted(false);
    setMindTargetSrc(null);
    setMindTargetPreparing(false);
    setMindTargetCompileProgress(0);
    setMindTargetError(null);
    setMindTargetFallbackActive(false);
    mindArStartedRef.current = false;
    manualVideoStartRef.current = false;
  }, [slug]);

  useEffect(() => {
    const targetProgress = !project
      ? 34
      : !ready
        ? 68
        : mindTargetPreparing
          ? 84
          : mindTargetSrc
            ? 100
            : 92;
    const timer = window.setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= targetProgress) return prev;
        const delta = Math.max(0.8, (targetProgress - prev) * 0.15);
        return Math.min(targetProgress, prev + delta);
      });
    }, 70);

    return () => window.clearInterval(timer);
  }, [project, ready, mindTargetPreparing, mindTargetSrc]);

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
  const rawLoadingScreen = config.loadingScreen;
  const videoOptions = useMemo(() => normalizeVideoOptions(rawVideoOptions), [rawVideoOptions]);
  const loadingScreen = useMemo(
    () => normalizeLoadingScreenOptions(rawLoadingScreen),
    [rawLoadingScreen]
  );

  const resolvedTransform = resolveTransform(rawTransform, contentType);
  const transformPosition = toVectorString(resolvedTransform.position);
  const transformRotation = toVectorString(resolvedTransform.rotation);
  const transformScale = toVectorString(resolvedTransform.scale);
  const mindFileUrl =
    normalizeAssetUrl(explicitMindFileUrl || markerImageUrl?.replace(/\.(png|jpg|jpeg)$/i, ".mind"));
  const resolvedMarkerImageUrl = normalizeAssetUrl(markerImageUrl);
  const resolvedContentUrl = normalizeAssetUrl(contentUrl);
  const resolvedLoadingBackgroundUrl = normalizeAssetUrl(loadingScreen.backgroundImageUrl);
  const hasBootData = Boolean(project && ready && mindTargetSrc);

  useEffect(() => {
    let active = true;
    let compiledMindObjectUrl = null;

    if (!project || !ready) return;

    const verifyMindFileUrl = async (url) => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) return false;
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("text/html")) return false;
        return true;
      } catch (_err) {
        return false;
      }
    };

    const resolveMindTarget = async () => {
      setMindTargetPreparing(true);
      setMindTargetCompileProgress(0);
      setMindTargetError(null);
      setMindTargetFallbackActive(false);
      setMindTargetSrc(null);

      const candidateUrls = [];
      if (mindFileUrl) candidateUrls.push(mindFileUrl);
      const derivedFromMarker = resolvedMarkerImageUrl?.replace(/\.(png|jpg|jpeg)$/i, ".mind");
      if (derivedFromMarker && !candidateUrls.includes(derivedFromMarker)) {
        candidateUrls.push(derivedFromMarker);
      }

      for (const candidateUrl of candidateUrls) {
        const isUsable = await verifyMindFileUrl(candidateUrl);
        if (!active) return;
        if (isUsable) {
          setMindTargetSrc(candidateUrl);
          setMindTargetPreparing(false);
          return;
        }
      }

      if (resolvedMarkerImageUrl) {
        try {
          const compiledBlob = await compileMindFileFromImageUrl(
            resolvedMarkerImageUrl,
            (progress) => {
              if (active) setMindTargetCompileProgress(progress);
            }
          );
          if (!active) return;
          compiledMindObjectUrl = URL.createObjectURL(compiledBlob);
          setMindTargetSrc(compiledMindObjectUrl);
          setMindTargetFallbackActive(true);
          setMindTargetPreparing(false);
          return;
        } catch (_err) {
          if (!active) return;
        }
      }

      if (!active) return;
      setMindTargetError(
        "Marker target file (.mind) is unavailable. Re-open this project in the editor and regenerate .mind."
      );
      setMindTargetPreparing(false);
    };

    resolveMindTarget();

    return () => {
      active = false;
      if (compiledMindObjectUrl) URL.revokeObjectURL(compiledMindObjectUrl);
    };
  }, [project, ready, mindFileUrl, resolvedMarkerImageUrl]);

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
    if (!sceneStarted) return;

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
  }, [ready, project, contentType, videoOptions, sceneStarted]);

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

  useEffect(() => {
    if (!project || !ready || contentType !== "video" || !resolvedContentUrl) return;

    let active = true;
    setVideoError(null);

    const verifyVideoAsset = async () => {
      try {
        const response = await fetch(resolvedContentUrl, { method: "HEAD", cache: "no-store" });
        if (!active) return;
        if (!response.ok) {
          setVideoError(
            "Video file could not be loaded (404/invalid URL). Re-upload the video in the editor."
          );
          return;
        }
      } catch (_err) {
        if (!active) return;
      }
    };

    verifyVideoAsset();

    return () => {
      active = false;
    };
  }, [project, ready, contentType, resolvedContentUrl]);

  useEffect(() => {
    if (!hasBootData) return;
    if (loadingScreen.showStartButton) return;
    setSceneStarted(true);
  }, [hasBootData, loadingScreen.showStartButton]);

  useEffect(() => {
    if (!hasBootData || !sceneStarted) return;
    if (mindArStartedRef.current) return;

    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const startMindAR = () => {
      const system = sceneEl.systems?.["mindar-image-system"];
      if (!system || mindArStartedRef.current) return;
      system.start();
      mindArStartedRef.current = true;
    };

    if (sceneEl.hasLoaded) {
      startMindAR();
      return;
    }

    sceneEl.addEventListener("loaded", startMindAR, { once: true });
    return () => {
      sceneEl.removeEventListener("loaded", startMindAR);
    };
  }, [hasBootData, sceneStarted]);

  if (error) return <p style={{ padding: 24 }}>{error}</p>;
  if (mindArError)
    return <p style={{ padding: 24 }}>Failed to load AR engine. Check console for details.</p>;

  const videoScale = `${videoOptions.flipHorizontal ? -1 : 1} ${videoOptions.flipVertical ? -1 : 1} 1`;
  const showLoadingOverlay = !sceneStarted || !project || !ready || !mindTargetSrc;
  const canClickStart = Boolean(project && ready && mindTargetSrc && loadingScreen.showStartButton);
  const loadingLabel =
    !project
      ? "Fetching experience..."
      : !ready
        ? "Initializing AR engine..."
        : mindTargetPreparing
          ? "Preparing marker target..."
          : mindTargetError
            ? "Marker target unavailable"
            : "Ready to start";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "transparent",
        backgroundImage: resolvedLoadingBackgroundUrl ? `url(${resolvedLoadingBackgroundUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center center"
      }}
    >
      {showLoadingOverlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            display: "grid",
            placeItems: "center",
            background:
              "radial-gradient(120% 100% at 50% 0%, rgba(0,195,255,0.14), rgba(0,0,0,0.86) 62%, #000)"
          }}
        >
          <div style={{ width: "min(460px, 92vw)", padding: 16 }}>
            <p style={{ margin: "0 0 10px", fontSize: 14, color: "rgba(255,255,255,0.78)" }}>
              {loadingLabel}
            </p>
            <div
              style={{
                width: "100%",
                height: 12,
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.round(loadingProgress)}%`,
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #15b4ff, #2cf58b)",
                  transition: "width 180ms ease"
                }}
              />
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              {Math.round(loadingProgress)}%
            </p>
            {mindTargetPreparing && mindTargetCompileProgress > 0 && (
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "rgba(255,255,255,0.68)" }}>
                Rebuilding .mind from marker image: {Math.round(mindTargetCompileProgress)}%
              </p>
            )}
            {mindTargetFallbackActive && !mindTargetPreparing && (
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "rgba(133,255,205,0.86)" }}>
                Marker target regenerated automatically.
              </p>
            )}
            {mindTargetError && (
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 12,
                  color: "#ffd5d5",
                  padding: "8px 10px",
                  borderRadius: 8,
                  background: "rgba(145,0,22,0.45)",
                  border: "1px solid rgba(255,180,180,0.45)"
                }}
              >
                {mindTargetError}
              </p>
            )}
            {canClickStart && (
              <button
                type="button"
                onClick={() => setSceneStarted(true)}
                style={{
                  marginTop: 14,
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "linear-gradient(90deg, rgba(21,180,255,0.92), rgba(44,245,139,0.9))",
                  color: "#052131",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer"
                }}
              >
                {loadingScreen.startButtonText || "Play"}
              </button>
            )}
          </div>
        </div>
      )}

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
      {project && ready && mindTargetSrc && (
        <a-scene
          ref={sceneRef}
          embedded
          mindar-image={`imageTargetSrc: ${mindTargetSrc}; autoStart: false;`}
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
      )}
    </div>
  );
};

export default Viewer;
