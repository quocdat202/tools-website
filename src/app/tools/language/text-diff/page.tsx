import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import TextDiffClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "text-diff",
  "/tools/language/text-diff"
);

export default function TextDiffPage() {
  return <TextDiffClient />;
}
