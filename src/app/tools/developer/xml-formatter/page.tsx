import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import XmlFormatterClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "xml-formatter",
  "/tools/developer/xml-formatter"
);

export default function XmlFormatterPage() {
  return <XmlFormatterClient />;
}
