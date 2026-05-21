const buildCameraConstraints = ({
  cameraWidth = 1920,
  cameraHeight = 1080,
  cameraFrameRate = 30,
  cameraFacingMode = "environment"
} = {}) => {
  const minWidth = Math.min(1280, cameraWidth);
  const minHeight = Math.min(720, cameraHeight);
  const frameRate = Math.max(15, Math.min(60, Number(cameraFrameRate) || 30));

  return [
    {
      audio: false,
      video: {
        facingMode: { ideal: cameraFacingMode },
        width: { min: minWidth, ideal: cameraWidth },
        height: { min: minHeight, ideal: cameraHeight },
        frameRate: { ideal: frameRate, max: frameRate },
        resizeMode: "none"
      }
    },
    {
      audio: false,
      video: {
        facingMode: { ideal: cameraFacingMode },
        width: { ideal: cameraWidth },
        height: { ideal: cameraHeight },
        frameRate: { ideal: frameRate }
      }
    },
    {
      audio: false,
      video: {
        facingMode: cameraFacingMode
      }
    },
    {
      audio: false,
      video: true
    }
  ];
};

const applyTrackTuning = async (track) => {
  if (!track?.getCapabilities || !track.applyConstraints) return;

  const capabilities = track.getCapabilities();
  const advanced = {};

  if (capabilities.focusMode?.includes("continuous")) {
    advanced.focusMode = "continuous";
  }
  if (capabilities.exposureMode?.includes("continuous")) {
    advanced.exposureMode = "continuous";
  }
  if (capabilities.whiteBalanceMode?.includes("continuous")) {
    advanced.whiteBalanceMode = "continuous";
  }

  if (!Object.keys(advanced).length) return;

  try {
    await track.applyConstraints({ advanced: [advanced] });
  } catch (_err) {
    // Optional camera controls vary heavily by browser/device.
  }
};

export const patchMindARCameraSystem = (system, trackingOptions = {}) => {
  if (!system || system.__webarHighResolutionCameraPatched) return;

  system.__webarHighResolutionCameraPatched = true;
  system._startVideo = function startHighResolutionVideo() {
    this.video = document.createElement("video");
    this.video.setAttribute("autoplay", "");
    this.video.setAttribute("muted", "");
    this.video.setAttribute("playsinline", "");
    this.video.setAttribute("webkit-playsinline", "true");
    this.video.style.position = "absolute";
    this.video.style.top = "0px";
    this.video.style.left = "0px";
    this.video.style.zIndex = "-2";
    this.container.appendChild(this.video);

    if (!navigator.mediaDevices?.getUserMedia) {
      this.el.emit("arError", { error: "VIDEO_FAIL" });
      this.ui.showCompatibility();
      return;
    }

    const startStream = async () => {
      let lastError = null;

      for (const constraints of buildCameraConstraints(trackingOptions)) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          const [track] = stream.getVideoTracks();
          await applyTrackTuning(track);
          this.__webarCameraSettings = track?.getSettings?.() || null;

          this.video.addEventListener(
            "loadedmetadata",
            () => {
              this.video.setAttribute("width", this.video.videoWidth);
              this.video.setAttribute("height", this.video.videoHeight);
              this._startAR();
            },
            { once: true }
          );

          this.video.srcObject = stream;
          this.video.play?.().catch(() => {});
          return;
        } catch (err) {
          lastError = err;
        }
      }

      console.log("getUserMedia error", lastError);
      this.el.emit("arError", { error: "VIDEO_FAIL" });
    };

    startStream();
  };
};
