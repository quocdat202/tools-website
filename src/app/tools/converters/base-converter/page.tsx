import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import BaseConverterClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "base-converter",
  "/tools/converters/base-converter"
);

export default function BaseConverterPage() {
  return <BaseConverterClient />;
}
