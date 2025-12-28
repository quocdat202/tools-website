import type { Metadata } from "next";
import { ToolsLayoutClient } from "@/components/layout/tools-layout-client";
import { generateMetadata } from "@/lib/metadata";

export const metadata: Metadata = generateMetadata({
  title: "Tool Explorer - Browse All Tools",
  description:
    "Browse all available developer tools by category. Converters, formatters, calculators, and more.",
  keywords: [
    "tool explorer",
    "developer tools",
    "online tools",
    "free tools",
    "converters",
    "formatters",
  ],
  path: "/tools",
});

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ToolsLayoutClient>{children}</ToolsLayoutClient>;
}
