import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import JsonFormatterClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "json-formatter",
  "/tools/developer/json-formatter"
);

export default function JsonFormatterPage() {
  return <JsonFormatterClient />;
}
