import React from "react";

/**
 * iDentifyng brand wordmark (reused from the Studio app).
 * Accent teal #7fcfc2, wordmark grey #b7b7b7.
 */
const Logo = ({ width = 184, className = "" }) => (
  <svg
    className={className}
    width={width}
    viewBox="0 0 760 190"
    fill="none"
    role="img"
    aria-label="iDentifyng Technologies"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>iDentifyng Technologies</title>
    <g transform="translate(18 24)">
      <g stroke="#7fcfc2" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M29 118V60" />
        <path d="M29 37v-6" />
        <path d="M52 134V34c0-12 10-22 22-22h48c39 0 68 28 68 64s-29 64-68 64H75" />
        <path d="M77 115V37h43c24 0 42 17 42 39s-18 39-42 39H77z" />
        <path d="M101 91V61h20c9 0 16 7 16 15s-7 15-16 15h-20z" />
        <path d="M11 77c7-8 15-12 24-12" opacity="0.55" />
        <path d="M10 103c7-8 15-12 24-12" opacity="0.55" />
        <path d="M179 34c8 10 13 23 13 39" opacity="0.62" />
        <path d="M165 15c6 3 11 7 15 12" opacity="0.55" />
      </g>
      <g fill="#7fcfc2" opacity="0.8">
        <circle cx="18" cy="20" r="5" />
        <circle cx="195" cy="18" r="4" />
        <circle cx="204" cy="53" r="3.5" />
        <circle cx="8" cy="52" r="3.5" />
        <circle cx="39" cy="20" r="3.5" />
      </g>
    </g>
    <text x="226" y="126" fill="#dfe7ec" fontFamily="'Space Grotesk', Inter, Arial, sans-serif" fontSize="95" fontWeight="700">
      entify
    </text>
    <text x="578" y="126" fill="#dfe7ec" fontFamily="'Space Grotesk', Inter, Arial, sans-serif" fontSize="95" fontWeight="800">
      NG
    </text>
    <path d="M0 174H760" stroke="#7fcfc2" strokeWidth="6" />
  </svg>
);

export default Logo;
