import { useEffect, useState } from "react";

let loadPromise;
const AFRAME_SCRIPT_ID = "aframe-runtime";
const MINDAR_SCRIPT_ID = "mindar-image-aframe-runtime";
const AFRAME_SRC =
  "https://cdn.jsdelivr.net/npm/aframe@1.5.0/dist/aframe-v1.5.0.min.js";
const MINDAR_SRC =
  "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js";

const loadExternalScript = (id, src) =>
  new Promise((resolve, reject) => {
    const existing = document.getElementById(id);

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }

      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error(`Failed to load script: ${src}`)),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true }
    );
    script.addEventListener(
      "error",
      () => {
        script.remove();
        reject(new Error(`Failed to load script: ${src}`));
      },
      { once: true }
    );
    document.head.appendChild(script);
  });

export const ensureMindARLoaded = async () => {
  if (typeof window === "undefined") return;
  if (window.AFRAME && window.MINDAR?.IMAGE) return;

  if (!loadPromise) {
    loadPromise = loadExternalScript(AFRAME_SCRIPT_ID, AFRAME_SRC)
      .then(() => loadExternalScript(MINDAR_SCRIPT_ID, MINDAR_SRC))
      .catch((err) => {
        loadPromise = undefined;
        throw err;
      });
  }

  return loadPromise;
};

export const useMindAR = () => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    ensureMindARLoaded()
      .then(() => {
        if (active) setReady(true);
      })
      .catch((err) => {
        console.error("Failed to load MindAR", err);
        if (active) setError(err);
      });

    return () => {
      active = false;
    };
  }, []);

  return { ready, error };
};
