import type { Metadata } from "next";
import { toolsHub } from "@/content/tools";
import { QuoteCta } from "@/components/mk/home/HomeSections";
import { ToolsHero, ToolsHub } from "@/components/mk/tools/parts";

export const metadata: Metadata = {
  title: "Công cụ nhân sự",
  description: toolsHub.lede,
};

export default function ToolsHubPage() {
  return (
    <>
      <ToolsHero />
      <ToolsHub />
      <QuoteCta />
    </>
  );
}
