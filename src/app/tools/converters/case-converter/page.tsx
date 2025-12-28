import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import CaseConverterClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "case-converter",
  "/tools/converters/case-converter"
);

export default function CaseConverterPage() {
  return <CaseConverterClient />;
}
