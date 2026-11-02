import type { SVGProps } from "react";

/** The crown's architectural rays and central three-line cross, without raster text. */
export function CodependentMark({
  title = "Codependent Coding crown",
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 320 180"
      fill="none"
      role="img"
      aria-label="Codependent Coding crown"
      {...props}
    >
      {title && <title>{title}</title>}
      <g
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M160 8v78M124 30l10 62M196 30l-10 62M92 47l31 54M228 47l-31 54M60 70l52 43M260 70l-52 43M30 99l73 29M290 99l-73 29M13 137l84 8M307 137l-84 8" />
        <path d="M144 91V63l8 7h16l8-7v28M147 96V85a13 13 0 0 1 26 0v11M80 99l-7 9-14-10M240 99l7 9 14-10M43 137l16-5-9-12M277 137l-16-5 9-12M15 157h83M222 157h83" />
        <path
          strokeWidth="3"
          d="M153 113v49M160 107v61M167 113v49M135 130h50M130 137h60M135 144h50"
        />
      </g>
      <g fill="currentColor">
        <circle cx="92" cy="47" r="3" />
        <circle cx="228" cy="47" r="3" />
        <circle cx="60" cy="70" r="3" />
        <circle cx="260" cy="70" r="3" />
        <circle cx="30" cy="99" r="3" />
        <circle cx="290" cy="99" r="3" />
        <circle cx="109" cy="78" r="2" />
        <circle cx="211" cy="78" r="2" />
        <path d="m7 151 6 6-6 6-6-6Zm306 0 6 6-6 6-6-6Z" />
      </g>
    </svg>
  );
}
