import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import TextNormalizerClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "text-normalizer",
  "/tools/language/text-normalizer"
);

export default function TextNormalizerPage() {
  return <TextNormalizerClient />;
}
