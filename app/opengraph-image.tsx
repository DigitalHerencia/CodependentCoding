import { ImageResponse } from "next/og";
import { SocialCard } from "@/components/brand/social-card";
import { siteOperator } from "@/content/public";

export const alt = siteOperator.site;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialCard title={siteOperator.site} />, size);
}
