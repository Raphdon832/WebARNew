import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const forwardedHost = req.headers.host;
            const forwardedProto = req.headers["x-forwarded-proto"] || "https";
            if (forwardedHost) proxyReq.setHeader("x-forwarded-host", forwardedHost);
            proxyReq.setHeader("x-forwarded-proto", forwardedProto);
          });
        }
      },
      "/uploads": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const forwardedHost = req.headers.host;
            const forwardedProto = req.headers["x-forwarded-proto"] || "https";
            if (forwardedHost) proxyReq.setHeader("x-forwarded-host", forwardedHost);
            proxyReq.setHeader("x-forwarded-proto", forwardedProto);
          });
        }
      }
    }
  }
});
