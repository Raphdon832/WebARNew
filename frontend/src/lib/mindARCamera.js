const buildCameraConstraints = ({ cameraWidth = 1280, cameraHeight = 720 } = {}) => [
  {
    audio: false,
    video: {
      facingMode: { ideal: "environment" },
      width: { ideal: cameraWidth },
      height: { ideal: cameraHeight },
      frameRate: { ideal: 30, max: 30 }
    }
  },
  {
    audio: false,
    video: {
      facingMode: "environment",
      width: { ideal: cameraWidth },
      height: { ideal: cameraHeight }
    }
  },
  {
    audio: false,
    video: {
      facingMode: "environment"
    }
  }
];

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
