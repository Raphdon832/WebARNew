import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProjectBySlug } from "../api/projects";
import { useMindAR } from "../lib/useMindAR";

const Viewer = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [videoNeedsInteraction, setVideoNeedsInteraction] = useState(false);
  const videoRef = useRef(null);
  const targetRef = useRef(null);

  const { ready, error: mindArError } = useMindAR();

  useEffect(() => {
    fetchProjectBySlug(slug)
      .then(setProject)
      .catch((err) => {
        console.error(err);
        setError("Experience not found or unavailable.");
      });
  }, [slug]);

  const playVideo = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.playsInline = true;

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
    if (!ready || !project || project.config?.contentType !== "video") return;

    const videoEl = videoRef.current;
    const targetEl = targetRef.current;
    if (!videoEl || !targetEl) return;

    const onCanPlay = () => playVideo();
    const onTargetFound = () => playVideo();
    const onTargetLost = () => videoEl.pause();
    const onVideoError = () => {
      setVideoError(
        "Video failed to load. Try MP4 (H.264) or WebM and verify the uploaded file URL."
      );
    };

    videoEl.addEventListener("canplay", onCanPlay);
    videoEl.addEventListener("error", onVideoError);
    targetEl.addEventListener("targetFound", onTargetFound);
    targetEl.addEventListener("targetLost", onTargetLost);

    playVideo();

    return () => {
      videoEl.removeEventListener("canplay", onCanPlay);
      videoEl.removeEventListener("error", onVideoError);
      targetEl.removeEventListener("targetFound", onTargetFound);
      targetEl.removeEventListener("targetLost", onTargetLost);
    };
  }, [ready, project]);

  if (error) return <p style={{ padding: 24 }}>{error}</p>;
  if (mindArError)
    return <p style={{ padding: 24 }}>Failed to load AR engine. Check console for details.</p>;
  if (!project || !ready) return <p style={{ padding: 24 }}>Loading AR experience...</p>;

  const { markerImageUrl, mindFileUrl: explicitMindFileUrl, contentType, contentUrl, labelText } =
    project.config;
  const mindFileUrl =
    explicitMindFileUrl || markerImageUrl?.replace(/\.(png|jpg|jpeg)$/i, ".mind");

  if (!mindFileUrl) {
    return <p style={{ padding: 24 }}>Marker target (.mind) file is missing for this project.</p>;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#000" }}>
      {videoNeedsInteraction && (
        <button
          type="button"
          onClick={playVideo}
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
        mindar-image={`imageTargetSrc: ${mindFileUrl}; autoStart: true;`}
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: true"
        renderer="colorManagement: true, physicallyCorrectLights"
      >
        <a-assets>
          {contentType === "video" ? (
            <video
              id="video-overlay"
              ref={videoRef}
              src={contentUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              crossOrigin="anonymous"
              webkit-playsinline="true"
            ></video>
          ) : (
            <a-asset-item id="model" src={contentUrl}></a-asset-item>
          )}
        </a-assets>

        <a-camera position="0 0 0" look-controls="enabled: true"></a-camera>

        <a-entity ref={targetRef} mindar-image-target="targetIndex: 0">
          {contentType === "video" ? (
            <a-video
              src="#video-overlay"
              position="0 0 0"
              width="1"
              height="0.5625"
              material="shader: flat; side: double;"
            ></a-video>
          ) : (
            <a-gltf-model
              src="#model"
              position="0 0 0"
              scale="0.2 0.2 0.2"
              rotation="0 0 0"
            ></a-gltf-model>
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
      </a-scene>
    </div>
  );
};

export default Viewer;
