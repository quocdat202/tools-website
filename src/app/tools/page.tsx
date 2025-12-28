import type { Metadata } from "next";
import ToolExplorerClient from "./_client";

export const metadata: Metadata = {
  title: "All Tools | DevTools",
  description: "Browse all available developer tools. Convert, format, calculate and more - all in your browser.",
  openGraph: {
    title: "All Tools | DevTools",
    description: "Browse all available developer tools. Convert, format, calculate and more - all in your browser.",
    type: "website",
  },
};

export default function ToolExplorerPage() {
  return <ToolExplorerClient />;
}
