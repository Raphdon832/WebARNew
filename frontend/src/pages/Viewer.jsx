import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectBySlug } from "../api/projects";
import { useMindAR } from "../lib/useMindAR";
import { use8thWall } from "../lib/use8thWall";
import { normalizeVideoOptions } from "../lib/videoOptions";
import { normalizeLoadingScreenOptions } from "../lib/loadingScreenOptions";
import { normalizeTrackingOptions } from "../lib/trackingOptions";
import { patchMindARCameraSystem } from "../lib/mindARCamera";
import { registerMindARPoseSmoothing } from "../lib/mindARPoseSmoothing";
import { compileMindFileFromImageUrl } from "../lib/mindFileCompiler";

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

const createEightWallTargetFromImage = (imageUrl, targetName) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const width = image.naturalWidth || 640;
      const height = image.naturalHeight || 480;
      const now = Date.now();

      resolve({
        imagePath: imageUrl,
        metadata: null,
        name: targetName || "webar-marker",
        type: "PLANAR",
        properties: {
          top: 0,
          left: 0,
          width,
          height,
          originalWidth: width,
          originalHeight: height,
          isRotated: false
        },
        resources: {
          originalImage: imageUrl,
          croppedImage: imageUrl,
          thumbnailImage: imageUrl,
          luminanceImage: imageUrl
        },
        created: now,
        updated: now
      });
    };
    image.onerror = () => reject(new Error("Failed to load marker image for 8th Wall target."));
    image.src = imageUrl;
  });

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
  const [eighthWallTargetData, setEighthWallTargetData] = useState(null);
  const [eighthWallTargetPreparing, setEighthWallTargetPreparing] = useState(false);
  const [eighthWallTargetFallbackActive, setEighthWallTargetFallbackActive] = useState(false);
  const [eighthWallTargetError, setEighthWallTargetError] = useState(null);
  const [eighthWallConfigured, setEighthWallConfigured] = useState(false);
  const [poseSmoothingReady, setPoseSmoothingReady] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [markerAspectRatio, setMarkerAspectRatio] = useState(1);
  const [videoPlaneSize, setVideoPlaneSize] = useState({ width: 1, height: 1 });
  const [viewportSize, setViewportSize] = useState(getViewportSize);
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const targetRef = useRef(null);
  const mindArStartedRef = useRef(false);
  const targetVisibleRef = useRef(false);

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
    setEighthWallTargetData(null);
    setEighthWallTargetPreparing(false);
    setEighthWallTargetFallbackActive(false);
    setEighthWallTargetError(null);
    setEighthWallConfigured(false);
    setPoseSmoothingReady(false);
    targetVisibleRef.current = false;
    mindArStartedRef.current = false;
  }, [slug]);

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
  const mindFileUrl =
    normalizeAssetUrl(explicitMindFileUrl || markerImageUrl?.replace(/\.(png|jpg|jpeg)$/i, ".mind"));
  const resolvedMarkerImageUrl = normalizeAssetUrl(markerImageUrl);
  const resolvedContentUrl = normalizeAssetUrl(contentUrl);
  const resolvedLoadingBackgroundUrl = normalizeAssetUrl(loadingScreen.backgroundImageUrl);
  const engineRuntimeReady = ready && (isEightWallEngine || poseSmoothingReady);
  const hasBootData = Boolean(
    project &&
      engineRuntimeReady &&
      (isEightWallEngine ? eighthWallConfigured : mindTargetSrc)
  );

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
    let compiledMindObjectUrl = null;

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
  }, [project, ready, isMindAREngine, mindFileUrl, resolvedMarkerImageUrl]);

  useEffect(() => {
    let active = true;

    setEighthWallTargetData(null);
    setEighthWallConfigured(false);
    setEighthWallTargetError(null);
    setEighthWallTargetFallbackActive(false);

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
        } else if (resolvedMarkerImageUrl) {
          targetData = await createEightWallTargetFromImage(
            resolvedMarkerImageUrl,
            trackingOptions.eighthWallTargetName
          );
          setEighthWallTargetFallbackActive(true);
        } else {
          throw new Error("Provide a marker image or 8th Wall target JSON.");
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

  const applyVideoStartTime = (videoEl) => {
    if (!videoEl) return;
    if (!Number.isFinite(videoEl.duration) || videoOptions.startTimeSec <= 0) return;
    if (videoOptions.startTimeSec >= videoEl.duration) return;
    videoEl.currentTime = videoOptions.startTimeSec;
  };

  const playVideo = (force = false) => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (!targetVisibleRef.current) return;

    videoEl.muted = videoOptions.muted;
    videoEl.defaultMuted = videoOptions.muted;
    videoEl.playsInline = videoOptions.playsInline;
    videoEl.playbackRate = videoOptions.playbackRate;

    if (!force && !videoOptions.autoplay) return;

    const playPromise = videoEl.play();
    if (playPromise?.then) {
      playPromise
        .then(() => {
          setVideoError(null);
        })
        .catch((err) => {
          // Mobile browsers block audible autoplay. Keep the experience automatic by falling
          // back to muted playback instead of showing a second tap-to-play prompt.
          if (!videoEl.muted) {
            videoEl.muted = true;
            videoEl.defaultMuted = true;
            videoEl.play().catch((retryErr) => {
              console.error("Video playback failed", retryErr);
            });
            return;
          }

          console.error("Video playback failed", err);
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
      setVideoPlaneSize(calculateVideoPlaneSize(ratio, markerAspectRatio, videoOptions));
    };

    const onCanPlay = () => {
      videoEl.playbackRate = videoOptions.playbackRate;
      applyVideoStartTime(videoEl);

      if (targetVisibleRef.current) {
        playVideo(true);
      }
    };

    const onTargetFound = () => {
      targetVisibleRef.current = true;
      if (videoOptions.restartOnTargetFound) {
        applyVideoStartTime(videoEl);
      }

      playVideo(true);
    };

    const onTargetLost = () => {
      targetVisibleRef.current = false;
      // Always pause media audio when marker leaves camera view.
      videoEl.pause();
    };

    const onVideoError = () => {
      setVideoError(
        "Video failed to load. Try MP4 (H.264) or WebM and verify the uploaded file URL."
      );
    };

    videoEl.addEventListener("loadedmetadata", updateVideoPlane);
    videoEl.addEventListener("canplay", onCanPlay);
    videoEl.addEventListener("error", onVideoError);
    const targetFoundEvent = isEightWallEngine ? "xrextrasfound" : "targetFound";
    const targetLostEvent = isEightWallEngine ? "xrextraslost" : "targetLost";
    targetEl.addEventListener(targetFoundEvent, onTargetFound);
    targetEl.addEventListener(targetLostEvent, onTargetLost);

    updateVideoPlane();
    videoEl.pause();

    return () => {
      targetVisibleRef.current = false;
      videoEl.pause();
      videoEl.removeEventListener("loadedmetadata", updateVideoPlane);
      videoEl.removeEventListener("canplay", onCanPlay);
      videoEl.removeEventListener("error", onVideoError);
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
    isEightWallEngine
  ]);

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
    if (!isMindAREngine) return;
    if (mindArStartedRef.current) return;

    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const startMindAR = () => {
      const system = sceneEl.systems?.["mindar-image-system"];
      if (!system || mindArStartedRef.current) return;
      patchMindARCameraSystem(system, trackingOptions);
      system.start();
      mindArStartedRef.current = true;
      queueMindARResize();
    };

    const handleArReady = () => {
      queueMindARResize();
    };

    if (sceneEl.hasLoaded) {
      sceneEl.addEventListener("arReady", handleArReady, { once: true });
      startMindAR();
      return () => {
        sceneEl.removeEventListener("arReady", handleArReady);
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
    };
  }, [hasBootData, sceneStarted, isMindAREngine, queueMindARResize, trackingOptions]);

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
  const showLoadingOverlay = !sceneStarted || !project || !engineRuntimeReady || !targetReady;
  const canClickStart = Boolean(
    project && engineRuntimeReady && targetReady && loadingScreen.showStartButton
  );
  const loadingLabel =
    !project
      ? "Fetching experience..."
      : !engineRuntimeReady
        ? "Initializing AR engine..."
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

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: viewportSize.width ? `${viewportSize.width}px` : "100vw",
        height: viewportSize.height ? `${viewportSize.height}px` : "100dvh",
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
            {isEightWallEngine && eighthWallTargetFallbackActive && !eighthWallTargetPreparing && (
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "rgba(255,209,102,0.9)" }}>
                Using experimental marker-derived 8th Wall target data.
              </p>
            )}
            {!isEightWallEngine && mindTargetFallbackActive && !mindTargetPreparing && (
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "rgba(133,255,205,0.86)" }}>
                Marker target regenerated automatically.
              </p>
            )}
            {(mindTargetError || eighthWallTargetError) && (
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
                {isEightWallEngine ? eighthWallTargetError : mindTargetError}
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
