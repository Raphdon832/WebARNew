import React from "react";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(8,14,32,0.6)",
  color: "#fff",
  marginBottom: 16
};

const labelStyle = {
  display: "block",
  fontSize: 14,
  marginBottom: 6,
  color: "rgba(255,255,255,0.7)"
};

const AssetUploader = ({ label, placeholder, value, onChange, type = "text" }) => (
  <label style={{ display: "block", width: "100%" }}>
    <span style={labelStyle}>{label}</span>
    <input
      type={type}
      style={inputStyle}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);

export default AssetUploader;
