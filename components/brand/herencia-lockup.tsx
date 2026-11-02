import type { SVGProps } from "react";

export function HerenciaLockup(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 440 220"
      fill="currentColor"
      role="img"
      aria-label="Digital Herencia, a data cartel"
      {...props}
    >
      <title>Digital Herencia, a data cartel</title>
      <path d="M157 18h20v64h-11v13h-9Zm31-12h9v10h-9Zm0 22h9v22h-9Zm0 33h9v83h-9Zm21-55h9v10h-9Zm0 22h21v31h-21Zm0 44h21v41h-21Zm0 54h9v21h-9Zm33-120h10v22h10v31h-20Zm0 66h20v53h-20Zm0 66h10v10h-10Zm32-122h10v12h11v31h-11v16h-10Zm0 71h10v11h-10Zm0 25h10v13h11v10h-21ZM157 109h20v11h-11v12h-9Z" />
      <g
        textAnchor="middle"
        style={{ fontFamily: "var(--type-heading)", fontWeight: 700 }}
      >
        <text x="220" y="179" fontSize="29" letterSpacing="2">
          DIGITAL HERENCIA
        </text>
        <text x="220" y="207" fontSize="15" letterSpacing="3">
          A DATA CARTEL
        </text>
      </g>
    </svg>
  );
}
