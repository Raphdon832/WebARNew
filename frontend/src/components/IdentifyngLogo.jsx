import React from "react";

const LOGO_SRC = {
  light: "/logos/IDentifyNG_01.svg",
  dark: "/logos/IDentifyNG_02.svg",
  mark: "/logos/IDentifyNG_03.svg"
};

const IdentifyngLogo = ({
  alt = "iDentifyng",
  className = "",
  style,
  variant = "light",
  width = 360
}) => (
  <img
    src={LOGO_SRC[variant] || LOGO_SRC.light}
    alt={alt}
    className={className}
    style={{
      display: "block",
      width,
      height: "auto",
      maxWidth: "100%",
      ...style
    }}
  />
);

export default IdentifyngLogo;
