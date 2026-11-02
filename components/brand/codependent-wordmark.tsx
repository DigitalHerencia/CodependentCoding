import type { SVGProps } from "react";

export function CodependentWordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 640 124"
      fill="currentColor"
      role="img"
      aria-label="The Codependent Coding™ Web App Architecture"
      {...props}
    >
      <title>The Codependent Coding™ Web App Architecture</title>
      <g
        textAnchor="middle"
        style={{ fontFamily: "var(--type-heading)", fontWeight: 700 }}
      >
        <text x="320" y="23" fontSize="20" letterSpacing="6">
          THE
        </text>
        <text
          x="320"
          y="72"
          fontSize="38"
          textLength="620"
          lengthAdjust="spacingAndGlyphs"
        >
          CODEPENDENT CODING™
        </text>
        <text x="320" y="109" fontSize="19" letterSpacing="3">
          WEB APP ARCHITECTURE
        </text>
      </g>
    </svg>
  );
}
