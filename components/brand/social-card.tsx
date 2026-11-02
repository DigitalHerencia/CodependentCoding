import { CodependentMark } from "@/components/brand/codependent-mark";
import { siteOperator } from "@/content/public";

/** Inline styles are required by the Open Graph image renderer. */
export function SocialCard({
  title,
  chapter,
}: {
  title: string;
  chapter?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "56px 64px",
        background: "#0B0F12",
        color: "#E6ECEF",
        borderBottom: "12px solid #00A6A6",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          color: "#21D4C2",
        }}
      >
        <CodependentMark width={130} height={74} title="" aria-hidden="true" />
        <span style={{ fontSize: 24, letterSpacing: 3 }}>
          CODEPENDENT CODING™
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <span style={{ fontSize: 22, color: "#21D4C2" }}>
          {chapter ?? "THE WEB APP ARCHITECTURE"}
        </span>
        <div
          style={{ fontSize: title.length > 85 ? 44 : 56, lineHeight: 1.15 }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          color: "#9AA7AE",
        }}
      >
        <span>{siteOperator.name}</span>
        <span>Nothing to borrow. We checked.</span>
      </div>
    </div>
  );
}
