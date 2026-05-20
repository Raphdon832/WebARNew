import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const ViewerQRCode = ({ url }) => {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!url) {
      setQrDataUrl("");
      setError(null);
      return undefined;
    }

    QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 220,
      color: {
        dark: "#04101f",
        light: "#ffffff"
      }
    })
      .then((dataUrl) => {
        if (!active) return;
        setQrDataUrl(dataUrl);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to generate viewer QR code", err);
        if (active) setError("QR code generation failed.");
      });

    return () => {
      active = false;
    };
  }, [url]);

  if (!url) return null;

  return (
    <div className="qr-panel">
      <div>
        <p>Viewer QR Code</p>
        <span>Scan to open this AR experience on mobile.</span>
      </div>
      <div className="qr-box">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="Viewer QR code" />
        ) : (
          <span>{error || "Generating QR..."}</span>
        )}
      </div>
      {qrDataUrl && (
        <a className="qr-download" href={qrDataUrl} download="viewer-qr-code.png">
          Download QR PNG
        </a>
      )}
    </div>
  );
};

export default ViewerQRCode;
