import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import ColorConverterClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "color-converter",
  "/tools/converters/color-converter"
);

export default function ColorConverterPage() {
  return <ColorConverterClient />;
}
