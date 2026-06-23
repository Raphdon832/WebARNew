import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchViewerProject } from "../api/projects";
import { useMindAR } from "../lib/useMindAR";
import { use8thWall } from "../lib/use8thWall";
import { normalizeVideoOptions } from "../lib/videoOptions";
import { normalizeLoadingScreenOptions } from "../lib/loadingScreenOptions";
import { normalizeTrackingOptions } from "../lib/trackingOptions";
import { patchMindARCameraSystem } from "../lib/mindARCamera";
import { registerMindARPoseSmoothing } from "../lib/mindARPoseSmoothing";
import { createViewerAnalyticsTracker } from "../lib/viewerAnalytics";
import IdentifyngLogo from "../components/IdentifyngLogo";

const parseNumber = (value, fallback) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toVectorString = (vector) => `${vector.x} ${vector.y} ${vector.z}`;

const addRotationZ = (rotation, zOffset = 0) => ({
  ...rotation,
  z: rotation.z + zOffset
});

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

const calculateVideoPlaneSize = (aspectRatio, markerAspectRatio, options) => {
  let ratio = aspectRatio;
  let markerRatio = markerAspectRatio;
  if (!Number.isFinite(ratio) || ratio <= 0) ratio = 16 / 9;
  if (!Number.isFinite(markerRatio) || markerRatio <= 0) markerRatio = 1;
  if (options.invertAspectRatio && ratio > 0) ratio = 1 / ratio;

  const markerWidth = 1;
  const markerHeight = markerWidth / markerRatio;

  if (!options.maintainAspectRatio || options.fit === "fill") {
    return { width: markerWidth, height: markerHeight };
  }

  if (options.fit === "cover") {
    if (ratio >= markerRatio) {
      return { width: markerHeight * ratio, height: markerHeight };
    }
    return { width: markerWidth, height: markerWidth / ratio };
  }

  if (ratio >= markerRatio) {
    return { width: markerWidth, height: markerWidth / ratio };
  }
  return { width: markerHeight * ratio, height: markerHeight };
};

const didVideoWrapToStart = (previousTime, currentTime, duration) => {
  if (!Number.isFinite(previousTime) || !Number.isFinite(currentTime)) return false;
  if (!Number.isFinite(duration) || duration <= 0) return false;
  if (currentTime >= previousTime) return false;

  const boundaryWindow = Math.min(1.5, Math.max(0.35, duration * 0.18));
  return previousTime >= duration - boundaryWindow && currentTime <= boundaryWindow;
};

const getViewportSize = () => {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }

  const viewport = window.visualViewport;
  return {
    width: Math.round(viewport?.width || window.innerWidth || document.documentElement.clientWidth),
    height: Math.round(viewport?.height || window.innerHeight || document.documentElement.clientHeight)
  };
};

const isAbsoluteAssetUrl = (url = "") =>
  /^(https?:|blob:|data:)/i.test(url);

const resolveRelativeAssetUrl = (assetUrl, baseUrl) => {
  if (!assetUrl || isAbsoluteAssetUrl(assetUrl)) return assetUrl;
  try {
    return new URL(assetUrl, baseUrl).href;
  } catch (_err) {
    return assetUrl;
  }
};

const normalizeEightWallTargetData = (rawData, targetName, markerImageUrl, jsonUrl) => {
  const data = Array.isArray(rawData) ? rawData[0] : rawData;
  if (!data || typeof data !== "object") {
    throw new Error("Invalid 8th Wall image target JSON.");
  }

  const imagePath = data.imagePath || data.resources?.luminanceImage || markerImageUrl;

  return {
    ...data,
    name: data.name || targetName || "webar-marker",
    imagePath: resolveRelativeAssetUrl(imagePath, jsonUrl || markerImageUrl)
  };
};

const BRAND_SPLASH_DURATION_MS = 650;
const SCAN_OVERLAY_STYLES = `
@keyframes identifyngScanPulse {
  0%, 100% { opacity: 0.58; transform: scale(0.98); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes identifyngScanLine {
  0% { transform: translateY(-46%); opacity: 0; }
  15%, 85% { opacity: 1; }
  100% { transform: translateY(46%); opacity: 0; }
}

@keyframes identifyngLoaderOrbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes identifyngLoaderIconSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(-360deg); }
}

@keyframes identifyngLoaderLogoPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  58% { transform: translate(-50%, -50%) scale(1.045); }
}

@keyframes identifyngLoaderShimmer {
  from { transform: translateX(-45%); opacity: 0.25; }
  50% { opacity: 0.82; }
  to { transform: translateX(95%); opacity: 0.25; }
}

@keyframes identifyngLoadingLabelPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.identifyng-loader-stage {
  width: min(360px, calc(100vw - 48px));
  min-height: min(410px, calc(100dvh - 64px));
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 14px;
  text-align: center;
}

.identifyng-loader-orbit {
  --loader-size: min(232px, 62vw);
  --loader-radius: calc(var(--loader-size) * 0.43);
  position: relative;
  width: var(--loader-size);
  height: var(--loader-size);
}

.identifyng-loader-orbit::before {
  content: "";
  position: absolute;
  inset: 11%;
  border: 1px dashed rgba(127, 207, 194, 0.5);
  border-radius: 50%;
  box-shadow: 0 0 34px rgba(127, 207, 194, 0.16);
}

.identifyng-loader-orbit-spinner {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  animation: identifyngLoaderOrbit 10.5s linear infinite;
}

.identifyng-loader-logo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 118px;
  max-width: 48%;
  transform: translate(-50%, -50%);
  animation: identifyngLoaderLogoPulse 1.4s ease-in-out infinite;
}

.identifyng-loader-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 42px;
  height: 42px;
  margin: -21px 0 0 -21px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: currentColor;
  background: transparent;
  border: 1px solid transparent;
  box-shadow: none;
}

.identifyng-loader-icon-glyph {
  display: block;
  width: 26px;
  height: 26px;
  animation: identifyngLoaderIconSpin 10.5s linear infinite;
}

.identifyng-loader-icon-glyph svg {
  display: block;
  width: 100%;
  height: 100%;
}

.identifyng-loader-progress {
  position: relative;
  width: min(320px, 78vw);
  height: 16px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(127, 207, 194, 0.58);
  background: rgba(255, 255, 255, 0.36);
  box-shadow: 0 16px 36px rgba(8, 27, 39, 0.16);
}

.identifyng-loader-progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  min-width: 18px;
  border-radius: inherit;
  background: linear-gradient(90deg, #ffffff 0%, #d8d8d8 48%, #050505 100%);
  transition: width 180ms ease;
}

.identifyng-loader-progress-fill::after {
  content: "";
  position: absolute;
  inset: 0;
  width: 58%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.78), transparent);
  animation: identifyngLoaderShimmer 1.35s ease-in-out infinite;
}

.identifyng-loader-label {
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  animation: identifyngLoadingLabelPulse 1.25s ease-in-out infinite;
}

.identifyng-loader-percent {
  margin: -6px 0 0;
  font-size: 12px;
  font-weight: 700;
}

.identifyng-loader-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  justify-self: center;
  min-width: 156px;
  max-width: min(280px, 78vw);
  min-height: 38px;
  padding: 9px 22px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
}

.identifyng-loader-stage--launch {
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  align-content: end;
  padding: 24px 24px max(88px, calc(env(safe-area-inset-bottom, 0px) + 88px));
}

.identifyng-scan-frame {
  position: relative;
  width: min(62vw, 310px);
  aspect-ratio: 1 / 1;
  border: 2px solid rgba(255, 255, 255, 0.82);
  border-radius: 18px;
  box-shadow: 0 0 0 999px rgba(0, 0, 0, 0.08), 0 18px 50px rgba(0, 0, 0, 0.22);
  animation: identifyngScanPulse 2.2s ease-in-out infinite;
}

.identifyng-scan-frame::before,
.identifyng-scan-frame::after {
  content: "";
  position: absolute;
  width: 42px;
  height: 42px;
  border-color: #7fcfc2;
  border-style: solid;
}

.identifyng-scan-frame::before {
  left: -5px;
  top: -5px;
  border-width: 4px 0 0 4px;
  border-radius: 18px 0 0 0;
}

.identifyng-scan-frame::after {
  right: -5px;
  bottom: -5px;
  border-width: 0 4px 4px 0;
  border-radius: 0 0 18px 0;
}

.identifyng-scan-line {
  position: absolute;
  left: 16px;
  right: 16px;
  top: 50%;
  height: 2px;
  border-radius: 999px;
  background: linear-gradient(90deg, transparent, rgba(127, 207, 194, 0.95), transparent);
  box-shadow: 0 0 18px rgba(127, 207, 194, 0.75);
  animation: identifyngScanLine 2.35s ease-in-out infinite;
}
`;

const requiresSecureCameraOrigin = () => {
  if (typeof window === "undefined") return false;
  if (window.location.protocol === "https:") return false;

  return !["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
};

const isIOSWebKit = () => {
  if (typeof navigator === "undefined") return false;
  const platform = navigator.platform || "";
  const userAgent = navigator.userAgent || "";

  return (
    /iPad|iPhone|iPod/.test(userAgent) ||
    (platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

const Viewer = () => {
  const { slug, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(10);
  const [sceneStarted, setSceneStarted] = useState(false);
  const [arSessionReady, setArSessionReady] = useState(false);
  const [brandSplashComplete, setBrandSplashComplete] = useState(false);
  const [mindTargetSrc, setMindTargetSrc] = useState(null);
  const [mindTargetPreparing, setMindTargetPreparing] = useState(false);
  const [mindTargetError, setMindTargetError] = useState(null);
  const [eighthWallTargetData, setEighthWallTargetData] = useState(null);
  const [eighthWallTargetPreparing, setEighthWallTargetPreparing] = useState(false);
  const [eighthWallTargetError, setEighthWallTargetError] = useState(null);
  const [eighthWallConfigured, setEighthWallConfigured] = useState(false);
  const [poseSmoothingReady, setPoseSmoothingReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioUnlockNeeded, setAudioUnlockNeeded] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);
  const [videoCtaVisible, setVideoCtaVisible] = useState(false);
  const [markerAspectRatio, setMarkerAspectRatio] = useState(1);
  const [videoPlaneSize, setVideoPlaneSize] = useState({ width: 1, height: 1 });
  const [viewportSize, setViewportSize] = useState(getViewportSize);
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const targetRef = useRef(null);
  const mindArStartedRef = useRef(false);
  const targetVisibleRef = useRef(false);
  const effectiveVideoMutedRef = useRef(false);
  const audioUnlockInFlightRef = useRef(false);
  const videoCtaCompletionCountRef = useRef(0);
  const lastVideoTimeRef = useRef(null);
  const analyticsRef = useRef(null);

  const trackViewerEvent = useCallback((eventName, metadata = {}, options = {}) => {
    analyticsRef.current?.track(eventName, metadata, options);
  }, []);

  const selectedArEngine =
    project?.config?.trackingOptions?.arEngine === "8thwall" ? "8thwall" : "mindar";
  const isEightWallEngine = selectedArEngine === "8thwall";
  const isMindAREngine = !isEightWallEngine;
  const { ready: mindARReady, error: mindArError } = useMindAR(
    Boolean(project) && isMindAREngine
  );
  const { ready: eighthWallReady, error: eighthWallError } = use8thWall(
    Boolean(project) && isEightWallEngine
  );
  const ready = isEightWallEngine ? eighthWallReady : mindARReady;
  const engineError = isEightWallEngine ? eighthWallError : mindArError;

  const resizeMindARToViewport = useCallback(() => {
    const sceneEl = sceneRef.current;
    const system = sceneEl?.systems?.["mindar-image-system"];
    if (!system?._resize || !mindArStartedRef.current || !system.video || !system.controller) return;

    system._resize();
  }, []);

  const queueMindARResize = useCallback(() => {
    window.requestAnimationFrame(resizeMindARToViewport);
    [120, 350, 900].forEach((delay) => {
      window.setTimeout(resizeMindARToViewport, delay);
    });
  }, [resizeMindARToViewport]);

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize(getViewportSize());
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    window.addEventListener("orientationchange", updateViewportSize);
    window.visualViewport?.addEventListener("resize", updateViewportSize);
    window.visualViewport?.addEventListener("scroll", updateViewportSize);

    return () => {
      window.removeEventListener("resize", updateViewportSize);
      window.removeEventListener("orientationchange", updateViewportSize);
      window.visualViewport?.removeEventListener("resize", updateViewportSize);
      window.visualViewport?.removeEventListener("scroll", updateViewportSize);
    };
  }, []);

  useEffect(() => {
    fetchViewerProject({ slug, projectId })
      .then(setProject)
      .catch((err) => {
        console.error(err);
        setError("Experience not found or unavailable.");
      });
  }, [slug, projectId]);

  useEffect(() => {
    if (!project?.id) {
      analyticsRef.current = null;
      return undefined;
    }

    analyticsRef.current = createViewerAnalyticsTracker(project);
    analyticsRef.current.track(
      "viewer_opened",
      { routeSlug: slug || "", routeProjectId: projectId || "" },
      { once: true }
    );

    return () => {
      analyticsRef.current = null;
    };
  }, [project, slug, projectId]);

  useEffect(() => {
    document.title = project?.name ? `${project.name} | iDentifyng` : "iDentifyng";
  }, [project?.name]);

  useEffect(() => {
    setSceneStarted(false);
    setArSessionReady(false);
    setBrandSplashComplete(false);
    setMindTargetSrc(null);
    setMindTargetPreparing(false);
    setMindTargetError(null);
    setEighthWallTargetData(null);
    setEighthWallTargetPreparing(false);
    setEighthWallTargetError(null);
    setEighthWallConfigured(false);
    setPoseSmoothingReady(false);
    setCameraError(null);
    setAudioEnabled(false);
    setAudioUnlockNeeded(false);
    setTargetVisible(false);
    setVideoCtaVisible(false);
    targetVisibleRef.current = false;
    audioUnlockInFlightRef.current = false;
    videoCtaCompletionCountRef.current = 0;
    lastVideoTimeRef.current = null;
    mindArStartedRef.current = false;
  }, [slug, projectId]);

  useEffect(() => {
    const engineReady = ready && (isEightWallEngine || poseSmoothingReady);
    const targetProgress = !project
      ? 34
      : !engineReady
        ? 68
        : isEightWallEngine
          ? eighthWallTargetPreparing
            ? 84
            : eighthWallConfigured
              ? 100
              : 92
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
  }, [
    project,
    ready,
    isEightWallEngine,
    poseSmoothingReady,
    eighthWallTargetPreparing,
    eighthWallConfigured,
    mindTargetPreparing,
    mindTargetSrc
  ]);

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
  const rawTrackingOptions = config.trackingOptions;
  const videoOptions = useMemo(() => normalizeVideoOptions(rawVideoOptions), [rawVideoOptions]);
  const loadingScreen = useMemo(
    () => normalizeLoadingScreenOptions(rawLoadingScreen),
    [rawLoadingScreen]
  );
  const trackingOptions = useMemo(
    () => normalizeTrackingOptions(rawTrackingOptions),
    [rawTrackingOptions]
  );

  const resolvedTransform = resolveTransform(rawTransform, contentType);
  const correctedRotation = isEightWallEngine
    ? addRotationZ(resolvedTransform.rotation, trackingOptions.eighthWallRotationCorrectionZ)
    : resolvedTransform.rotation;
  const transformPosition = toVectorString(resolvedTransform.position);
  const transformRotation = toVectorString(correctedRotation);
  const transformScale = toVectorString(resolvedTransform.scale);
  const mindFileUrl = normalizeAssetUrl(explicitMindFileUrl);
  const resolvedMarkerImageUrl = normalizeAssetUrl(markerImageUrl);
  const resolvedContentUrl = normalizeAssetUrl(contentUrl);
  const resolvedLoadingBackgroundUrl = normalizeAssetUrl(loadingScreen.backgroundImageUrl);
  const engineRuntimeReady = ready && (isEightWallEngine || poseSmoothingReady);
  const hasBootData = Boolean(
    project &&
      engineRuntimeReady &&
      (isEightWallEngine ? eighthWallConfigured : mindTargetSrc)
  );
  const startsUnmutedFromStudio = contentType === "video" && !videoOptions.muted;
  const needsIOSAudioUnlock = Boolean(
    startsUnmutedFromStudio && videoOptions.autoplay && isIOSWebKit()
  );
  const shouldWaitForStartGesture = loadingScreen.showStartButton || needsIOSAudioUnlock;
  const effectiveVideoMuted = Boolean(
    contentType === "video" && videoOptions.muted
  );

  useEffect(() => {
    effectiveVideoMutedRef.current = effectiveVideoMuted;
  }, [effectiveVideoMuted]);

  useEffect(() => {
    if (!arSessionReady) return;

    trackViewerEvent("camera_permission_granted", { engine: selectedArEngine }, { once: true });
    trackViewerEvent("ar_session_started", { engine: selectedArEngine }, { once: true });
  }, [arSessionReady, selectedArEngine, trackViewerEvent]);

  useEffect(() => {
    if (!hasBootData || !resolvedContentUrl) return;

    trackViewerEvent(
      "content_loaded",
      { contentType, engine: selectedArEngine },
      { once: true }
    );
  }, [contentType, hasBootData, resolvedContentUrl, selectedArEngine, trackViewerEvent]);

  useEffect(() => {
    if (!cameraError) return;

    trackViewerEvent(
      "camera_permission_denied",
      { message: cameraError, engine: selectedArEngine },
      { once: true }
    );
    trackViewerEvent("viewer_error", {
      code: "camera_error",
      message: cameraError,
      engine: selectedArEngine
    });
  }, [cameraError, selectedArEngine, trackViewerEvent]);

  useEffect(() => {
    const targetError = mindTargetError || eighthWallTargetError;
    if (!targetError) return;

    trackViewerEvent("viewer_error", {
      code: "target_error",
      message: targetError,
      engine: selectedArEngine
    });
  }, [eighthWallTargetError, mindTargetError, selectedArEngine, trackViewerEvent]);

  useEffect(() => {
    if (!engineError) return;

    trackViewerEvent("viewer_error", {
      code: "engine_error",
      message: engineError.message || String(engineError),
      engine: selectedArEngine
    });
  }, [engineError, selectedArEngine, trackViewerEvent]);

  useEffect(() => {
    if (!videoError) return;

    trackViewerEvent("viewer_error", {
      code: "video_error",
      message: videoError,
      engine: selectedArEngine
    });
  }, [selectedArEngine, trackViewerEvent, videoError]);

  useEffect(() => {
    setVideoCtaVisible(false);
    videoCtaCompletionCountRef.current = 0;
    lastVideoTimeRef.current = null;
  }, [
    contentType,
    resolvedContentUrl,
    videoOptions.ctaEnabled,
    videoOptions.ctaUrl,
    videoOptions.ctaShowAfterPlays
  ]);

  useEffect(() => {
    if (!isMindAREngine) {
      setPoseSmoothingReady(false);
      return;
    }

    if (!ready) {
      setPoseSmoothingReady(false);
      return;
    }

    setPoseSmoothingReady(registerMindARPoseSmoothing());
  }, [ready, isMindAREngine]);

  useEffect(() => {
    if (!resolvedMarkerImageUrl) {
      setMarkerAspectRatio(1);
      return;
    }

    let active = true;
    const image = new Image();
    image.onload = () => {
      if (!active) return;
      if (!image.naturalWidth || !image.naturalHeight) return;
      const ratio = image.naturalWidth / image.naturalHeight;
      if (Number.isFinite(ratio) && ratio > 0) {
        setMarkerAspectRatio(ratio);
      }
    };
    image.onerror = () => {
      if (active) setMarkerAspectRatio(1);
    };
    image.src = resolvedMarkerImageUrl;

    return () => {
      active = false;
    };
  }, [resolvedMarkerImageUrl]);

  useEffect(() => {
    let active = true;

    if (!project || !ready || !isMindAREngine) return;

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
      setMindTargetError(null);
      setMindTargetSrc(null);

      if (!mindFileUrl) {
        setMindTargetError(
          "Marker target file (.mind) is missing. Re-open this project in the studio and attach the generated .mind target."
        );
        setMindTargetPreparing(false);
        return;
      }

      const isUsable = await verifyMindFileUrl(mindFileUrl);
      if (!active) return;
      if (isUsable) {
        setMindTargetSrc(mindFileUrl);
        setMindTargetPreparing(false);
        return;
      }

      setMindTargetError(
        "Marker target file (.mind) is unavailable. Re-open this project in the studio and regenerate the .mind target."
      );
      setMindTargetPreparing(false);
    };

    resolveMindTarget();

    return () => {
      active = false;
    };
  }, [project, ready, isMindAREngine, mindFileUrl]);

  useEffect(() => {
    let active = true;

    setEighthWallTargetData(null);
    setEighthWallConfigured(false);
    setEighthWallTargetError(null);

    if (!project || !ready || !isEightWallEngine) {
      setEighthWallTargetPreparing(false);
      return () => {
        active = false;
      };
    }

    const loadEightWallTarget = async () => {
      setEighthWallTargetPreparing(true);

      try {
        let targetData;
        const jsonUrl = normalizeAssetUrl(trackingOptions.eighthWallTargetUrl);

        if (jsonUrl) {
          const response = await fetch(jsonUrl, { cache: "no-store" });
          if (!response.ok) {
            throw new Error("8th Wall target JSON could not be loaded.");
          }
          const data = await response.json();
          targetData = normalizeEightWallTargetData(
            data,
            trackingOptions.eighthWallTargetName,
            resolvedMarkerImageUrl,
            jsonUrl
          );
        } else {
          throw new Error(
            "8th Wall target JSON is missing. Re-open this project in the studio and generate the 8th Wall target."
          );
        }

        if (!active) return;
        setEighthWallTargetData(targetData);
      } catch (err) {
        if (!active) return;
        setEighthWallTargetError(
          err?.message || "8th Wall target data could not be prepared."
        );
      } finally {
        if (active) setEighthWallTargetPreparing(false);
      }
    };

    loadEightWallTarget();

    return () => {
      active = false;
    };
  }, [
    project,
    ready,
    isEightWallEngine,
    resolvedMarkerImageUrl,
    trackingOptions.eighthWallTargetName,
    trackingOptions.eighthWallTargetUrl
  ]);

  useEffect(() => {
    setEighthWallConfigured(false);

    if (!isEightWallEngine || !ready || !eighthWallTargetData || !window.XR8?.XrController) {
      return;
    }

    try {
      window.XR8.XrController.configure({
        disableWorldTracking: true,
        imageTargetData: [eighthWallTargetData]
      });
      setEighthWallConfigured(true);
    } catch (err) {
      console.error("8th Wall configuration failed", err);
      setEighthWallTargetError("8th Wall engine could not be configured for this target.");
    }
  }, [isEightWallEngine, ready, eighthWallTargetData]);

  const recordVideoCompletionForCta = () => {
    if (contentType !== "video") return;
    trackViewerEvent("video_completed", {
      ctaEnabled: Boolean(videoOptions.ctaEnabled),
      ctaShowAfterPlays: videoOptions.ctaShowAfterPlays
    });

    if (!videoOptions.ctaEnabled || !videoOptions.ctaUrl) return;

    videoCtaCompletionCountRef.current += 1;
    if (videoCtaCompletionCountRef.current >= videoOptions.ctaShowAfterPlays) {
      setVideoCtaVisible(true);
      trackViewerEvent(
        "cta_shown",
        {
          label: videoOptions.ctaLabel || "Learn More",
          url: videoOptions.ctaUrl,
          afterPlays: videoOptions.ctaShowAfterPlays
        },
        { dedupeKey: "cta_shown", once: true }
      );
    }
  };

  const applyVideoStartTime = (videoEl) => {
    if (!videoEl) return;
    if (!Number.isFinite(videoEl.duration) || videoOptions.startTimeSec <= 0) return;
    if (videoOptions.startTimeSec >= videoEl.duration) return;
    lastVideoTimeRef.current = null;
    videoEl.currentTime = videoOptions.startTimeSec;
  };

  const playVideo = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (!targetVisibleRef.current) return;
    setTargetVisible(true);

    const shouldMute = effectiveVideoMutedRef.current;
    videoEl.muted = shouldMute;
    videoEl.defaultMuted = shouldMute;
    videoEl.playsInline = videoOptions.playsInline;
    videoEl.playbackRate = videoOptions.playbackRate;

    if (!videoOptions.autoplay) return;

    const playPromise = videoEl.play();
    if (playPromise?.then) {
      playPromise
        .then(() => {
          setVideoError(null);
          if (!videoEl.muted) setAudioUnlockNeeded(false);
        })
        .catch((err) => {
          if (!videoEl.muted) {
            setAudioUnlockNeeded(true);
            console.error("Unmuted video playback was blocked", err);
            return;
          }

          console.error("Video playback failed", err);
        });
    }
  };

  const enableViewerAudio = () => {
    const videoEl = videoRef.current;
    setAudioUnlockNeeded(false);
    if (!videoEl) return;
    if (audioUnlockInFlightRef.current) return;

    videoEl.muted = false;
    videoEl.defaultMuted = false;
    videoEl.volume = 1;
    videoEl.playsInline = videoOptions.playsInline;
    videoEl.playbackRate = videoOptions.playbackRate;

    if (targetVisibleRef.current || videoOptions.autoplay) {
      const shouldPauseAfterPrime = !targetVisibleRef.current;
      videoEl.load();
      audioUnlockInFlightRef.current = true;
      const playPromise = videoEl.play();
      const onUnlocked = () => {
        audioUnlockInFlightRef.current = false;
        setAudioEnabled(true);
        setVideoError(null);
        setAudioUnlockNeeded(false);
        if (shouldPauseAfterPrime) {
          videoEl.pause();
          applyVideoStartTime(videoEl);
        }
      };
      const onBlocked = (err) => {
        audioUnlockInFlightRef.current = false;
        console.error("Video audio playback failed", err);
        setAudioEnabled(false);
        setAudioUnlockNeeded(true);
      };

      if (playPromise?.then) {
        playPromise.then(onUnlocked).catch(onBlocked);
      } else {
        onUnlocked();
      }
    }
  };

  useEffect(() => {
    if (contentType !== "video") return undefined;
    if (!startsUnmutedFromStudio || !videoOptions.autoplay) return undefined;
    if (audioEnabled && !audioUnlockNeeded) return undefined;
    if (shouldWaitForStartGesture && !sceneStarted) return undefined;

    const handleViewerGesture = () => {
      if (!videoRef.current) return;
      enableViewerAudio();
    };

    const options = { capture: true, passive: true };
    window.addEventListener("pointerdown", handleViewerGesture, options);
    window.addEventListener("touchend", handleViewerGesture, options);
    window.addEventListener("keydown", handleViewerGesture, { capture: true });

    return () => {
      window.removeEventListener("pointerdown", handleViewerGesture, options);
      window.removeEventListener("touchend", handleViewerGesture, options);
      window.removeEventListener("keydown", handleViewerGesture, { capture: true });
    };
  }, [
    contentType,
    startsUnmutedFromStudio,
    videoOptions.autoplay,
    videoOptions.playsInline,
    videoOptions.playbackRate,
    shouldWaitForStartGesture,
    sceneStarted,
    audioEnabled,
    audioUnlockNeeded
  ]);

  const handleStartExperience = () => {
    trackViewerEvent("launch_clicked", { auto: false }, { dedupeKey: "launch" });

    if (startsUnmutedFromStudio) {
      enableViewerAudio();
    }

    setSceneStarted(true);
  };

  useEffect(() => {
    if (!hasBootData || !sceneStarted) {
      setTargetVisible(false);
      targetVisibleRef.current = false;
      return undefined;
    }

    const targetEl = targetRef.current;
    if (!targetEl) return undefined;

    const targetFoundEvent = isEightWallEngine ? "xrextrasfound" : "targetFound";
    const targetLostEvent = isEightWallEngine ? "xrextraslost" : "targetLost";

    const onTargetFound = () => {
      targetVisibleRef.current = true;
      setTargetVisible(true);
      trackViewerEvent("marker_found", { engine: selectedArEngine });
    };

    const onTargetLost = () => {
      targetVisibleRef.current = false;
      setTargetVisible(false);
      trackViewerEvent("marker_lost", { engine: selectedArEngine });
    };

    targetEl.addEventListener(targetFoundEvent, onTargetFound);
    targetEl.addEventListener(targetLostEvent, onTargetLost);

    return () => {
      targetVisibleRef.current = false;
      setTargetVisible(false);
      targetEl.removeEventListener(targetFoundEvent, onTargetFound);
      targetEl.removeEventListener(targetLostEvent, onTargetLost);
    };
  }, [hasBootData, sceneStarted, isEightWallEngine, selectedArEngine, trackViewerEvent]);

  useEffect(() => {
    if (!ready || !project || contentType !== "video") return;
    if (!sceneStarted) return;

    const videoEl = videoRef.current;
    const targetEl = targetRef.current;
    if (!videoEl || !targetEl) return;

    const updateVideoPlane = () => {
      const ratio = videoEl.videoWidth && videoEl.videoHeight ? videoEl.videoWidth / videoEl.videoHeight : 16 / 9;
      setVideoPlaneSize(calculateVideoPlaneSize(ratio, markerAspectRatio, videoOptions));
    };

    const onCanPlay = () => {
      videoEl.playbackRate = videoOptions.playbackRate;
      applyVideoStartTime(videoEl);
      trackViewerEvent("content_loaded", { source: "video_canplay" }, { once: true });

      if (targetVisibleRef.current) {
        playVideo();
      }
    };

    const onVideoPlay = () => {
      trackViewerEvent("video_started", {
        muted: Boolean(videoEl.muted),
        autoplay: Boolean(videoOptions.autoplay)
      });
    };

    const onTargetFound = () => {
      targetVisibleRef.current = true;
      setTargetVisible(true);
      if (videoOptions.restartOnTargetFound) {
        applyVideoStartTime(videoEl);
      }

      playVideo();
    };

    const onTargetLost = () => {
      targetVisibleRef.current = false;
      setTargetVisible(false);
      if (videoOptions.pauseWhenTargetLost) {
        videoEl.pause();
      }
    };

    const onVideoError = () => {
      setVideoError(
        "Video failed to load. Try MP4 (H.264) or WebM and verify the uploaded file URL."
      );
      trackViewerEvent("viewer_error", {
        code: "video_playback_error",
        message: "Video failed to load or play."
      });
    };

    const onVideoEnded = () => {
      recordVideoCompletionForCta();
      lastVideoTimeRef.current = null;
    };

    const onVideoTimeUpdate = () => {
      const currentTime = videoEl.currentTime;
      if (didVideoWrapToStart(lastVideoTimeRef.current, currentTime, videoEl.duration)) {
        recordVideoCompletionForCta();
      }
      lastVideoTimeRef.current = currentTime;
    };

    videoEl.addEventListener("loadedmetadata", updateVideoPlane);
    videoEl.addEventListener("canplay", onCanPlay);
    videoEl.addEventListener("play", onVideoPlay);
    videoEl.addEventListener("ended", onVideoEnded);
    videoEl.addEventListener("error", onVideoError);
    videoEl.addEventListener("timeupdate", onVideoTimeUpdate);
    videoEl.addEventListener("seeking", onVideoTimeUpdate);
    videoEl.addEventListener("seeked", onVideoTimeUpdate);
    const videoTimePoll = window.setInterval(onVideoTimeUpdate, 250);
    const targetFoundEvent = isEightWallEngine ? "xrextrasfound" : "targetFound";
    const targetLostEvent = isEightWallEngine ? "xrextraslost" : "targetLost";
    targetEl.addEventListener(targetFoundEvent, onTargetFound);
    targetEl.addEventListener(targetLostEvent, onTargetLost);

    updateVideoPlane();
    lastVideoTimeRef.current = null;
    videoEl.pause();

    return () => {
      targetVisibleRef.current = false;
      setTargetVisible(false);
      videoEl.pause();
      window.clearInterval(videoTimePoll);
      videoEl.removeEventListener("loadedmetadata", updateVideoPlane);
      videoEl.removeEventListener("canplay", onCanPlay);
      videoEl.removeEventListener("play", onVideoPlay);
      videoEl.removeEventListener("ended", onVideoEnded);
      videoEl.removeEventListener("error", onVideoError);
      videoEl.removeEventListener("timeupdate", onVideoTimeUpdate);
      videoEl.removeEventListener("seeking", onVideoTimeUpdate);
      videoEl.removeEventListener("seeked", onVideoTimeUpdate);
      targetEl.removeEventListener(targetFoundEvent, onTargetFound);
      targetEl.removeEventListener(targetLostEvent, onTargetLost);
    };
  }, [
    ready,
    project,
    contentType,
    videoOptions,
    sceneStarted,
    markerAspectRatio,
    isEightWallEngine,
    trackViewerEvent
  ]);

  useEffect(() => {
    if (contentType !== "video") return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.playbackRate = videoOptions.playbackRate;
    videoEl.muted = effectiveVideoMuted;
    videoEl.defaultMuted = effectiveVideoMuted;
    videoEl.playsInline = videoOptions.playsInline;

    if (!videoOptions.autoplay) {
      videoEl.pause();
    }
  }, [contentType, videoOptions, effectiveVideoMuted]);

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
    if (shouldWaitForStartGesture) return;
    trackViewerEvent("launch_clicked", { auto: true }, { dedupeKey: "launch" });
    setSceneStarted(true);
  }, [hasBootData, shouldWaitForStartGesture, trackViewerEvent]);

  useEffect(() => {
    if (!hasBootData || !sceneStarted) return;
    if (!isMindAREngine) return;
    if (mindArStartedRef.current) return;

    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const startMindAR = () => {
      const system = sceneEl.systems?.["mindar-image-system"];
      if (!system || mindArStartedRef.current) return;
      if (requiresSecureCameraOrigin()) {
        setCameraError("Camera access on phones requires HTTPS. Use an HTTPS tunnel or deployed domain for AR preview.");
        return;
      }
      setCameraError(null);
      patchMindARCameraSystem(system, trackingOptions);
      system.start();
      mindArStartedRef.current = true;
      queueMindARResize();
    };

    const handleArReady = () => {
      queueMindARResize();
    };

    const handleCameraReady = () => {
      setCameraError(null);
      setArSessionReady(true);
      queueMindARResize();
    };

    const handleCameraError = (event) => {
      setArSessionReady(false);
      setCameraError(
        event?.detail?.message ||
          "Camera could not be started. Check browser camera permission and HTTPS."
      );
    };

    sceneEl.addEventListener("webarCameraReady", handleCameraReady);
    sceneEl.addEventListener("webarCameraError", handleCameraError);
    sceneEl.addEventListener("arError", handleCameraError);

    if (sceneEl.hasLoaded) {
      sceneEl.addEventListener("arReady", handleArReady, { once: true });
      startMindAR();
      return () => {
        sceneEl.removeEventListener("arReady", handleArReady);
        sceneEl.removeEventListener("webarCameraReady", handleCameraReady);
        sceneEl.removeEventListener("webarCameraError", handleCameraError);
        sceneEl.removeEventListener("arError", handleCameraError);
      };
    }

    const handleSceneLoaded = () => {
      sceneEl.addEventListener("arReady", handleArReady, { once: true });
      startMindAR();
    };

    sceneEl.addEventListener("loaded", handleSceneLoaded, { once: true });
    return () => {
      sceneEl.removeEventListener("loaded", handleSceneLoaded);
      sceneEl.removeEventListener("arReady", handleArReady);
      sceneEl.removeEventListener("webarCameraReady", handleCameraReady);
      sceneEl.removeEventListener("webarCameraError", handleCameraError);
      sceneEl.removeEventListener("arError", handleCameraError);
    };
  }, [hasBootData, sceneStarted, isMindAREngine, queueMindARResize, trackingOptions]);

  useEffect(() => {
    if (!hasBootData || !sceneStarted) return;
    if (!isEightWallEngine) return;

    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const markReady = () => {
      setArSessionReady(true);
    };

    if (sceneEl.hasLoaded) {
      window.setTimeout(markReady, 250);
      return undefined;
    }

    sceneEl.addEventListener("loaded", markReady, { once: true });
    sceneEl.addEventListener("realityready", markReady, { once: true });

    return () => {
      sceneEl.removeEventListener("loaded", markReady);
      sceneEl.removeEventListener("realityready", markReady);
    };
  }, [hasBootData, sceneStarted, isEightWallEngine]);

  useEffect(() => {
    if (!arSessionReady) {
      setBrandSplashComplete(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setBrandSplashComplete(true);
    }, BRAND_SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [arSessionReady]);

  useEffect(() => {
    resizeMindARToViewport();
  }, [resizeMindARToViewport, viewportSize]);

  if (error) return <p style={{ padding: 24 }}>{error}</p>;
  if (engineError)
    return (
      <p style={{ padding: 24 }}>
        Failed to load {isEightWallEngine ? "8th Wall" : "MindAR"} engine. Check console for
        details.
      </p>
    );

  const videoScale = `${videoOptions.flipHorizontal ? -1 : 1} ${videoOptions.flipVertical ? -1 : 1} 1`;
  const mindArConfig = [
    `imageTargetSrc: ${mindTargetSrc}`,
    "autoStart: false",
    `filterMinCF: ${trackingOptions.filterMinCF}`,
    `filterBeta: ${trackingOptions.filterBeta}`,
    `warmupTolerance: ${trackingOptions.warmupTolerance}`,
    `missTolerance: ${trackingOptions.missTolerance}`
  ].join("; ");
  const poseSmoothingConfig = [
    `enabled: ${trackingOptions.poseSmoothingEnabled}`,
    `amount: ${trackingOptions.poseSmoothingAmount}`,
    `positionDeadband: ${trackingOptions.poseSmoothingDeadband}`,
    `rotationDeadband: ${trackingOptions.poseRotationDeadband}`
  ].join("; ");
  const sceneEngineProps = isEightWallEngine
    ? {
        xrconfig:
          "allowedDevices: any; cameraDirection: back; disableDefaultEnvironment: true; disableDesktopCameraControls: true; disableDesktopTouchEmulation: true",
        xrweb: "disableWorldTracking: true; scale: responsive",
        "xrextras-runtime-error": ""
      }
    : {
        "mindar-image": mindArConfig
      };
  const targetEngineProps = isEightWallEngine
    ? {
        "xrextras-named-image-target": `name: ${trackingOptions.eighthWallTargetName}`
      }
    : {
        "mindar-image-target": "targetIndex: 0",
        "webar-pose-smoothing": poseSmoothingConfig
      };
  const targetReady = isEightWallEngine ? eighthWallConfigured : Boolean(mindTargetSrc);
  const showBrandSplash = arSessionReady && !brandSplashComplete;
  const showLoadingOverlay =
    !sceneStarted ||
    !project ||
    !engineRuntimeReady ||
    !targetReady ||
    !arSessionReady ||
    !brandSplashComplete;
  const canClickStart = Boolean(
    project &&
      engineRuntimeReady &&
      targetReady &&
      !sceneStarted &&
      shouldWaitForStartGesture
  );
  const loadingProgressPercent = Math.round(loadingProgress);
  const showLaunchScreen = canClickStart && loadingProgressPercent >= 100;
  const showCoverLoading =
    Boolean(resolvedLoadingBackgroundUrl) &&
    !showBrandSplash &&
    (!shouldWaitForStartGesture || showLaunchScreen);
  const startButtonText = loadingScreen.startButtonText || "Launch";
  const loadingLabel =
    !project
      ? "Fetching experience..."
      : !engineRuntimeReady
        ? "Initializing AR engine..."
        : cameraError
          ? "Camera setup needed"
        : sceneStarted && !arSessionReady
          ? "Starting camera..."
        : isEightWallEngine
          ? eighthWallTargetPreparing
            ? "Preparing 8th Wall target..."
            : eighthWallTargetError
              ? "8th Wall target unavailable"
              : "Ready to start"
          : mindTargetPreparing
          ? "Preparing marker target..."
            : mindTargetError
              ? "Marker target unavailable"
              : "Ready to start";
  const loadingDetail = "";
  const targetErrorMessage =
    cameraError || (isEightWallEngine ? eighthWallTargetError : mindTargetError);
  const scanInstructionText = loadingScreen.scanInstructionText;
  const showScanOverlay = Boolean(
    sceneStarted &&
      arSessionReady &&
      brandSplashComplete &&
      !showLoadingOverlay &&
      !targetVisible &&
      (scanInstructionText || loadingScreen.showScanAnimation)
  );
  const showVideoCta = Boolean(
    videoCtaVisible &&
      contentType === "video" &&
      videoOptions.ctaEnabled &&
      videoOptions.ctaUrl &&
      (targetVisible || targetVisibleRef.current) &&
      !showLoadingOverlay
  );
  const videoCtaLabel = videoOptions.ctaLabel || "Learn More";
  const loadingOrbitIcons =
    contentType === "video"
      ? ["camera", "target", "video", "audio", "spark", "phone"]
      : ["camera", "target", "cube", "image", "spark", "phone"];
  const loaderOnImage = showCoverLoading;
  const loaderTextColor = loaderOnImage ? "#ffffff" : "#244543";
  const loaderMutedColor = loaderOnImage ? "rgba(255,255,255,0.86)" : "#6e8583";
  const loaderTrackBackground = loaderOnImage
    ? "rgba(255, 255, 255, 0.28)"
    : "rgba(238, 247, 246, 0.96)";
  const loaderTrackShadow = loaderOnImage
    ? "0 18px 42px rgba(0, 0, 0, 0.22)"
    : "0 16px 36px rgba(8, 27, 39, 0.12)";
  const loaderButtonStyles = loaderOnImage
    ? {
        border: "1px solid rgba(255,255,255,0.72)",
        background: "rgba(255,255,255,0.94)",
        color: "#34766e",
        boxShadow: "0 16px 34px rgba(0,0,0,0.22)"
      }
    : {
        border: "1px solid rgba(105,186,173,0.58)",
        background: "linear-gradient(90deg, #67c8bb, #7fcfc2)",
        color: "#ffffff",
        boxShadow: "0 14px 30px rgba(91, 186, 174, 0.24)"
      };

  const renderLoaderIcon = (iconName) => {
    const iconProps = {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true"
    };

    switch (iconName) {
      case "camera":
        return (
          <svg {...iconProps}>
            <path d="M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l-1.5-2z" />
            <circle cx="12" cy="12.5" r="3.5" />
          </svg>
        );
      case "target":
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v3" />
            <path d="M12 19v3" />
            <path d="M2 12h3" />
            <path d="M19 12h3" />
          </svg>
        );
      case "video":
        return (
          <svg {...iconProps}>
            <rect x="3" y="6" width="13" height="12" rx="2" />
            <path d="m16 10 5-3v10l-5-3z" />
          </svg>
        );
      case "audio":
        return (
          <svg {...iconProps}>
            <path d="M11 5 6 9H3v6h3l5 4z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </svg>
        );
      case "cube":
        return (
          <svg {...iconProps}>
            <path d="M21 16V8l-9-5-9 5v8l9 5z" />
            <path d="m3.3 7.6 8.7 5 8.7-5" />
            <path d="M12 22V12" />
          </svg>
        );
      case "image":
        return (
          <svg {...iconProps}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="8.5" cy="10" r="1.5" />
            <path d="m21 15-4.5-4.5L9 18" />
          </svg>
        );
      case "phone":
        return (
          <svg {...iconProps}>
            <rect x="7" y="2" width="10" height="20" rx="2" />
            <path d="M11 18h2" />
          </svg>
        );
      default:
        return (
          <svg {...iconProps}>
            <path d="M12 3v4" />
            <path d="M12 17v4" />
            <path d="M3 12h4" />
            <path d="M17 12h4" />
            <path d="m5.6 5.6 2.8 2.8" />
            <path d="m15.6 15.6 2.8 2.8" />
            <path d="m18.4 5.6-2.8 2.8" />
            <path d="m8.4 15.6-2.8 2.8" />
          </svg>
        );
    }
  };

  const renderLoadingExperience = () => (
    <div
      className="identifyng-loader-stage"
      style={{
        color: loaderTextColor,
        textShadow: loaderOnImage ? "0 1px 16px rgba(0,0,0,0.48)" : "none"
      }}
    >
      <div className="identifyng-loader-orbit" aria-hidden="true">
        <IdentifyngLogo
          alt=""
          variant={loaderOnImage ? "light" : "dark"}
          className="identifyng-loader-logo"
          width={118}
        />
        <div className="identifyng-loader-orbit-spinner">
          {loadingOrbitIcons.map((iconName, index) => {
            const degree = (360 / loadingOrbitIcons.length) * index;
            return (
              <span
                className="identifyng-loader-icon"
                key={`${iconName}-${index}`}
                style={{
                  transform: `rotate(${degree}deg) translate(var(--loader-radius)) rotate(-${degree}deg)`
                }}
              >
                <span className="identifyng-loader-icon-glyph">
                  {renderLoaderIcon(iconName)}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <p className="identifyng-loader-label" style={{ color: loaderTextColor }}>
        {loadingLabel}
      </p>

      <div
        className="identifyng-loader-progress"
        style={{
          background: loaderTrackBackground,
          boxShadow: loaderTrackShadow
        }}
        aria-label={`${loadingProgressPercent}% loaded`}
      >
        <div
          className="identifyng-loader-progress-fill"
          style={{ width: `${loadingProgressPercent}%` }}
        />
      </div>

      <p className="identifyng-loader-percent" style={{ color: loaderMutedColor }}>
        {loadingProgressPercent}%
      </p>

      {loadingDetail && (
        <p style={{ margin: 0, maxWidth: 360, fontSize: 12, color: loaderMutedColor }}>
          {loadingDetail}
        </p>
      )}

      {targetErrorMessage && (
        <p
          style={{
            margin: 0,
            maxWidth: 360,
            fontSize: 12,
            color: loaderOnImage ? "#ffe3e8" : "#9f1d34",
            padding: "8px 10px",
            borderRadius: 999,
            background: loaderOnImage ? "rgba(145,0,22,0.56)" : "#fff2f4",
            border: loaderOnImage
              ? "1px solid rgba(255,255,255,0.42)"
              : "1px solid rgba(159,29,52,0.24)"
          }}
        >
          {targetErrorMessage}
        </p>
      )}

    </div>
  );

  const renderLaunchExperience = () => (
    <div
      className="identifyng-loader-stage identifyng-loader-stage--launch"
      style={{
        color: loaderTextColor,
        textShadow: loaderOnImage ? "0 1px 16px rgba(0,0,0,0.42)" : "none"
      }}
    >
      <button
        type="button"
        className="identifyng-loader-button"
        onClick={handleStartExperience}
        style={loaderButtonStyles}
      >
        {startButtonText}
      </button>
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: viewportSize.width ? `${viewportSize.width}px` : "100vw",
        height: viewportSize.height ? `${viewportSize.height}px` : "100dvh",
        overflow: "hidden",
        backgroundColor: showLoadingOverlay && !showCoverLoading ? "#ffffff" : "transparent",
        backgroundImage:
          showLoadingOverlay && showCoverLoading
            ? `url(${resolvedLoadingBackgroundUrl})`
            : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center center"
      }}
    >
      <style>{SCAN_OVERLAY_STYLES}</style>
      {showLoadingOverlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            backgroundImage: showCoverLoading
              ? `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.42)), url(${resolvedLoadingBackgroundUrl})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center center"
          }}
        >
          {showLaunchScreen ? renderLaunchExperience() : renderLoadingExperience()}
        </div>
      )}

      {showScanOverlay && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 26,
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24
          }}
        >
          {loadingScreen.showScanAnimation && (
            <div className="identifyng-scan-frame" aria-hidden="true">
              <span className="identifyng-scan-line" />
            </div>
          )}
          {scanInstructionText && (
            <div
              style={{
                position: "fixed",
                left: "50%",
                bottom: "calc(env(safe-area-inset-bottom, 0px) + 84px)",
                transform: "translateX(-50%)",
                width: "min(340px, calc(100vw - 40px))",
                padding: "12px 16px",
                borderRadius: 999,
                background: "rgba(5, 13, 24, 0.74)",
                border: "1px solid rgba(255, 255, 255, 0.28)",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1.35,
                textAlign: "center",
                boxShadow: "0 14px 34px rgba(0, 0, 0, 0.28)",
                backdropFilter: "blur(10px)"
              }}
            >
              {scanInstructionText}
            </div>
          )}
        </div>
      )}

      {showVideoCta && (
        <a
          href={videoOptions.ctaUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => {
            event.stopPropagation();
            trackViewerEvent(
              "cta_clicked",
              { label: videoCtaLabel, url: videoOptions.ctaUrl },
              { beacon: true }
            );
          }}
          style={{
            position: "fixed",
            left: "50%",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 28px)",
            zIndex: 36,
            transform: "translateX(-50%)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "max-content",
            maxWidth: "min(340px, calc(100vw - 40px))",
            minHeight: 44,
            padding: "12px 20px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.7)",
            background: "rgba(255,255,255,0.94)",
            color: "#102033",
            boxShadow: "0 18px 42px rgba(0,0,0,0.28)",
            textDecoration: "none",
            textAlign: "center",
            fontSize: 15,
            fontWeight: 800,
            lineHeight: 1.2,
            overflowWrap: "anywhere",
            backdropFilter: "blur(12px)"
          }}
        >
          {videoCtaLabel}
        </a>
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
      {project && engineRuntimeReady && targetReady && (
        <a-scene
          ref={sceneRef}
          embedded
          {...sceneEngineProps}
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
          loading-screen="enabled: false"
          renderer="alpha: true; colorManagement: true; physicallyCorrectLights: true"
          style={{
            background: "transparent",
            width: "100%",
            height: "100%",
            display: "block"
          }}
        >
          <a-assets>
            {contentType === "video" ? (
              <video
                id="video-overlay"
                ref={videoRef}
                src={resolvedContentUrl}
                autoPlay={false}
                muted={effectiveVideoMuted}
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

          <a-camera
            position="0 0 0"
            look-controls="enabled: false"
            wasd-controls="enabled: false"
          ></a-camera>

          <a-entity ref={targetRef} {...targetEngineProps}>
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
