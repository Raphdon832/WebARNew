import React from "react";

const placeholderStyle = {
  height: 320,
  borderRadius: 16,
  border: "1px dashed rgba(255,255,255,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(255,255,255,0.02)",
  color: "rgba(255,255,255,0.8)",
  fontSize: 18,
  marginBottom: 24
};

const EditorCanvas = () => (
  <div style={placeholderStyle}>
    Future drag-and-drop AR layout canvas
  </div>
);

export default EditorCanvas;
