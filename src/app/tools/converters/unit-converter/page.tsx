import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import UnitConverterClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "unit-converter",
  "/tools/converters/unit-converter"
);

export default function UnitConverterPage() {
  return <UnitConverterClient />;
}
