import type { Metadata } from "next";
import { FaqList } from "@/components/blocks/faq-list";

export const metadata: Metadata = { title: "FAQ · Codependent Coding™" };

export default function Page() {
  return <FaqList />;
}
