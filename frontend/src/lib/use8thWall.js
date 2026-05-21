import { useEffect, useState } from "react";
import { loadExternalScript } from "./useMindAR";

let loadPromise;

const AFRAME_SCRIPT_ID = "aframe-runtime";
const XREXTRAS_SCRIPT_ID = "eighthwall-xrextras-runtime";
const XR8_SCRIPT_ID = "eighthwall-engine-runtime";
const AFRAME_SRC =
  "https://cdn.jsdelivr.net/npm/aframe@1.5.0/dist/aframe-v1.5.0.min.js";
const XREXTRAS_SRC = "https://cdn.jsdelivr.net/npm/@8thwall/xrextras@1/dist/xrextras.js";
const XR8_SRC = "https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1/dist/xr.js";

const waitForXR8 = () =>
  new Promise((resolve) => {
    if (window.XR8) {
      resolve(window.XR8);
      return;
    }
    window.addEventListener("xrloaded", () => resolve(window.XR8), { once: true });
  });

const registerAFrameComponents = () => {
  if (!window.AFRAME?.components?.xrweb) {
    window.XR8?.registerAFrameXrComponent?.();
  }
  if (!window.AFRAME?.components?.["xrextras-named-image-target"]) {
    window.XRExtras?.AFrame?.registerXrExtrasComponents?.();
  }
};

export const ensure8thWallLoaded = async () => {
  if (typeof window === "undefined") return;
  if (window.AFRAME && window.XR8 && window.XRExtras) {
    registerAFrameComponents();
    return;
  }

  if (!loadPromise) {
    loadPromise = loadExternalScript(AFRAME_SCRIPT_ID, AFRAME_SRC)
      .then(() => loadExternalScript(XREXTRAS_SCRIPT_ID, XREXTRAS_SRC))
      .then(() =>
        loadExternalScript(XR8_SCRIPT_ID, XR8_SRC, {
          "data-preload-chunks": "slam"
        })
      )
      .then(waitForXR8)
      .then(registerAFrameComponents)
      .catch((err) => {
        loadPromise = undefined;
        throw err;
      });
  }

  return loadPromise;
};

export const use8thWall = (enabled = false) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!enabled) {
      setReady(false);
      setError(null);
      return () => {
        active = false;
      };
    }

    ensure8thWallLoaded()
      .then(() => {
        if (active) setReady(true);
      })
      .catch((err) => {
        console.error("Failed to load 8th Wall", err);
        if (active) setError(err);
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  return { ready, error };
};
