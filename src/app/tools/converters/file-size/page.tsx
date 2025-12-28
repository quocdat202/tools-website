import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/metadata";
import FileSizeClient from "./_client";

export const metadata: Metadata = getToolMetadata(
  "file-size",
  "/tools/converters/file-size"
);

export default function FileSizePage() {
  return <FileSizeClient />;
}
