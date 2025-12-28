import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import TimestampConverterClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "timestamp-converter",
  "/tools/converters/timestamp-converter"
);

export default function TimestampConverterPage() {
  return <TimestampConverterClient />;
}
